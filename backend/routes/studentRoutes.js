const express = require('express');
const {
    studentSignup,
    studentLogin,
    getPublicEvents,
    getPublicEventById,
    registerForEvent,
    getStudentMe,
    studentLogout
} = require('../controllers/studentController');
const { protectStudent } = require('../middleware/studentAuth');

const router = express.Router();

// Public auth routes
router.post('/signup', studentSignup);
router.post('/login', studentLogin);

// Public event routes
router.get('/events', getPublicEvents);
router.get('/events/:id', getPublicEventById);

// Protected student routes
router.get('/me', protectStudent, getStudentMe);
router.get('/logout', protectStudent, studentLogout);
router.post('/events/register', protectStudent, registerForEvent);

module.exports = router;
