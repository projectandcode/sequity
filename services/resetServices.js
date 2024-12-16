// services/resetPasswordService.js
const db = require('../src/config/firebase');
const nodemailer = require('nodemailer');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const secretKey = process.env.JWT_SECRET; // Secret key untuk JWT

// 1. Mengirimkan permintaan reset password (mengirim OTP)
exports.sendResetPasswordRequest = async (email) => {
    const userRef = db.ref('users').orderByChild('email').equalTo(email);
    const snapshot = await userRef.once('value');
    
    if (!snapshot.exists()) {
        return { status: 404, message: "Email not found." };
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate OTP
    const expiry = Date.now() + 150000; // OTP expires in 2 minutes

    snapshot.forEach(child => {
        child.ref.update({
            otp: otp,
            otpExpires: expiry,
            verified: false,  // Set verified status to false at the beginning
        });
    });

    // Kirim OTP ke email pengguna
    await sendResetEmail(email, otp);

    // Generate JWT token untuk melanjutkan ke verifikasi OTP
    const user = snapshot.val();
    const userId = Object.keys(user)[0]; // Ambil userId
    const token = jwt.sign({ userId: userId }, secretKey, { expiresIn: '1h' });

    return { 
        status: 200, 
        message: "OTP sent successfully. Please check your email.",
        token: token // Kirim token JWT untuk langkah verifikasi
    };
};

// Fungsi untuk mengirimkan OTP ke email pengguna
const sendResetEmail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Your OTP for Password Reset',
        text: `Your OTP is: ${otp}`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('OTP sent successfully');
    } catch (error) {
        console.error('Failed to send OTP:', error);
    }
};

// 2. Memverifikasi OTP

exports.verifyOTPService = async (otp, token) => {
    try {
        // Decode token yang diterima untuk mendapatkan userId
        const decoded = jwt.verify(token, secretKey);
        const userId = decoded.userId;

        const userRef = db.ref(`users/${userId}`);
        const snapshot = await userRef.once('value');
        const { otp: storedOtp, otpExpires, verified } = snapshot.val();

        // Jika OTP sudah kedaluwarsa atau tidak ada, return error
        if (!storedOtp || Date.now() > otpExpires) {
            return { status: 400, message: "OTP has expired or is invalid." };
        }

        // Jika OTP cocok, update status verified menjadi true
        if (storedOtp === otp) {
            // Menghapus OTP dan expiry, serta mengubah verified menjadi true
            await userRef.update({
                otp: null,
                otpExpires: null,
                verified: true // Tandai bahwa OTP telah diverifikasi
            });

            return { status: 200, message: "OTP is valid." };
        } else {
            return { status: 400, message: "Incorrect OTP." };
        }
    } catch (err) {
        return { status: 401, message: "Invalid or expired token." };
    }
};


// 3. Reset Password
exports.resetPasswordService = async (newPassword, confirmNewPassword, userId) => {
    // Cek apakah newPassword dan confirmNewPassword cocok
    if (newPassword !== confirmNewPassword) {
        return { status: 400, message: "New password and confirm new password must match." };
    }

    const userRef = db.ref(`users/${userId}`);
    const snapshot = await userRef.once('value');
    
    if (!snapshot.exists()) {
        return { status: 404, message: "User not found." };
    }

    const userData = snapshot.val();
    
    // Pastikan status verified adalah true
    if (!userData.verified) {
        return { status: 400, message: "User is not verified yet." };
    }

    // Hash password sebelum menyimpannya
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password di database dan hapus status verified setelah reset password
    await userRef.update({
        password: hashedPassword,
        verified: false, // Hapus status verified setelah password berhasil direset
        otp: null, // Menghapus OTP setelah reset password
        otpExpires: null // Menghapus expiry OTP
    });

    return { status: 200, message: "Password has been reset successfully." };
};
