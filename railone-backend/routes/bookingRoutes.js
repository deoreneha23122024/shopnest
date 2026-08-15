const express = require('express');
const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Train = require('../models/Train');
const { protect } = require('../middleware/auth');
const io = require('../socket');

const router = express.Router();

const generatePNR = () => {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
};

router.post('/initiate', protect, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { trainId, passengers, travelClass } = req.body;
    
    const train = await Train.findById(trainId).session(session);
    if (!train) {
      throw new Error('Train not found');
    }

    const available = train.availableSeats.get(travelClass) || 0;
    const requestedSeats = passengers.length;

    if (available < requestedSeats) {
      throw new Error('Not enough seats available');
    }

    // Lock seats
    train.availableSeats.set(travelClass, available - requestedSeats);
    await train.save({ session });

    // Assign rough seat numbers for now
    const passengersWithSeats = passengers.map((p, index) => ({
      ...p,
      seatNumber: `${travelClass}-${available - index}`
    }));

    // Assume flat fare for simplicity
    const farePerSeat = { '1A': 3000, '2A': 2000, '3A': 1500, 'SL': 500 };
    const totalFare = (farePerSeat[travelClass] || 1000) * requestedSeats;

    const booking = new Booking({
      pnr: generatePNR(),
      user: req.user._id,
      train: trainId,
      passengers: passengersWithSeats,
      travelClass,
      status: 'PENDING',
      totalFare,
      lockedUntil: new Date(Date.now() + 5 * 60 * 1000) // Lock for 5 mins
    });

    await booking.save({ session });
    await session.commitTransaction();

    // Broadcast updated seats
    io.getIO().emit('seatUpdate', {
      trainId: train._id,
      availableSeats: Object.fromEntries(train.availableSeats)
    });

    res.status(201).json(booking);
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ message: error.message });
  } finally {
    session.endSession();
  }
});

router.get('/pnr/:pnr', async (req, res) => {
  try {
    const booking = await Booking.findOne({ pnr: req.params.pnr }).populate('train', 'name trainNumber source destination').populate('user', 'email');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/my-bookings', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate('train', 'name trainNumber source destination').sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
