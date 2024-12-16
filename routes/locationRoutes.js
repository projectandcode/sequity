const express = require('express');
const { getLocation } = require('../controllers/locationController');
const { authenticate } = require('../middlewares/auth'); // Assuming auth middleware exists
const router = express.Router();
router.get('/get-location', authenticate, getLocation);

module.exports = router;
