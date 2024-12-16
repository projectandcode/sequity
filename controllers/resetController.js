// controllers/resetController.js
const jwt = require('jsonwebtoken');
const { sendResetPasswordRequest, verifyOTPService, resetPasswordService } = require('../services/resetServices');

// Fungsi untuk request OTP dan JWT token
const requestResetPassword = async (req, res) => {
    const { email } = req.body;
    const response = await sendResetPasswordRequest(email);
    res.status(response.status).json(response); // Mengembalikan JWT token di response
};

// Fungsi untuk verifikasi OTP dan menghasilkan token baru
const verifyOTP = async (req, res) => {
    const { otp } = req.body;

    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(400).json({ message: "Authorization token is missing." });
    }

    const token = authHeader.split(' ')[1];
    const response = await verifyOTPService(otp, token);
    res.status(response.status).json(response); // Return response indicating OTP validity
};

// Fungsi untuk reset password, menggunakan token JWT
const resetPassword = async (req, res) => {
    const { newPassword, confirmNewPassword } = req.body;
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(400).json({ message: "Authorization token is missing." });
    }

    const token = authHeader.split(' ')[1];

    if (newPassword !== confirmNewPassword) {
        return res.status(400).json({ message: "New password and confirm new password must match." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        // Panggil service untuk reset password
        const response = await resetPasswordService(newPassword, confirmNewPassword, userId);
        res.status(response.status).json(response);
    } catch (err) {
        res.status(401).json({ message: "Invalid or expired token." });
    }
};

module.exports = {
    requestResetPassword,
    verifyOTP,
    resetPassword
};
