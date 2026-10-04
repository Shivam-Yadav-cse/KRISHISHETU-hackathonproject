const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User');
const Notification = require('../models/Notification');

const createOrder = async (req, res) => {
  try {
    const { deliveryAddress, paymentMethod = 'stripe', stripeSessionId } = req.body;
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }
    const firstItem = cart.items[0];
    const farmerId = firstItem.farmerId || firstItem.product.farmerId;
    const subtotal = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const deliveryFee = 30;
    const platformFee = Math.round(subtotal * 0.05);
    const totalAmount = subtotal + deliveryFee;
    const farmerAmount = subtotal - platformFee;

    const order = await Order.create({
      customer: req.user._id,
      farmer: farmerId,
      products: cart.items.map(item => ({
        product: item.product._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      totalAmount,
      deliveryFee,
      platformFee,
      farmerAmount,
      partnerEarning: 20,
      deliveryAddress,
      paymentStatus: stripeSessionId ? 'Escrow Hold' : 'Pending',
      paymentMethod,
      stripeSessionId,
      trackingUpdates: [{ status: 'Pending', note: 'Order placed successfully' }],
      estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
    });

    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { quantity: -item.quantity, totalSold: item.quantity }
      });
    }
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

    await Notification.create({
      user: req.user._id,
      title: 'Order Placed!',
      message: `Your order #${order._id.toString().slice(-6)} has been placed successfully.`,
      type: 'order',
      orderId: order._id
    });

    res.status(201).json({ success: true, message: 'Order placed successfully', data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id })
      .sort({ createdAt: -1 })
      .populate('farmer', 'name city')
      .populate('deliveryPartner', 'name phone');
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email phone city')
      .populate('farmer', 'name email phone city coordinates')
      .populate('deliveryPartner', 'name phone coordinates');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getFarmerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ farmer: req.user._id })
      .sort({ createdAt: -1 })
      .populate('customer', 'name phone city')
      .populate('deliveryPartner', 'name phone');
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const releaseEscrow = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (order.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    if (order.paymentStatus !== 'Escrow Hold') {
      return res.status(400).json({ success: false, message: 'Payment already processed' });
    }
    order.paymentStatus = 'Released';
    order.farmerPaymentReleased = true;
    order.deliveredAt = new Date();
    order.deliveryStatus = 'Delivered';
    order.trackingUpdates.push({ status: 'Delivered', note: 'Escrow released. Payment sent to farmer.' });
    await order.save();
    await User.findByIdAndUpdate(order.farmer, { $inc: { totalEarnings: order.farmerAmount } });
    await Notification.create({
      user: order.farmer,
      title: 'Payment Released!',
      message: `₹${order.farmerAmount} has been released to your account for order #${order._id.toString().slice(-6)}.`,
      type: 'payment', orderId: order._id
    });
    res.json({ success: true, message: 'Escrow released. Payment sent to farmer.', data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateDeliveryStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    order.deliveryStatus = status;
    order.trackingUpdates.push({ status, note: note || `Status updated to ${status}` });
    if (status === 'Delivered') {
      order.deliveredAt = new Date();
      if (order.paymentStatus === 'Escrow Hold') order.paymentStatus = 'Released';
    }
    await order.save();
    await Notification.create({
      user: order.customer,
      title: `Order ${status}`,
      message: `Your order #${order._id.toString().slice(-6)} is now: ${status}`,
      type: 'delivery', orderId: order._id
    });
    res.json({ success: true, message: 'Status updated', data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createOrder, getMyOrders, getOrderById, getFarmerOrders, releaseEscrow, updateDeliveryStatus };
