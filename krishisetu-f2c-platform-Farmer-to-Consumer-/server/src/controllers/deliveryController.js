const Order = require('../models/Order');
const User = require('../models/User');
const Notification = require('../models/Notification');

const getMyDeliveries = async (req, res) => {
  try {
    const orders = await Order.find({ deliveryPartner: req.user._id })
      .sort({ createdAt: -1 })
      .populate('customer', 'name phone address city pincode coordinates')
      .populate('farmer', 'name phone city coordinates');
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateDeliveryStatus = async (req, res) => {
  try {
    const { status, note, lat, lng } = req.body;
    const validStatuses = ['Picked Up', 'Out for Delivery', 'Delivered'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    const order = await Order.findOne({ _id: req.params.id, deliveryPartner: req.user._id });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.deliveryStatus = status;
    order.trackingUpdates.push({ status, note: note || `Status: ${status}` });

    if (status === 'Delivered') {
      order.deliveredAt = new Date();
      order.paymentStatus = 'Released';
      order.farmerPaymentReleased = true;
      await User.findByIdAndUpdate(order.farmer, { $inc: { totalEarnings: order.farmerAmount } });
      await User.findByIdAndUpdate(req.user._id, { $inc: { totalEarnings: order.partnerEarning } });
    }
    await order.save();

    await Notification.create({
      user: order.customer,
      title: `Order ${status}`,
      message: `Your order #${order._id.toString().slice(-6)} is ${status.toLowerCase()}.`,
      type: 'delivery', orderId: order._id
    });

    req.app.get('io')?.emit(`order_update_${order._id}`, { status, trackingUpdates: order.trackingUpdates });
    res.json({ success: true, message: `Order marked as ${status}`, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getDeliveryEarnings = async (req, res) => {
  try {
    const delivered = await Order.find({ deliveryPartner: req.user._id, deliveryStatus: 'Delivered' });
    const totalEarnings = delivered.reduce((acc, o) => acc + (o.partnerEarning || 20), 0);
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEarnings = delivered
      .filter(o => new Date(o.deliveredAt) >= todayStart)
      .reduce((acc, o) => acc + (o.partnerEarning || 20), 0);
    res.json({
      success: true,
      data: {
        totalEarnings,
        todayEarnings,
        totalDeliveries: delivered.length,
        recentDeliveries: delivered.slice(-5)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getMyDeliveries, updateDeliveryStatus, getDeliveryEarnings };
