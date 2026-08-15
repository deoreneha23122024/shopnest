const express = require('express');
const router = express.Router();
const { placeOrder, getMyOrders, getSellerOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, placeOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/sellerorders', protect, getSellerOrders);
router.put('/:orderId/status', protect, updateOrderStatus);

module.exports = router;
