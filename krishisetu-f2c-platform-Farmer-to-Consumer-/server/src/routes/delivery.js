const express = require('express');
const router = express.Router();
const { getMyDeliveries, updateDeliveryStatus, getDeliveryEarnings } = require('../controllers/deliveryController');
const { protect } = require('../middleware/authMiddleware');
const { allowDeliveryPartner } = require('../middleware/roleMiddleware');

router.use(protect, allowDeliveryPartner);
router.get('/my-deliveries', getMyDeliveries);
router.put('/orders/:id/status', updateDeliveryStatus);
router.get('/earnings', getDeliveryEarnings);

module.exports = router;
