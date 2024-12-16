//const locationService = require('../services/locationServices');
//exports.getLocation = async (req, res) => {
  //  const {
    //    userId 
    //} = req.user.id;
    //const response = await locationService.getUserLocation(userId);
    //res.json(response);
//};

// controllers/userController.js
const {getUserLocation } = require('../services/locationServices');

exports.getLocation = async (req, res) => {
    const userId = req.user.id; // Assuming 'user' is appended to 'req' by a middleware that decodes the JWT
    const result = await getUserLocation(userId);
    if (result.success) {
          res.json({
          success: true,
          latitude: result.data.latitude,
          longitude: result.data.longitude
        
          });
        
    }
     else {
        res.status(404).json({ success: false, message: result.message });
    }
};
