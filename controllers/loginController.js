// controllers/loginController.js
const { login } = require('../services/loginServices');

exports.loginController = async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await login(email, password);
        res.status(result.success ? 200 : 401).json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error", error: error.toString() });
    }
};
