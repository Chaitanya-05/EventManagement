const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    name: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    participantLimit: { type: Number, required: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    waitlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
