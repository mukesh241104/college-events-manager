const jwt = require('jsonwebtoken');
const Student = require('../models/Student');

const protectStudent = async (req, res, next) => {
    let token;

    // Read Bearer token from Authorization header (localStorage-based auth)
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.student = await Student.findById(decoded.id).select('-password');

        if (!req.student) {
            return res.status(401).json({ message: 'Not authorized, student not found' });
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

module.exports = { protectStudent };
