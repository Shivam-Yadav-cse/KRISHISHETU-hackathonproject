const express = require('express');
const router = express.Router();
const { createReview, getProductReviews, getFarmerReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createReview);
router.get('/product/:productId', getProductReviews);
router.get('/farmer/:farmerId', getFarmerReviews);

module.exports = router;
