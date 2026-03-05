const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Event title is required'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Event description is required'],
    },
    date: {
        type: Date,
        required: [true, 'Event date is required'],
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
    },
    club: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Club',
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
