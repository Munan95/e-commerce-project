const express = require("express");
const router = express.Router();

//Controller
const adminController = require("../controllers/adminController.js");
const userController = require("../controllers/userController.js");
const productController = require("../controllers/productController.js");

//Middleware
const authVarificationAdmin = require("../middlewares/authVarificationAdmin.js");
const authVarificationUser = require("../middlewares/authVarificationUser.js");

//For Super Admin
router.post("/admin-register", adminController.register);
router.post("/admin-login", adminController.login);
router.get("/admin", authVarificationAdmin, adminController.admin);
router.get("/admin-verify", authVarificationAdmin, adminController.adminVerify);
router.get("/admin-logout", authVarificationAdmin, adminController.logout);
router.put("/admin-update", authVarificationAdmin, adminController.update);

//For user
router.post("/user-register", userController.register);
router.post("/user-login", userController.login);
router.get("/user", authVarificationUser, userController.user);
router.get("/user-verify", authVarificationUser, userController.userVerify);
router.get("/user-logout", authVarificationUser, userController.logout);
router.put("/user-update", authVarificationUser, userController.update);

//For product
router.post("/product-create", authVarificationAdmin, productController.create);
router.get("/all-products/:category_id/:brand_id/:remark/:keyword/:per_page/:page_no", productController.allProduct);

module.exports = router;