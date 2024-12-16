// loginService.js
const bcrypt = require('bcrypt');
const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');

const db = admin.database();

const login = async (email, password) => {
    const ref = db.ref("users");
    const snapshot = await ref.orderByChild("email").equalTo(email).once("value");
    if (snapshot.exists()) {
        const users = snapshot.val();
        const userId = Object.keys(users)[0];
        const user = users[userId];

        // Check if the account is active
        if (!user.active) {
            return { success: false, message: 'Account is not active.' };
        }

        // Check if the provided password matches the hashed password in the database
        const passwordIsValid = await bcrypt.compare(password, user.password);
        if (!passwordIsValid) {
            return { success: false, message: 'Invalid password.' };
        }

        // Generate a JWT token without expiration
        const token = jwt.sign({ id: userId }, process.env.JWT_SECRET);

        return { success: true, message: 'Login successful.', userId: userId, token: token };
    } else {
        return { success: false, message: 'User not found.' };
    }
};

module.exports = { login };
