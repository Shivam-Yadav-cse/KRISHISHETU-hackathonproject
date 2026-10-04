const Product = require('../models/Product');
const { getMandiPrice, getDemandLevel } = require('../utils/mockMandiData');
const { getPriceRecommendation } = require('../utils/priceRecommendation');

const getProducts = async (req, res) => {
  try {
    const { category, search, city, pincode, sort, page = 1, limit = 20 } = req.query;
    const query = { isAvailable: true };
    if (category) query.category = category;
    if (city) query.city = new RegExp(city, 'i');
    if (pincode) query.pincode = pincode;
    if (search) query.name = new RegExp(search, 'i');

    let sortObj = { createdAt: -1 };
    if (sort === 'price_asc') sortObj = { price: 1 };
    if (sort === 'price_desc') sortObj = { price: -1 };
    if (sort === 'rating') sortObj = { rating: -1 };
    if (sort === 'distance') sortObj = { city: 1 };

    const skip = (page - 1) * limit;
    const products = await Product.find(query).sort(sortObj).skip(skip).limit(Number(limit)).populate('farmerId', 'name city state coordinates');
    const total = await Product.countDocuments(query);
    res.json({ success: true, data: products, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('farmerId', 'name city state coordinates phone');
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    const mandiData = getMandiPrice(product.name);
    res.json({ success: true, data: { ...product.toObject(), mandiData } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, category, quantity, unit, price, description, pincode, city, state } = req.body;
    if (!name || !category || !quantity || !price) {
      return res.status(400).json({ success: false, message: 'Name, category, quantity and price are required' });
    }
    const mandiData = getMandiPrice(name, state) || {};
    const demandLevel = mandiData.demandLevel || getDemandLevel(name) || 'Medium';
    const product = await Product.create({
      name, category, quantity: Number(quantity), unit: unit || 'kg',
      price: Number(price), description,
      image: req.file ? `/uploads/${req.file.filename}` : '',
      farmerId: req.user._id,
      farmerName: req.user.name,
      farmerLocation: `${req.user.city || city}, ${req.user.state || state}`,
      pincode: pincode || req.user.pincode,
      city: city || req.user.city,
      state: state || req.user.state,
      coordinates: req.user.coordinates,
      mandiPrice: mandiData.mandiPrice || 0,
      suggestedPrice: mandiData.suggestedPrice || Number(price),
      demandLevel,
      marketTrend: mandiData.trend || 'Stable'
    });
    res.status(201).json({ success: true, message: 'Product listed successfully', data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    if (product.farmerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    const updates = { ...req.body };
    if (req.file) updates.image = `/uploads/${req.file.filename}`;
    const updated = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json({ success: true, message: 'Product updated', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    if (product.farmerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    await product.deleteOne();
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getFarmerProducts = async (req, res) => {
  try {
    const products = await Product.find({ farmerId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getPriceRecommendationHandler = async (req, res) => {
  try {
    const { cropName, state, cost } = req.query;
    const recommendation = getPriceRecommendation(cropName, state, Number(cost) || 0);
    res.json({ success: true, data: recommendation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct, getFarmerProducts, getPriceRecommendationHandler };
