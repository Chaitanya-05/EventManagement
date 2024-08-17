const express = require('express');
const {
    createEvent,
    getEvents,
    updateEvent,
    deleteEvent,
    registerForEvent,
    cancelRegistration
} = require('../controllers/eventController');
const { protect, admin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/')
    .get(getEvents)
    .post(protect, admin, createEvent);

router.route('/:id')
    .put(protect, admin, updateEvent)
    .delete(protect, admin, deleteEvent);

router.route('/register/:id')
    .post(protect, registerForEvent);

router.route('/cancel/:id')
    .post(protect, cancelRegistration);

module.exports = router;
