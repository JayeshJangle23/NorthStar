const express = require("express");
const { me } = require("../controllers/authController.js");
const authMiddleware = require("../middleware/authMiddleware.js");
const {
  getEmployees,
  createEmployees,
  updateEmployees,
  getEmployeeDetail,
  updateRole,
  deleteEmployee,
} = require("../controllers/userController.js");
const adminMiddleware = require("../middleware/adminMiddleware.js");

const router = express.Router();

router.get("/", authMiddleware, adminMiddleware, getEmployees);
router.post("/", authMiddleware, adminMiddleware, createEmployees);
router.get("/:id", authMiddleware, adminMiddleware, getEmployeeDetail);
router.delete("/:id", authMiddleware, adminMiddleware, deleteEmployee);
router.patch("/:id/role", authMiddleware, adminMiddleware, updateRole);
router.get("/me", authMiddleware, me);
router.put("/me/password/:id", authMiddleware, updateEmployees);

module.exports = router;
