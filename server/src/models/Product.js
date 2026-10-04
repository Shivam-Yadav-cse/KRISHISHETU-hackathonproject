const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: {
    type: String,
    enum: ['Vegetables', 'Fruits', 'Grains', 'Dairy', 'Organic'],
    required: true
  },
  quantity: { type: Number, required: true, min: 0 },
  unit: { type: String, default: 'kg' },
  price: { type: Number, required: true, min: 0 },
  description: { type: String, trim: true },
  image: { type: String, default: '' },
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  farmerName: { type: String },
  farmerLocation: { type: String },
  mandiPrice: { type: Number, default: 0 },
  suggestedPrice: { type: Number, default: 0 },
  demandLevel: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
  rating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  pincode: { type: String },
  city: { type: String },
  state: { type: String },
  marketTrend: { type: String, enum: ['Rising', 'Stable', 'Falling'], default: 'Stable' },
  coordinates: {
    lat: { type: Number, default: 20.5937 },
    lng: { type: Number, default: 78.9629 }
  },
  isAvailable: { type: Boolean, default: true },
  totalSold: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
