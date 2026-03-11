const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const { protect } = require('../middleware/auth');

// @route   POST /api/teams
// @desc    Create a new team
router.post('/', protect, async (req, res) => {
    try {
        const { team_name, project_idea, members } = req.body;

        // Members might be passed in as array of user IDs, but creator is definitely a member
        const teamMembers = members || [];
        if (!teamMembers.includes(req.user.id)) {
            teamMembers.push(req.user.id);
        }

        const team = await Team.create({
            team_name,
            project_idea,
            members: teamMembers,
            createdBy: req.user.id
        });

        res.status(201).json(team);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/teams
// @desc    Get all teams
router.get('/', async (req, res) => {
    try {
        const teams = await Team.find().populate('members', 'name role skills');
        res.json(teams);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/teams/:id
// @desc    Get team by ID
router.get('/:id', async (req, res) => {
    try {
        const team = await Team.findById(req.params.id).populate('members', 'name role skills bio university');
        if (!team) return res.status(404).json({ message: 'Team not found' });

        res.json(team);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
