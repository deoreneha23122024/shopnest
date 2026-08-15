const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  station: String,
  arrivalTime: String,
  departureTime: String,
  day: Number,
});

const trainSchema = new mongoose.Schema({
  trainNumber: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  source: { type: String, required: true },
  destination: { type: String, required: true },
  schedule: [scheduleSchema],
  classes: [{ type: String, enum: ['1A', '2A', '3A', 'SL'] }],
  totalSeats: {
    type: Map,
    of: Number,
  },
  availableSeats: {
    type: Map,
    of: Number,
  },
});

module.exports = mongoose.model('Train', trainSchema);
