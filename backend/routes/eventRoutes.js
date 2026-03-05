const express = require('express');
const {
    getEventsByClub,
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    getEventRegistrations
} = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public route to view events
router.get('/club/:clubId', getEventsByClub);

// Protected routes
router.route('/')
    .get(protect, getEvents)
    .post(protect, createEvent);

router.route('/:id')
    .put(protect, updateEvent)
    .delete(protect, deleteEvent);

router.route('/:id/registrations')
    .get(protect, getEventRegistrations);

module.exports = router;
