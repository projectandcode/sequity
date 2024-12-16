const admin = require("firebase-admin");
const haversine = require("haversine-distance");

// Helper function: Check if a location is within the geofence
const isWithinGeofence = (currentLocation, centerLocation, radius) => {
  const distance = haversine(currentLocation, centerLocation);
  return distance <= radius;
};

// Retrieve all users with geofences
const getAllUsersWithGeofence = async () => {
  const usersRef = admin.database().ref("/users");
  const usersSnapshot = await usersRef.once("value");

  if (!usersSnapshot.exists()) {
    console.error("No users found.");
    return [];
  }

  const users = usersSnapshot.val();
  const usersWithGeofence = [];

  for (const userId in users) {
    if (users[userId].geofence) {
      usersWithGeofence.push({
        userId,
        geofence: users[userId].geofence,
        location: users[userId].location,
      });
    }
  }

  return usersWithGeofence;
};

// Update the relay status for a user
const updateRelayStatus = async (userId, status) => {
  const userRef = admin.database().ref(`/users/${userId}`);
  await userRef.update({ relayStatus: status });
};

// Create a geofence (No cron job logic here)
const createGeofence = async (userId, center, radius) => {
  if (!center.latitude || !center.longitude) {
    throw new Error("Invalid center data. Latitude and longitude are required.");
  }

  const geofence = {
    center,
    radius,
    createdAt: Date.now(),
  };
  const userRef = admin.database().ref(`/users/${userId}`);
  await userRef.child("geofence").set(geofence);
  return geofence;
};
// Retrieve a geofence for a user
const getGeofence = async (userId) => {
  const geofenceRef = admin.database().ref(`/users/${userId}/geofence`);
  const geofenceSnapshot = await geofenceRef.once("value");

  if (!geofenceSnapshot.exists()) {
    console.error("No geofence found for this user.");
    return null;
  }

  return geofenceSnapshot.val();
};

// Delete a geofence (No cron job logic here)
const deleteGeofence = async (userId) => {
  const userRef = admin.database().ref(`/users/${userId}/geofence`);
  const geofenceSnapshot = await userRef.once("value");

  if (!geofenceSnapshot.exists()) {
    console.error("No geofence found for this user.");
    return { success: false, message: "Geofence not found." };
  }

  await userRef.remove(); // Remove geofence from Firebase

  return { success: true, message: "Geofence deleted successfully." };
};

module.exports = {
  isWithinGeofence,
  getAllUsersWithGeofence,
  updateRelayStatus,
  createGeofence,
  getGeofence,
  deleteGeofence,
};
