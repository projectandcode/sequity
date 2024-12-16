// controllers/userController.js
const { updateRelayStatus } = require('../services/relayServices');

exports.updateRelayStatus = async (req, res) => {
    try {
        const userId = req.user.id; // userId dari token JWT
        const { relayStatus } = req.body;

        const result = await updateRelayStatus(userId, relayStatus);
        res.status(200).json({ message: result.message });
    } catch (error) {
        console.error('Error updating relay status:', error);
        res.status(400).json({ message: error.message });
    }
};
