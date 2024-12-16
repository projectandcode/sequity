// services/userServices.js
const admin = require('firebase-admin');
const db = admin.database();

const updateRelayStatus = async (userId, relayStatus) => {
    if (![0, 1].includes(relayStatus)) {
        throw new Error('Invalid relay status. Must be either 0 or 1.');
    }
    
    const userRef = db.ref(`users/${userId}`);
    await userRef.update({ relayStatus });
    return { message: 'Relay status updated successfully.' };
};

module.exports = {
    updateRelayStatus
};
