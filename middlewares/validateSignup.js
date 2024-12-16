const validateIMEI = (req, res, next) => {
  const { imei } = req.body;
  if (!imei || imei.length !== 15 || !/^\d+$/.test(imei)) {
      return res.status(400).json({ success: false, message: 'IMEI tidak valid.' });
  }
  next();
};

const validateEmail = (req, res, next) => {
  const { email } = req.body;
  // Memperbarui regex untuk hanya menerima email dari domain gmail.com
  const emailRegex = /^[^\s@]+@gmail\.com$/;

  if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Email tidak valid. Harus menggunakan Gmail.' });
  }
  next();
};
const validateUserDetails = (req, res, next) => {
  const {password } = req.body;
 
  if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password terlalu pendek.' });
  }
  next();
};
// Mungkin berada di file seperti validateSignup.js atau file middleware lainnya
const jwt = require('jsonwebtoken');
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(" ")[1]; // Mengambil token dari header
    if (!token) {
        return res.status(403).json({ success: false, message: "Token is required" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.imei = decoded.imei; // Menempatkan IMEI ke dalam request
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid token" });
    }
};




module.exports = { validateIMEI, validateEmail, validateUserDetails,verifyToken };
