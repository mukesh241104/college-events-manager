require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const Club = require('./models/Club');
const Event = require('./models/Event');
const connectDB = require('./config/db');

const seedData = async () => {
    try {
        await connectDB();

        console.log('Clearing existing data (except Superadmin)...');

        // Clear existing clubs and events
        await Club.deleteMany({});
        await Event.deleteMany({});

        // Delete all admins that are NOT superadmins
        await Admin.deleteMany({ role: { $ne: 'superadmin' } });

        console.log('Inserting dummy Clubs...');
        const clubs = await Club.insertMany([
            { name: 'Robotics Club', description: 'Building the future of automation.' },
            { name: 'Coding Society', description: 'Hackathons, open source, and algorithms.' },
            { name: 'Art & Design', description: 'Creative minds gathered.' }
        ]);

        console.log('Inserting dummy Club Admins...');
        const adminsToCreate = [
            { email: 'robotics@example.com', password: 'password', role: 'clubadmin', club: clubs[0]._id },
            { email: 'coding@example.com', password: 'password', role: 'clubadmin', club: clubs[1]._id },
        ];

        // Use .create() to trigger the bcrypt pre-save hook
        const adminDocs = [];
        for (const adminData of adminsToCreate) {
            const admin = await Admin.create(adminData);
            adminDocs.push(admin);
        }

        console.log('Inserting dummy Events...');
        await Event.insertMany([
            {
                title: 'Robowars 2026',
                description: 'Annual robotics combat competition.',
                date: new Date('2026-04-15T18:00:00Z'),
                location: 'Main Arena',
                club: clubs[0]._id,
                createdBy: adminDocs[0]._id
            },
            {
                title: 'Hackathon Alpha',
                description: '24-hour coding sprint with exciting prizes.',
                date: new Date('2026-05-10T09:00:00Z'),
                location: 'CS Lab 1',
                club: clubs[1]._id,
                createdBy: adminDocs[1]._id
            },
            {
                title: 'Art Exhibition',
                description: 'Showcasing the best digital and physical art from students.',
                date: new Date('2026-06-01T10:00:00Z'),
                location: 'Gallery Wing',
                club: clubs[2]._id,
                createdBy: adminDocs[0]._id // Dummy assignment
            }
        ]);

        console.log('Dummy data seeded successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
