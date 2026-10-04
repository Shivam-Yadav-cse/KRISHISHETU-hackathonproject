const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Notification = require('../models/Notification');

const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalFarmers = await User.countDocuments({ role: 'farmer' });
    const totalConsumers = await User.countDocuments({ role: 'consumer' });
    const totalDelivery = await User.countDocuments({ role: 'delivery' });
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ deliveryStatus: 'Pending' });
    const deliveredOrders = await Order.countDocuments({ deliveryStatus: 'Delivered' });
    const escrowOrders = await Order.countDocuments({ paymentStatus: 'Escrow Hold' });
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const platformRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$platformFee' } } }
    ]);

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('customer', 'name')
      .populate('farmer', 'name');

    const monthlyOrders = await Order.aggregate([
      {
        $group: {
          _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
          count: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 6 }
    ]);

    res.json({
      success: true,
      data: {
        users: { total: totalUsers, farmers: totalFarmers, consumers: totalConsumers, delivery: totalDelivery },
        products: { total: totalProducts },
        orders: { total: totalOrders, pending: pendingOrders, delivered: deliveredOrders, escrow: escrowOrders },
        revenue: {
          total: totalRevenue[0]?.total || 0,
          platform: platformRevenue[0]?.total || 0
        },
        recentOrders,
        monthlyOrders
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 20 } = req.query;
    const query = role ? { role } : {};
    const skip = (page - 1) * limit;
    const users = await User.find(query).select('-password').sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
    const total = await User.countDocuments(query);
    res.json({ success: true, data: users, total });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, message: `User ${user.isActive ? 'activated' : 'deactivated'}`, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = status ? { deliveryStatus: status } : {};
    const skip = (page - 1) * limit;
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('customer', 'name phone')
      .populate('farmer', 'name phone')
      .populate('deliveryPartner', 'name phone');
    const total = await Order.countDocuments(query);
    res.json({ success: true, data: orders, total });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const assignDeliveryPartner = async (req, res) => {
  try {
    const { deliveryPartnerId } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    const partner = await User.findById(deliveryPartnerId);
    if (!partner || partner.role !== 'delivery') {
      return res.status(400).json({ success: false, message: 'Invalid delivery partner' });
    }
    order.deliveryPartner = deliveryPartnerId;
    order.deliveryStatus = 'Assigned';
    order.trackingUpdates.push({ status: 'Assigned', note: `Assigned to ${partner.name}` });
    await order.save();
    await Notification.create({
      user: deliveryPartnerId,
      title: 'New Delivery Assigned',
      message: `You have been assigned order #${order._id.toString().slice(-6)} for delivery.`,
      type: 'delivery', orderId: order._id
    });
    await Notification.create({
      user: order.customer,
      title: 'Delivery Partner Assigned',
      message: `${partner.name} will deliver your order #${order._id.toString().slice(-6)}.`,
      type: 'delivery', orderId: order._id
    });
    res.json({ success: true, message: 'Delivery partner assigned', data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getEscrowOrders = async (req, res) => {
  try {
    const orders = await Order.find({ paymentStatus: 'Escrow Hold' })
      .sort({ createdAt: -1 })
      .populate('customer', 'name phone')
      .populate('farmer', 'name phone');
    const totalEscrowed = orders.reduce((acc, o) => acc + o.farmerAmount, 0);
    res.json({ success: true, data: orders, totalEscrowed });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Product deleted by admin' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getStats, getAllUsers, toggleUserStatus, getAllOrders, assignDeliveryPartner, getEscrowOrders, deleteProduct };
