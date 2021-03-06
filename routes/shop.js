const express = require("express");
const router = express.Router();

const isAuthenticated = require("../middleware/authentication");

const shopController = require("../controllers/shop");

router.get("/", shopController.getIndex);

router.get("/products", shopController.getProducts);

router.get("/products/:productid", shopController.getProduct);

router.get("/categories/:categoryid", shopController.getProductsByCategoryId);

router.get("/details", shopController.getProductDetails);

router.get("/cart", isAuthenticated, shopController.getCart);

router.post("/cart", isAuthenticated, shopController.postCart);

router.get("/orders", isAuthenticated, shopController.getOrders);

router.post("/delete-cartitem", isAuthenticated, shopController.postCartItemDelete);

router.post("/create-order", isAuthenticated, shopController.postOrder);

module.exports = router;
