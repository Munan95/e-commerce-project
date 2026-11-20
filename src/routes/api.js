const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController.js");
const userController = require("../controllers/userController.js");
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
router.get("/admin-logout", authVarificationAdmin, adminController.logout);
router.put("/admin-update", authVarificationAdmin, adminController.update);

//For user
router.post("/user-register", userController.register);

module.exports = router;