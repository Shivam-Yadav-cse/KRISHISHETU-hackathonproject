const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getOrderById, getFarmerOrders, releaseEscrow, updateDeliveryStatus } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { allowConsumer, allowFarmer } = require('../middleware/roleMiddleware');

router.post('/', protect, allowConsumer, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/farmer-orders', protect, allowFarmer, getFarmerOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/release-escrow', protect, allowConsumer, releaseEscrow);
router.put('/:id/delivery-status', protect, updateDeliveryStatus);

module.exports = router;
