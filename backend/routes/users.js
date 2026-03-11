const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @route   GET /api/users
// @desc    Get all users with optional filters
router.get('/', async (req, res) => {
    try {
        const { role, skills, university } = req.query;
        let query = {};

        if (role) query.role = role;
        if (university) query.university = { $regex: university, $options: 'i' };
        if (skills) {
            // skills can be comma separated
            const skillsArray = skills.split(',').map(s => s.trim());
            query.skills = { $in: skillsArray };
        }

        const users = await User.find(query).select('-password');
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/users/match
// @desc    Get suggested teammates for the logged-in user
router.get('/match', protect, async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id);
        if (!currentUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const allUsers = await User.find({ _id: { $ne: req.user.id } }).select('-password');

        // Match calculation:
        // Prioritize complementary roles and overlapping skills etc.
        // For simplicity:
        // 1. Roles different from currentUser = +40%
        // 2. Overlapping skills = +10% for each
        // 3. Same university = +20%

        const scoredUsers = allUsers.map(u => {
            let score = 0;
            if (u.role !== currentUser.role) score += 40;
            else score += 10; // same role but might be useful

            if (u.university.toLowerCase() === currentUser.university.toLowerCase()) {
                score += 20;
            }

            // check skills
            const overlap = u.skills.filter(s => currentUser.skills.includes(s)).length;
            score += overlap * 10;

            // cap at 98%
            score = Math.min(score, 98);

            return {
                ...u.toObject(),
                compatibility: score
            };
        });

        // Sort by highest compatibility
        scoredUsers.sort((a, b) => b.compatibility - a.compatibility);

        res.json(scoredUsers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/users/:id
// @desc    Get a single user profile
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
