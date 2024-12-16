const { updateLocation } = require('../services/locationTestServices');

// Controller untuk memperbarui lokasi
const updateLocationController = async (req, res) => {
  const userId = req.user.id; // Ambil userId dari token JWT
  const { latitude, longitude } = req.body;

  if (!latitude || !longitude) {
    return res.status(400).json({
      success: false,
      message: "Latitude and longitude are required.",
    });
  }

  try {
    const result = await updateLocation(userId, latitude, longitude);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  updateLocationController,
};
