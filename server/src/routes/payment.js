const express = require('express');
const router = express.Router();
const { createCheckoutSession, verifyPayment, getMandiPrices } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/create-checkout-session', protect, createCheckoutSession);
router.get('/verify/:sessionId', protect, verifyPayment);
router.get('/mandi-prices', getMandiPrices);

module.exports = router;
