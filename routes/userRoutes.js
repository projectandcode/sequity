// routes/userRoutes.js
const express = require('express');
const { displayUserDetails } = require('../controllers/userController');
const { authenticate } = require('../middlewares/auth'); // Ensure you have an authentication middleware to decode JWT

const router = express.Router();

router.get('/user-details', authenticate, displayUserDetails);

module.exports = router;
