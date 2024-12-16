const cron = require("node-cron");
const { getAllUsersWithGeofence, updateRelayStatus, isWithinGeofence } = require("./services/geofenceServices");
//const haversine = require("haversine-distance");

let cronTask; // Variable to store the cron job task

// Start the cron job
const startCronJob = () => {
  if (cronTask) {
    console.log("Cron job is already running.");
    return;
  }

  cronTask = cron.schedule("* * * * *", async () => {
    try {
      console.log("Running geofence check...");

      const users = await getAllUsersWithGeofence();
      if (!users.length) {
        console.log("No users with geofence found.");
        return;
      }

      console.log(`Checking geofence for ${users.length} users.`);
      for (const user of users) {
        const { userId, geofence, location } = user;

        if (!location || !geofence || !geofence.center || !geofence.radius) {
          console.log(`Skipping user ${userId} due to missing data.`);
          continue;
        }

        const currentLocation = {
          latitude: location.latitude,
          longitude: location.longitude,
        };
        const centerLocation = {
          latitude: geofence.center.latitude,
          longitude: geofence.center.longitude,
        };

        const isInside = isWithinGeofence(currentLocation, centerLocation, geofence.radius);
        const relayStatus = isInside ? 1 : 0; // nned to be change 

        await updateRelayStatus(userId, relayStatus);
        console.log(`User ${userId} relayStatus updated to ${relayStatus}.`);
      }
    } catch (error) {
      console.error("Error running geofence check:", error.message);
    }
  });

  console.log("Cron job started.");
};

// Stop the cron job
const stopCronJob = () => {
  if (cronTask) {
    cronTask.stop();
    cronTask = null;
    console.log("Cron job stopped.");
  } else {
    console.log("Cron job is not running.");
  }
};

module.exports = { startCronJob, stopCronJob };
