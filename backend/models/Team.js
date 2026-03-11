const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    team_name: { type: String, required: true },
    project_idea: { type: String, required: true },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: { type: Date, default: Date.now }
});

const Team = mongoose.model('Team', teamSchema);
module.exports = Team;
