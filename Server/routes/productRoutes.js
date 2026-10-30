const express = require("express");
const authMiddleware = require("../middleware/authMiddleware.js");
const adminMiddleware = require("../middleware/adminMiddleware.js");

const {
  getProducts,
  getProductDetail,
  createProduct,
  updateProduct,
  updateProductStatus,
  deleteProduct,
} = require("../controllers/productController.js");
const upload = require("../middleware/upload.js");

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductDetail);
router.post("/", authMiddleware, adminMiddleware,upload.single("image") ,createProduct);
router.patch("/:id", authMiddleware, adminMiddleware,upload.single("image") , updateProduct);
router.patch("/:id/status", authMiddleware, adminMiddleware, updateProductStatus);
router.delete("/:id", authMiddleware, adminMiddleware, deleteProduct);

module.exports = router;
