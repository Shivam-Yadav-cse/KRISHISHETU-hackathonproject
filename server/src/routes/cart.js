const express = require('express');
const router = express.Router();
const { getCart, addToCart, updateCartItem, removeFromCart, clearCart } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');
const { allowConsumer } = require('../middleware/roleMiddleware');

router.get('/', protect, allowConsumer, getCart);
router.post('/add', protect, allowConsumer, addToCart);
router.put('/item/:productId', protect, allowConsumer, updateCartItem);
router.delete('/item/:productId', protect, allowConsumer, removeFromCart);
router.delete('/clear', protect, allowConsumer, clearCart);

module.exports = router;
