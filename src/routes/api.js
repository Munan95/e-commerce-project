const express = require("express");
const router = express.Router();

//Controller
const adminController = require("../controllers/adminController.js");
const userController = require("../controllers/userController.js");
const productController = require("../controllers/productController.js");
const categoryController = require("../controllers/categoryController.js");
const brandController = require("../controllers/brandController.js");
const reviewController = require("../controllers/reviewController.js");

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
router.get("/single-product/:id", productController.singleProduct);
router.put("/product-update/:id", authVarificationAdmin, productController.update);
router.delete("/product-delete/:id", authVarificationAdmin, productController.delete);

//For category
router.post("/category-create", authVarificationAdmin, categoryController.create);
router.get("/all-category/:per_page/:page_no", categoryController.allCategory);
router.get("/single-category/:id", categoryController.singleCategory);
router.put("/category-update/:id", authVarificationAdmin, categoryController.update);
router.delete("/category-delete/:id", authVarificationAdmin, categoryController.delete);

//For brand
router.post("/brand-create", authVarificationAdmin, brandController.create);
router.get("/all-brand/:per_page/:page_no", brandController.allBrand);
router.get("/single-brand/:id", brandController.singleBrand);
router.put("/brand-update/:id", authVarificationAdmin, brandController.update);
router.delete("/brand-delete/:id", authVarificationAdmin, brandController.delete);

//For review
router.post("/review-create", authVarificationUser, reviewController.create);

module.exports = router;