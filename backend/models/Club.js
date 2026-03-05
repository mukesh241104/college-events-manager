const mongoose = require('mongoose');

const clubSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Club name is required'],
        unique: true,
        trim: true,
    },
    description: {
        type: String,
    },
}, { timestamps: true });

module.exports = mongoose.model('Club', clubSchema);
