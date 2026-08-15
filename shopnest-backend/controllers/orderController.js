const Order = require('../models/Order');

const placeOrder = async (req, res) => {
  try {
    const { buyerId, items, total, address, paymentMethod, subtotal, tax, shipping } = req.body;
    
    // We should probably rely on req.user._id instead of buyerId from body
    // but the spec says "Requires buyerId, items, total, address, paymentMethod."
    
    const newOrder = new Order({
      buyerId: buyerId || req.user._id,
      buyerName: req.user.name,
      buyerEmail: req.user.email,
      items,
      subtotal: subtotal || total,
      tax: tax || 0,
      shipping: shipping || 0,
      total,
      address,
      paymentMethod,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json({ success: true, order: savedOrder });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyerId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error('Error getting my orders:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const getSellerOrders = async (req, res) => {
  try {
    // Return orders where any item has sellerId == req.user._id
    const orders = await Order.find({ 'items.sellerId': req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error('Error getting seller orders:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.status = status;
    
    // Updates status and the corresponding timeline date field.
    if (status === 'shipped') {
      order.shippedAt = new Date();
    } else if (status === 'delivered') {
      order.deliveredAt = new Date();
    } else if (status === 'cancelled') {
      order.cancelledAt = new Date();
    } else if (status === 'confirmed') {
      order.packedAt = new Date(); // Using confirmed as packed mapping since packed is missing in enum
    }

    await order.save();
    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = {
  placeOrder,
  getMyOrders,
  getSellerOrders,
  updateOrderStatus
};
