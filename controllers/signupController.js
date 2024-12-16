const { verifyIMEI, sendOTP, verifyOTP, storeUserDetails } = require('../services/signupServices');

// Controller untuk verifikasi IMEI
exports.verifyIMEIController = async (req, res) => {
    const { imei } = req.body;
    const result = await verifyIMEI(imei);
    res.status(result.success ? 200 : 400).json(result);
};

// Controller untuk mengirim OTP
exports.sendOTPController = async (req, res) => {
    const { email } = req.body;
    const imei = req.imei;
    const result = await sendOTP(imei, email);
    res.status(result.success ? 200 : 400).json(result);
};

// Controller untuk verifikasi OTP
exports.verifyOTPController = async (req, res) => {
    const {otp } = req.body;
    const imei = req.imei;
    const result = await verifyOTP(imei, otp);
    res.status(result.success ? 200 : 400).json(result);
};

// Controller untuk menyimpan detail pengguna
exports.storeUserDetailsController = async (req, res) => {
    const {vehicleName, plateNumber, password, confirmPassword } = req.body;
    const imei = req.imei;
    const result = await storeUserDetails(imei, vehicleName, plateNumber, password, confirmPassword);
    res.status(result.success ? 200 : 400).json(result);
};
