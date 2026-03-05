require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const connectDB = require('./config/db');

const seedSuperAdmin = async () => {
    try {
        await connectDB();

        const email = process.env.SUPERADMIN_EMAIL;
        const password = process.env.SUPERADMIN_PASSWORD;

        if (!email || !password) {
            console.error('Superadmin credentials not found in environment variables');
            process.exit(1);
        }

        // Check if superadmin already exists
        const adminExists = await Admin.findOne({ email });

        if (adminExists) {
            console.log('Superadmin already exists!');
            process.exit(0);
        }

        // Create superadmin
        await Admin.create({
            email,
            password,
            role: 'superadmin',
        });

        console.log('Superadmin created successfully!');
        process.exit(0);
    } catch (error) {
        console.error(`Error with seeding: ${error}`);
        process.exit(1);
    }
};

seedSuperAdmin();
