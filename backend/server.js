require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

connectDB().then(async () => {
    // Run the seed script automatically on startup
    const seedSuperAdmin = require('./seed');
    try {
        await seedSuperAdmin();
    } catch (err) {
        console.error("Seeds failed:", err.message);
    }

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
