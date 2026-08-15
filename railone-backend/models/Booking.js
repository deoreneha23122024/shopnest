const mongoose = require('mongoose');

const bookedPassengerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  seatNumber: { type: String }, // e.g., '1A-23'
});

const bookingSchema = new mongoose.Schema({
  pnr: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  train: { type: mongoose.Schema.Types.ObjectId, ref: 'Train', required: true },
  passengers: [bookedPassengerSchema],
  travelClass: { type: String, required: true },
  status: { type: String, enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'FAILED'], default: 'PENDING' },
  totalFare: { type: Number, required: true },
  lockedUntil: { type: Date },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
