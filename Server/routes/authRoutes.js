const express = require('express');
const { register, login, me, logout } = require('../controllers/authController.js');
const authMiddleware = require('../middleware/authMiddleware.js');

const router = express.Router();

router.post("/register",register);
router.post("/login",login);
router.post("/logout",authMiddleware,logout);
router.get("/me", authMiddleware, me);

module.exports = router;
