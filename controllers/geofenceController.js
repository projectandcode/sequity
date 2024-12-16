const { 
  createGeofence, 
  getGeofence, 
  deleteGeofence, 
  getAllUsersWithGeofence 
} = require("../services/geofenceServices");
const { startCronJob, stopCronJob } = require("../cronJobs");
const admin = require("firebase-admin");

const createGeofenceController = async (req, res) => {
  const userId = req.user.id;
  const { radius } = req.body;

  try {
    // Validate radius input
    if (!radius || typeof radius !== "number" || radius <= 0) {
      return res.status(400).json({ success: false, message: "Invalid radius provided." });
    }

    // Retrieve user's last location
    const userLocationRef = admin.database().ref(`/users/${userId}/location`);
    const locationSnapshot = await userLocationRef.once("value");

    if (!locationSnapshot.exists()) {
      return res.status(404).json({ success: false, message: "Location data not found for this user." });
    }

    const location = locationSnapshot.val();

    // Validate location data
    if (!location.latitude || !location.longitude) {
      return res.status(400).json({ success: false, message: "Invalid location data. Latitude and longitude are required." });
    }

    // Create geofence
    const geofence = await createGeofence(userId, location, radius);

    // Start cron job if this is the first geofence
    const usersWithGeofence = await getAllUsersWithGeofence();
    if (usersWithGeofence.length === 1) {
      startCronJob();
    }

    res.status(201).json({ success: true, geofence });
  } catch (error) {
    console.error("Error in createGeofenceController:", error.message);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};


const getGeofenceController = async (req, res) => {
  const userId = req.user.id;

  try {
    const geofence = await getGeofence(userId);
    res.status(200).json({ success: true, data: geofence });
  } catch (error) {
    console.error("Error in getGeofenceController:", error.message);
    res.status(404).json({ success: false, message: error.message });
  }
};

const deleteGeofenceController = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await deleteGeofence(userId);

    const usersWithGeofence = await getAllUsersWithGeofence();
    if (usersWithGeofence.length === 0) {
      stopCronJob();
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Error in deleteGeofenceController:", error.message);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

module.exports = {
  createGeofenceController,
  getGeofenceController,
  deleteGeofenceController,
};
