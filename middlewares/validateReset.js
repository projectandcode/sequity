// middlewares/validateReset.js

exports.validateResetRequest = (req, res, next) => {
    const { email } = req.body;
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }
    next();
};

exports.validatePasswordReset = (req, res, next) => {
    const { otp, newPassword } = req.body;
    if (!otp || !newPassword || newPassword.length < 6) {
        return res.status(400).json({ message: 'Missing fields or invalid input' });
    }
    next();
};
const verifyTokenMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(400).json({ message: "Authorization token is missing." });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(400).json({ message: "Authorization token is missing." });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Invalid or expired token." });
        }
        req.user = decoded; // Simpan user ID atau data terkait di request
        next(); // Lanjutkan ke middleware atau route berikutnya
    });
};