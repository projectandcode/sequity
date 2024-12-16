

//*exports.getUserLocation = async (userId) => {
    // Check if userId is valid
 //   if (!userId) {
   //     return { success: false, message: "Invalid user ID." };
    //}

    //console.log(`Fetching location for user ID: ${userId}`); // Added for debugging
 
//    try {
  //      const snapshot = await db.ref(`users/${userId}/location`).once('value');
    //    if (snapshot.exists()) {
      //      return { success: true, location: snapshot.val() };
        //} else {
         //   return { success: false, message: "No location data found." };
        //}
    //} catch (error) {
      //  console.error('Error accessing Firebase:', error);
        //return { success: false, message: "Failed to fetch location data due to a server error." };
    //}
//};



const admin = require('firebase-admin');
const db = admin.database();

exports.getUserLocation = async (userId) => {

    const userRef = db.ref(`users/${userId}/location`);
    const snapshot = await userRef.once('value');
    if (snapshot.exists()) {
        const userInfo = snapshot.val();
        return { success: true, data: userInfo };
    } else {
        return { success: false, message: 'User not found.' };
    }
};



