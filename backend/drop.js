require('dotenv').config();
const mongoose = require('mongoose');

const dropDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        await mongoose.connection.db.dropDatabase();
        console.log('Local database dropped to simulate first run.');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
dropDB();
