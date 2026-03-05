const Club = require('../models/Club');
const Admin = require('../models/Admin');

// @desc    Create a new club
// @route   POST /api/admin/clubs
// @access  Private/SuperAdmin
const createClub = async (req, res) => {
    try {
        const { name, description } = req.body;

        const clubExists = await Club.findOne({ name });
        if (clubExists) {
            return res.status(400).json({ message: 'Club already exists' });
        }

        const club = await Club.create({
            name,
            description,
        });

        res.status(201).json(club);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all clubs
// @route   GET /api/admin/clubs
// @access  Public
const getClubs = async (req, res) => {
    try {
        const clubs = await Club.find({});
        res.json(clubs);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Create a new club admin
// @route   POST /api/admin/club-admins
// @access  Private/SuperAdmin
const createClubAdmin = async (req, res) => {
    try {
        const { email, password, clubId } = req.body;

        // Check if user exists
        const adminExists = await Admin.findOne({ email });
        if (adminExists) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        // Check if club exists
        const clubExists = await Club.findById(clubId);
        if (!clubExists) {
            return res.status(404).json({ message: 'Club not found' });
        }

        const admin = await Admin.create({
            email,
            password,
            role: 'clubadmin',
            club: clubId,
        });

        res.status(201).json({
            _id: admin._id,
            email: admin.email,
            role: admin.role,
            club: admin.club,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    createClub,
    getClubs,
    createClubAdmin,
};
