const express = require('express');
const router = express.Router();
const { getStats, getAllUsers, toggleUserStatus, getAllOrders, assignDeliveryPartner, getEscrowOrders, deleteProduct } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { allowAdmin } = require('../middleware/roleMiddleware');

router.use(protect, allowAdmin);
router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.put('/users/:id/toggle', toggleUserStatus);
router.get('/orders', getAllOrders);
router.put('/orders/:id/assign-delivery', assignDeliveryPartner);
router.get('/escrow', getEscrowOrders);
router.delete('/products/:id', deleteProduct);

module.exports = router;
