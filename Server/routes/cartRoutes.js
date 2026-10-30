const express = require("express");
const { me } = require("../controllers/authController.js");
const authMiddleware = require("../middleware/authMiddleware.js");
const adminMiddleware = require("../middleware/adminMiddleware.js");
const { getProducts, getProductDetail } = require("../controllers/productController.js");
const { getCart, clearCart, addToCart, updateCartItem, removeCartItem } = require("../controllers/cartControllers.js");

const router = express.Router();

router.get("/", authMiddleware,getCart);
router.post("/items", authMiddleware,addToCart);
router.patch("/items/:productId", authMiddleware,updateCartItem);
router.delete("/items/:productId", authMiddleware,removeCartItem);
router.delete("/", authMiddleware,clearCart);

module.exports = router;
