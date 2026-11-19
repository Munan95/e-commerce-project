const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController.js");
const authVarificationAdmin = require("../middlewares/authVarificationAdmin.js");

router.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "API is working!",
    });
});

//For Super Admin
router.post("/admin-register", adminController.register);
router.post("/admin-login", adminController.login);
router.get("/admin", authVarificationAdmin, adminController.admin);
router.get("/admin-verify", authVarificationAdmin, adminController.adminVerify);

module.exports = router;