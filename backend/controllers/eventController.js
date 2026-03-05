const Event = require('../models/Event');

// @desc    Get all events for a specific club
// @route   GET /api/events/club/:clubId
// @access  Public
const getEventsByClub = async (req, res) => {
    try {
        const events = await Event.find({ club: req.params.clubId }).sort({ date: 1 });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all events (for admin dashboard filtering or superadmin)
// @route   GET /api/events
// @access  Private
const getEvents = async (req, res) => {
    try {
        let query = {};

        // If club admin, only return events for their club
        if (req.admin.role === 'clubadmin') {
            query.club = req.admin.club;
        }

        const events = await Event.find(query).populate('club', 'name').sort({ date: 1 });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Private (ClubAdmin/SuperAdmin)
const createEvent = async (req, res) => {
    try {
        const { title, description, date, location } = req.body;

        // Get club ID: Superadmin must provide it, Clubadmin uses their own
        const clubId = req.admin.role === 'clubadmin' ? req.admin.club : req.body.clubId;

        if (!clubId) {
            return res.status(400).json({ message: 'Club ID is required to create an event' });
        }

        const event = await Event.create({
            title,
            description,
            date,
            location,
            club: clubId,
            createdBy: req.admin._id,
        });

        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private
const updateEvent = async (req, res) => {
    try {
        let event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Authorization check
        if (req.admin.role !== 'superadmin' && event.club.toString() !== req.admin.club.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this event' });
        }

        event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });

        res.json(event);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private
const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Authorization check
        if (req.admin.role !== 'superadmin' && event.club.toString() !== req.admin.club.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this event' });
        }

        await event.deleteOne();
        res.json({ message: 'Event removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all registrations for an event
// @route   GET /api/events/:id/registrations
// @access  Private
const getEventRegistrations = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Authorization check
        if (req.admin.role !== 'superadmin' && event.club.toString() !== req.admin.club.toString()) {
            return res.status(403).json({ message: 'Not authorized to view registrations for this event' });
        }

        const mongoose = require('mongoose');
        const Registration = mongoose.model('Registration');

        const registrations = await Registration.find({ event: req.params.id })
            .populate('student', 'name email rollNumber department year')
            .sort({ registeredAt: -1 });

        res.json(registrations);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getEventsByClub,
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    getEventRegistrations,
};
