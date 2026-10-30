// const express = require("express");
// const { me } = require("../controllers/authController.js");
// const authMiddleware = require("../middleware/authMiddleware.js");
// const adminMiddleware = require("../middleware/adminMiddleware.js");
// const {
//   getCategories,
//   getCategoryDetail,
//   createCategories,
//   updateCategory,
//   deleteCategory,
// } = require("../controllers/categoryController.js");

// const router = express.Router();

// router.get("/", authMiddleware, getCategories);
// router.get("/:id", authMiddleware, getCategoryDetail);
// router.post("/", authMiddleware, adminMiddleware, createCategories);
// router.patch("/:id", authMiddleware, adminMiddleware, updateCategory);
// router.delete("/:id", authMiddleware, adminMiddleware, deleteCategory);

// module.exports = router;



const express = require("express");
const authMiddleware = require("../middleware/authMiddleware.js");
const adminMiddleware = require("../middleware/adminMiddleware.js");

const {
  getCategories,
  getCategoryDetail,
  getCategoryProducts,
  createCategories,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController.js");

const router = express.Router();


router.get("/", getCategories);
router.get("/:id/products", getCategoryProducts);
router.get("/:id", getCategoryDetail);
router.post("/", authMiddleware, adminMiddleware, createCategories);
router.patch("/:id", authMiddleware, adminMiddleware, updateCategory);
router.delete("/:id", authMiddleware, adminMiddleware, deleteCategory);

module.exports = router;
