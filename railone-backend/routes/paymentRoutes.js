const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Booking = require('../models/Booking');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/create-order', protect, async (req, res) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId);

    if (!booking || booking.status !== 'PENDING') {
      return res.status(400).json({ message: 'Invalid booking or already processed' });
    }

    if (new Date() > booking.lockedUntil) {
      return res.status(400).json({ message: 'Booking time expired. Please rebook.' });
    }

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: booking.totalFare * 100, // amount in smallest currency unit (paise)
      currency: "INR",
      receipt: `receipt_order_${booking._id}`,
    };

    const order = await instance.orders.create(options);
    
    booking.razorpayOrderId = order.id;
    await booking.save();

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

router.post('/verify', protect, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;
    
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      const booking = await Booking.findById(bookingId);
      if (!booking || booking.status !== 'PENDING') {
         return res.status(400).json({ message: 'Invalid booking' });
      }

      booking.status = 'CONFIRMED';
      booking.razorpayPaymentId = razorpay_payment_id;
      booking.razorpaySignature = razorpay_signature;
      await booking.save();

      res.json({ message: 'Payment verified successfully', booking });
    } else {
      res.status(400).json({ message: 'Invalid signature' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
