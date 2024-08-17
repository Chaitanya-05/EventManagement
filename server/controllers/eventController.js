const Event = require('../models/Event');
// const { io } = require('../server');

exports.getEvents = async (req, res) => {
    try {
        const events = await Event.find();
        res.status(200).json({ success: true, events });
    } catch (error) {
        res.status(400).json({ success: false, error: 'Failed to retrieve events' });
    }
};


exports.createEvent = async (req, res) => {
    const { name, date, time, location, description, participantLimit } = req.body;
    try {
        const event = await Event.create({
            name, date, time, location, description, participantLimit, createdBy: req.user.id
        });

        // Notify all connected clients of the new event
        global.io.emit('newEvent', event);

        res.status(201).json({ success: true, event });
    } catch (error) {
        res.status(400).json({ success: false, error: 'Event creation failed' });
    }
};

exports.updateEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });

        // Notify all participants about the event update
        global.io.to(req.params.id).emit('eventUpdated', event);

        res.status(200).json({ success: true, event });
    } catch (error) {
        res.status(400).json({ success: false, error: 'Event update failed' });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        // Notify all participants about the event deletion
        global.io.to(req.params.id).emit('eventDeleted', { eventId: req.params.id });

        await event.remove();

        res.status(200).json({ success: true, message: 'Event deleted' });
    } catch (error) {
        res.status(400).json({ success: false, error: 'Event deletion failed' });
    }
};

exports.registerForEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        let notification = '';

        if (event.participants.length < event.participantLimit) {
            event.participants.push(req.user.id);
            notification = 'You have successfully registered for the event.';
        } else {
            event.waitlist.push(req.user.id);
            notification = 'You have been added to the waitlist.';
        }

        await event.save();

        // Notify the user about their registration status
        global.io.to(req.params.id).emit('registrationStatus', {
            userId: req.user.id,
            status: notification,
        });

        res.status(200).json({ success: true, event });
    } catch (error) {
        res.status(400).json({ success: false, error: 'Registration failed' });
    }
};


exports.cancelRegistration = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        event.participants = event.participants.filter(userId => userId.toString() !== req.user.id.toString());
        event.waitlist = event.waitlist.filter(userId => userId.toString() !== req.user.id.toString());
        await event.save();
        res.status(200).json({ success: true, event });
    } catch (error) {
        res.status(400).json({ success: false, error: 'Cancellation failed' });
    }
};
