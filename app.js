// app.js

require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const signupRoutes = require('./routes/signupRoutes');
const authRoutes = require('./routes/authRoutes');  // Impor rute autentikasi
const resetRoutes = require('./routes/resetRoutes');
const userRoutes = require('./routes/userRoutes');
const relayRoutes = require('./routes/relayRoutes');
const locationRoutes = require('./routes/locationRoutes');
const geofenceRoutes = require('./routes/geofenceRoutes');
const locationTestRoutes = require('./routes/locationTestRoutes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use('/api/signup', signupRoutes);
app.use('/api/auth', authRoutes);  // Gunakan rute autentikasi
app.use('/api/res', resetRoutes);
app.use('/api',userRoutes);
app.use('/api', relayRoutes);
app.use('/api',locationRoutes);
app.use('/api/geofence', geofenceRoutes);
app.use('/api/location', locationTestRoutes);

app.use((req, res) => {
    res.status(404).send('Endpoint not found');
});
// Import dan jalankan cron job
require('./cronJobs');

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
