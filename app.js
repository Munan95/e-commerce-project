const express = require("express");
const app = new express();

const ratelimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const dotENV = require("dotenv");
import router from "./src/routes/api";

dotENV.config();

//connet to database

let URL = process.envnMONGO_URL;

let option ={
    user: process.env.DB_USER,
    pass: process.env.DB-USER,
    autoIndex:true,
    serverSelectionTimeout:5000
}

mongoose
  .connect(URL,option)
  .then( (res) => {
    console.log("Database Connected");
  })
  .catch( (err) => {
    console.log(err);
  });

mongoose.set("strictQuery",false)

//Global Middleware 
app.use(cookieParser());

app.use(
    cors({
        origin: ["http://localhost:3001","http://localhost:3002"],
        credentials: true,
    })
);

app.use(
    helmet.contentSecurityPolicy({
        useDefaults: true,
        directives: {
            "img-src": ["'self'","https: data:"]
        }
    })
)

app.use(mongoSanitize());
app.use(hpp());

app.use(express.json({limite: "50mb"}));
app.use(express.urlencoded({limite: "50mb"}));

const limiter = ratelimit({ windoMs: 15 * 60 * 1000, max: 3000}); //3000 request per 15 minutes par ip
app.use(limiter);

app.use("api/v1", router);
app.use("api/v1/get-file",express.static("uploads"));

module.exports = app;