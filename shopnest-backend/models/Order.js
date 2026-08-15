const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId:   { type: Number, required: true },
  title:       { type: String, required: true },
  price:       { type: Number, required: true },
  image:       { type: String, default: '' },
  category:    { type: String, default: '' },
  quantity:    { type: Number, required: true, min: 1 },
  sellerId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sellerName:  { type: String, default: '' },
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         _id: { type: string }
 *         buyerId: { type: string }
 *         buyerName: { type: string }
 *         items: { type: array }
 *         subtotal: { type: number }
 *         tax: { type: number }
 *         total: { type: number }
 *         status: { type: string, enum: [pending, confirmed, shipped, delivered, cancelled] }
 *         address: { type: object }
 *         paymentMethod: { type: string }
 */
const orderSchema = new mongoose.Schema(
  {
    buyerId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    buyerName:     { type: String, required: true },
    buyerEmail:    { type: String, required: true },
    items:         { type: [orderItemSchema], required: true },
    subtotal:      { type: Number, required: true },
    tax:           { type: Number, default: 0 },
    shipping:      { type: Number, default: 0 },
    total:         { type: Number, required: true },
    status:        { type: String, enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
    address: {
      fullName:   { type: String, required: true },
      phone:      { type: String, required: true },
      street:     { type: String, required: true },
      city:       { type: String, required: true },
      state:      { type: String, required: true },
      pincode:    { type: String, required: true },
    },
    paymentMethod: { type: String, enum: ['cod', 'upi', 'card'], default: 'cod' },
    paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    packedAt: Date,
    shippedAt: Date,
    deliveredAt: Date,
    cancelledAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
