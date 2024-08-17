const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: "*", // Update this to match your frontend origin
        methods: ["GET", "POST"],
    },
});

global.io = io;


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

// Socket.IO logic
io.on('connection', (socket) => {
    console.log('New WebSocket connection');

    socket.on('joinEvent', (eventId) => {
        socket.join(eventId);
        console.log(`User joined event room: ${eventId}`);
    });

    socket.on('leaveEvent', (eventId) => {
        socket.leave(eventId);
        console.log(`User left event room: ${eventId}`);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        server.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    })
    .catch((error) => console.log('MongoDB connection error:', error));


// module.exports = { io }; // Export io for use in controllers
