const express = require('express');
const { createGeofenceController, getGeofenceController, deleteGeofenceController } = require('../controllers/geofenceController');
const { authenticate } = require('../middlewares/auth');

const router = express.Router();

// Endpoint untuk membuat geofence
router.post('/create', authenticate, createGeofenceController);

// Endpoint untuk mendapatkan geofence
router.get('/', authenticate, getGeofenceController);

// Endpoint untuk menghapus geofence
router.delete('/delete', authenticate, deleteGeofenceController);

module.exports = router;
