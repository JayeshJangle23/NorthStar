const express = require("express");
const authMiddleware = require("../middleware/authMiddleware.js");
const adminMiddleware = require("../middleware/adminMiddleware.js");

const {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController.js");

const router = express.Router();

router.post("/", authMiddleware, createOrder);
router.get("/my-orders", authMiddleware, getMyOrders);
router.patch("/:id/cancel", authMiddleware, cancelOrder);

router.get("/admin/all",authMiddleware, adminMiddleware, getAllOrders);
router.patch("/admin/:id/status",authMiddleware, adminMiddleware, updateOrderStatus);
router.get("/:id",authMiddleware, getOrderById);

module.exports = router;
