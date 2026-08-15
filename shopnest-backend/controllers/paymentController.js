const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');

const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (!amount) {
      return res.status(400).json({ message: 'Amount is required' });
    }

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: amount, // amount in the smallest currency unit
      currency: 'INR',
      receipt: 'receipt#1',
    };

    const order = await instance.orders.create(options);
    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error('Error creating razorpay order:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const secret = process.env.RAZORPAY_KEY_SECRET;

    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generated_signature === razorpay_signature) {
      res.status(200).json({ success: true, message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid signature' });
    }
  } catch (error) {
    console.error('Error verifying razorpay payment:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = {
  createRazorpayOrder,
  verifyRazorpayPayment,
};
