const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController.js");

router.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "API is working!",
    });
});

//For Super Admin
router.post("/admin-register", adminController.register);
router.post("/admin-login", adminController.login);

module.exports = router;