require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`PantryPal API running on port ${PORT}`));

const startExpiryCheckJob = require('./src/jobs/expiryCheck.job');
startExpiryCheckJob();