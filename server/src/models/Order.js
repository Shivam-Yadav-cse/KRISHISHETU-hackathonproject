const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  deliveryPartner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  products: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    price: Number,
    quantity: Number,
    image: String
  }],
  totalAmount: { type: Number, required: true },
  deliveryFee: { type: Number, default: 30 },
  platformFee: { type: Number, default: 0 },
  farmerAmount: { type: Number, default: 0 },
  partnerEarning: { type: Number, default: 0 },
  deliveryAddress: {
    address: String,
    city: String,
    state: String,
    pincode: String
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Escrow Hold', 'Released', 'Refunded'],
    default: 'Pending'
  },
  deliveryStatus: {
    type: String,
    enum: ['Pending', 'Assigned', 'Picked Up', 'Out for Delivery', 'Delivered'],
    default: 'Pending'
  },
  paymentMethod: { type: String, default: 'stripe' },
  stripeSessionId: { type: String },
  farmerPaymentReleased: { type: Boolean, default: false },
  trackingUpdates: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    note: String
  }],
  estimatedDelivery: { type: Date },
  deliveredAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
