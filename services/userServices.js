// services/userService.js
const admin = require('firebase-admin');
const db = admin.database();

exports.getUserDetails = async (userId) => {
    const userRef = db.ref(`users/${userId}`);
    const snapshot = await userRef.once('value');
    if (snapshot.exists()) {
        const userInfo = snapshot.val();
        return { success: true, data: userInfo };
    } else {
        return { success: false, message: 'User not found.' };
    }
};



