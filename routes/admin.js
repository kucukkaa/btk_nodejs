const express = require("express");
const router = express.Router();

const isAuthenticated = require("../middleware/authentication");
const csrf = require("../middleware/csrf");

const adminController = require("../controllers/admin");

router.get("/products", adminController.getProducts);

router.get(
  "/add-product",
  csrf,
  isAuthenticated,
  adminController.getAddProduct
);

router.post("/add-product", isAuthenticated, adminController.postAddProduct);

router.get(
  "/products/:productid",
  csrf,
  isAuthenticated,
  adminController.getEditProduct
);

router.post("/products", isAuthenticated, adminController.postEditProduct);

router.post(
  "/delete-product",
  isAuthenticated,
  adminController.postDeleteProduct
);

module.exports = router;
