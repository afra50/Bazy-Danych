// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Endpointy autoryzacyjne
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/login-owner", authController.loginOwner);

module.exports = router;