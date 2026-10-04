const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct, getFarmerProducts, getPriceRecommendationHandler } = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { allowFarmer, allowFarmerOrAdmin } = require('../middleware/roleMiddleware');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s/g, '-')}`)
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) cb(null, true);
    else cb(new Error('Only image files allowed'));
  },
  limits: { fileSize: 5 * 1024 * 1024 }
});

router.get('/', getProducts);
router.get('/farmer/my-products', protect, allowFarmer, getFarmerProducts);
router.get('/price-recommendation', protect, allowFarmer, getPriceRecommendationHandler);
router.get('/:id', getProductById);
router.post('/', protect, allowFarmer, upload.single('image'), createProduct);
router.put('/:id', protect, allowFarmerOrAdmin, upload.single('image'), updateProduct);
router.delete('/:id', protect, allowFarmerOrAdmin, deleteProduct);

module.exports = router;
