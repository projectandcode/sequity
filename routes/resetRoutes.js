// routes/resetRoutes.js
const express = require('express');
const { requestResetPassword, verifyOTP, resetPassword } = require('../controllers/resetController');
const router = express.Router();

// Endpoint untuk request OTP dan JWT token
router.post('/send-request', requestResetPassword);

// Endpoint untuk verifikasi OTP dan menghasilkan token baru
router.post('/verify-otp', verifyOTP);

// Endpoint untuk reset password
router.post('/reset-password', resetPassword);

module.exports = router;
