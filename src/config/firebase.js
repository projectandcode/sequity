const admin = require('firebase-admin');
const serviceAccount = require('./sequity-jadi-firebase-adminsdk-tbqqj-e60c507ff5.json');

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://sequity-jadi-default-rtdb.firebaseio.com",
  });

  const db = admin.database();
  console.log("Firebase berhasil diinisialisasi.");
  module.exports = db;
} catch (error) {
  console.error("Gagal menginisialisasi Firebase:", error.message);
  process.exit(1); // Menghentikan aplikasi jika koneksi gagal
}
