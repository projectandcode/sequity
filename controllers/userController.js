// controllers/userController.js
const { getUserDetails } = require('../services/userServices');

exports.displayUserDetails = async (req, res) => {
    const userId = req.user.id; // Assuming 'user' is appended to 'req' by a middleware that decodes the JWT
    const result = await getUserDetails(userId);
    if (result.success) {
        res.json({
            success: true,
            vehicleName: result.data.vehicleName,
            plateNumber: result.data.plateNumber
        });
    } else {
        res.status(404).json({ success: false, message: result.message });
    }
};
