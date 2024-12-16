// routes/authRoutes.js
const express = require('express');
const { loginController } = require('../controllers/loginController');
const { validateLogin } = require('../middlewares/validateLogin');  // Asumsi middleware validasi login sudah ada

const router = express.Router();

// Rute untuk login
router.post('/login', validateLogin, loginController);

module.exports = router;
