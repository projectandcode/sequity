const admin = require('firebase-admin');

// Service untuk memperbarui lokasi
const updateLocation = async (userId, latitude, longitude) => {
  if (!latitude || !longitude) {
    throw new Error("Latitude and longitude are required.");
  }

  const locationRef = admin.database().ref(`/users/${userId}/location`);
  await locationRef.set({ latitude, longitude });

  return { success: true, message: 'Location updated successfully.' };
};

module.exports = {
  updateLocation,
};
