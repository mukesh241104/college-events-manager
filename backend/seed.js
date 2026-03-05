const Admin = require('./models/Admin');
const Club = require('./models/Club');
const Event = require('./models/Event');

const seedData = async () => {
    try {
        const email = process.env.SUPERADMIN_EMAIL;
        const password = process.env.SUPERADMIN_PASSWORD;

        if (!email || !password) {
            console.error('Superadmin credentials not found in environment variables');
            return;
        }

        // Check if superadmin already exists
        let superAdmin = await Admin.findOne({ email });

        // User requested: "insert 50 events, 15 clubs meaningful data only when superadmin not exists"
        // This ensures it only runs on the very first time Vercel boots up
        if (!superAdmin) {
            console.log('Superadmin not found. Running initial database setup & seeding dummy data...');

            // 1. Create Superadmin
            superAdmin = await Admin.create({
                email,
                password,
                role: 'superadmin',
            });
            console.log('✅ Superadmin created successfully in MongoDB Atlas!');

            // 2. Define 15 Meaningful Clubs
            const clubBlueprints = [
                { name: 'Robotics Club', description: 'Building the future of automation and hardware engineering.' },
                { name: 'Coding Society', description: 'Hackathons, open source contributions, and algorithm training.' },
                { name: 'Art & Design Group', description: 'Creative minds gathered to explore digital and physical art.' },
                { name: 'Debate & Model UN', description: 'Honing public speaking, diplomacy, and debate skills.' },
                { name: 'Music Society', description: 'Bringing together vocalists, instrumentalists, and music producers.' },
                { name: 'Drama & Theater', description: 'Stage acting, scriptwriting, and theatrical productions.' },
                { name: 'Photography Club', description: 'Capturing moments through lenses and learning photo editing.' },
                { name: 'Entrepreneurship Cell', description: 'Fostering startups, pitching ideas, and learning business strategy.' },
                { name: 'Literature & Poetry', description: 'Book readings, poetry slams, and creative writing workshops.' },
                { name: 'Astronomy Society', description: 'Stargazing, astrophysics discussions, and planetarium visits.' },
                { name: 'E-Sports & Gaming Guild', description: 'Competitive gaming tournaments and game development design.' },
                { name: 'Environmental & Green Club', description: 'Sustainability projects, tree planting, and eco-awareness.' },
                { name: 'Mathematics Society', description: 'Solving complex puzzles, math olympiad training, and logic games.' },
                { name: 'Dance & Choreography', description: 'Exploring various dance forms from classical to hip-hop.' },
                { name: 'Finance & Investment Club', description: 'Stock market analysis, personal finance, and crypto discussions.' }
            ];

            // Clean up existing to avoid conflicts during this initial run
            await Club.deleteMany({});
            await Event.deleteMany({});
            await Admin.deleteMany({ role: { $ne: 'superadmin' } });

            console.log('Inserting 15 dummy Clubs...');
            const clubs = await Club.insertMany(clubBlueprints);
            console.log('✅ 15 Clubs created!');

            // 3. Create a couple dummy admins to attach events to
            const roboticsAdmin = await Admin.create({ email: 'robotics@example.com', password: 'password', role: 'clubadmin', club: clubs[0]._id });
            const codingAdmin = await Admin.create({ email: 'coding@example.com', password: 'password', role: 'clubadmin', club: clubs[1]._id });
            const adminDocs = [roboticsAdmin, codingAdmin];

            // 4. Generate 50 Meaningful Events spread across the 15 clubs
            const eventBlueprints = [];
            const eventTypes = ['Workshop', 'Hackathon', 'Seminar', 'Competition', 'Meetup', 'Showcase', 'Bootcamp'];
            const topics = [
                'AI & Machine Learning', 'Cloud Computing', 'Hardware Prototyping', 'Public Speaking',
                'Digital Marketing', 'Startup Pitching', 'Classical Music', 'Abstract Art',
                'Game Development', 'Financial Literacy', 'E-Sports Tournament', 'Poetry Slam',
                'Model UN Session', 'Web3 & Blockchain', 'Space Exploration'
            ];
            const locations = ['Main Auditorium', 'CS Lab 1', 'CS Lab 2', 'Library Conference Room', 'Open Air Theater', 'Block A Room 101', 'Block B Seminar Hall'];

            console.log('Generating 50 meaningful Events...');
            for (let i = 1; i <= 50; i++) {
                // Pick random elements to mix and match
                const club = clubs[i % 15]; // Spread evenly across 15 clubs
                const type = eventTypes[i % eventTypes.length];
                const topic = topics[i % topics.length];
                const location = locations[i % locations.length];

                // Random date within the next 90 days
                const eventDate = new Date();
                eventDate.setDate(eventDate.getDate() + (i * 2)); // Spread out dates sequentially

                eventBlueprints.push({
                    title: `${type}: ${topic} ${new Date().getFullYear()}`,
                    description: `Join the ${club.name} for an exciting ${type.toLowerCase()} focusing on ${topic.toLowerCase()}. This event is perfect for beginners and experts alike. Do not miss it!`,
                    date: eventDate,
                    location: location,
                    club: club._id,
                    createdBy: adminDocs[i % adminDocs.length]._id
                });
            }

            await Event.insertMany(eventBlueprints);
            console.log('✅ 50 Events created!');

            console.log('🎉 First-run dummy data seeding completed successfully!');

        } else {
            console.log('⚡ Superadmin already exists. Skipping dummy data seeding as database is already initialized.');
        }

    } catch (error) {
        console.error(`Error with seeding: ${error}`);
    }
};

module.exports = seedData;
