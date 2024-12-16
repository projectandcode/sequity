const express = require('express');
const { updateLocationController } = require('../controllers/locationTestController');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware untuk memvalidasi JWT
const validateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication token is missing or invalid'});
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Tambahkan data pengguna dari token ke request
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token is invalid or expired" });
  }
};

// Route untuk memperbarui lokasi
router.put('/', validateJWT, updateLocationController);

module.exports = router;
