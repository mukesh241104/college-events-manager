require('dotenv').config();
console.log('DEBUG: Dotenv loaded');
const app = require('./app');
console.log('DEBUG: App required');
const connectDB = require('./config/db');
console.log('DEBUG: DB required');

const PORT = 5000;

console.log('DEBUG: Attempting to connect to DB...');
connectDB().then(() => {
    console.log('DEBUG: DB connected, attempting to listen...');
    app.listen(PORT, () => {
        console.log(`DEBUG: Server is running on port ${PORT}`);
    }).on('error', (err) => {
        console.error('DEBUG: Server listener error:', err);
    });
}).catch(err => {
    console.error('DEBUG: DB connection catch:', err);
});

process.on('uncaughtException', (err) => {
    console.error('DEBUG: Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('DEBUG: Unhandled Rejection:', reason);
});
