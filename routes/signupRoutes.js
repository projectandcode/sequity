const express = require('express');
const {
    verifyIMEIController,
    sendOTPController,
    verifyOTPController,
    storeUserDetailsController
} = require('../controllers/signupController');

const { validateIMEI, validateEmail,validateUserDetails,verifyToken } = require('../middlewares/validateSignup'); // Asumsikan pathnya benar
const router = express.Router();

// Menambahkan middleware validateIMEI untuk route verifikasi IMEI
router.post('/verify-imei', validateIMEI, verifyIMEIController);

// Menambahkan middleware validateUserDetails untuk route yang memerlukan detail pengguna
router.post('/send-otp',verifyToken, validateEmail, sendOTPController);
router.post('/store-user-details',verifyToken,validateUserDetails, storeUserDetailsController);

// Tidak membutuhkan validasi detail pengguna untuk verifikasi OTP
router.post('/verify-otp', verifyToken, verifyOTPController);


module.exports = router;
