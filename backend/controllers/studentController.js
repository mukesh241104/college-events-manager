const Event = require('../models/Event');
const Student = require('../models/Student');
const Registration = require('../models/Registration');
const jwt = require('jsonwebtoken');

// Generate JWT for student
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// Helper to set token in cookie
const sendTokenResponse = (student, statusCode, res) => {
    const token = generateToken(student._id);

    const options = {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    };

    res.status(statusCode)
        .cookie('studentToken', token, options)
        .json({
            success: true,
            _id: student._id,
            name: student.name,
            email: student.email,
            rollNumber: student.rollNumber,
            department: student.department,
            year: student.year
        });
};

// @desc    Register a new student
// @route   POST /api/public/signup
// @access  Public
const studentSignup = async (req, res) => {
    try {
        const { name, email, password, rollNumber, department, year } = req.body;

        // Check if student already exists
        const studentExists = await Student.findOne({ $or: [{ email }, { rollNumber }] });
        if (studentExists) {
            return res.status(400).json({ message: 'Student with this email or roll number already exists' });
        }

        const student = await Student.create({
            name,
            email,
            password,
            rollNumber,
            department,
            year
        });

        if (student) {
            sendTokenResponse(student, 201, res);
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Authenticate student & get token
// @route   POST /api/public/login
// @access  Public
const studentLogin = async (req, res) => {
    try {
        const { identifier, password } = req.body; // identifier can be email or rollNumber

        // Find student by email or rollNumber
        const student = await Student.findOne({
            $or: [{ email: identifier }, { rollNumber: identifier }]
        }).select('+password');

        if (student && (await student.matchPassword(password))) {
            sendTokenResponse(student, 200, res);
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get current student Profile
// @route   GET /api/public/me
// @access  Private (Student)
const getStudentMe = async (req, res) => {
    try {
        const student = await Student.findById(req.student._id);
        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Logout student
// @route   GET /api/public/logout
// @access  Private (Student)
const studentLogout = async (req, res) => {
    res.cookie('studentToken', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });
    res.status(200).json({ success: true, message: 'Logged out' });
};

// @desc    Get all public events
// @route   GET /api/public/events
// @access  Public
const getPublicEvents = async (req, res) => {
    try {
        const events = await Event.find()
            .populate('club', 'name')
            .sort({ date: 1 });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get single public event
// @route   GET /api/public/events/:id
// @access  Public
const getPublicEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate('club', 'name description');
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json(event);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Register a student for an event (Authenticated)
// @route   POST /api/public/events/register
// @access  Private (Student)
const registerForEvent = async (req, res) => {
    try {
        const { eventId } = req.body;

        if (!eventId) {
            return res.status(400).json({ message: 'Please provide an event ID' });
        }

        // Verify the event exists
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Student is already attached to req by protect middleware
        const student = req.student;

        // Check if student is already registered for this specific event
        const existingReg = await Registration.findOne({ event: eventId, student: student._id });
        if (existingReg) {
            return res.status(400).json({ message: 'You are already registered for this event!' });
        }

        // Create the registration
        const registration = await Registration.create({
            event: eventId,
            student: student._id
        });

        res.status(201).json({
            message: 'Successfully registered for the event!',
            registration
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    studentSignup,
    studentLogin,
    getStudentMe,
    studentLogout,
    getPublicEvents,
    getPublicEventById,
    registerForEvent
};
