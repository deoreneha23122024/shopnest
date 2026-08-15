require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const connectDB = require('./config/db');
const socket = require('./socket');
const Booking = require('./models/Booking');
const Train = require('./models/Train');

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = socket.init(server);

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/trains', require('./routes/trainRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));

// Background worker to release locked seats
setInterval(async () => {
  try {
    const expiredBookings = await Booking.find({
      status: 'PENDING',
      lockedUntil: { $lt: new Date() }
    });

    for (const booking of expiredBookings) {
      booking.status = 'FAILED';
      await booking.save();

      const train = await Train.findById(booking.train);
      if (train) {
        const currentAvail = train.availableSeats.get(booking.travelClass) || 0;
        train.availableSeats.set(booking.travelClass, currentAvail + booking.passengers.length);
        await train.save();

        io.emit('seatUpdate', {
          trainId: train._id,
          availableSeats: Object.fromEntries(train.availableSeats)
        });
      }
    }
  } catch (error) {
    console.error('Seat release worker error:', error);
  }
}, 60000); // Check every minute

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
