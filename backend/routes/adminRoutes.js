const express = require('express');
const { createClub, getClubs, createClubAdmin } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Routes for creating clubs and club admins - Restricted to superadmin
router.post('/clubs', protect, authorize('superadmin'), createClub);
router.post('/club-admins', protect, authorize('superadmin'), createClubAdmin);

// Public route to get list of clubs (needed for frontend dropdowns)
router.get('/clubs', getClubs);

module.exports = router;
