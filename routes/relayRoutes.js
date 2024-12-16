// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const { updateRelayStatus } = require('../controllers/relayController');
const { authenticate } = require('../middlewares/auth'); // Assuming you have an auth middleware

router.post('/update-relay-status', authenticate, updateRelayStatus);

module.exports = router;
