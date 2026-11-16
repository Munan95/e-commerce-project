const express = require("express");
const app = express();

const ratelimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("@exortek/express-mongo-sanitize");
const hpp = require("hpp");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const router = require("./src/routes/api.js");

dotenv.config();

// Connect to database
const URL = process.env.MONGO_URL;

const option = {
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    autoIndex: true,
    serverSelectionTimeoutMS: 5000,
};

mongoose.set("strictQuery", false);

mongoose
    .connect(URL, option)
    .then(() => {
        console.log("Database Connected");
    })
    .catch((err) => {
        console.log("Database Connection Error:", err);
    });

// Global Middleware
app.use(cookieParser());

app.use(
    cors({
        origin: ["http://localhost:3001", "http://localhost:3002"],
        credentials: true,
    })
);

app.use(
    helmet.contentSecurityPolicy({
        useDefaults: true,
        directives: {
            "img-src": ["'self'", "https:", "data:"],
        },
    })
);

app.use(hpp());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(mongoSanitize());

const limiter = ratelimit({
    windowMs: 15 * 60 * 1000,
    max: 3000,
});

app.use(limiter);

// API Routes
app.use("/api/v1", router);

app.use("/api/v1/get-file", express.static("uploads"));

// Serve Frontend
// const frontendPath = path.join(__dirname,"client","super-admin","dist");

// app.use(
//     "/super-admin",
//     express.static(frontendPath, {
//         index: false,
//     })
// );

// app.get("/super-admin/*", (req, res) => {
//     res.sendFile(path.join(frontendPath, "index.html"));
// });

// app.use(express.static(path.join(__dirname,"client","ecommerce","dist")));
// app.get("/super-admin/*", (req, res) => {
//     res.sendFile(path.join(__dirname,"client","ecommerce","dist","index.html"));
// });

module.exports = app;