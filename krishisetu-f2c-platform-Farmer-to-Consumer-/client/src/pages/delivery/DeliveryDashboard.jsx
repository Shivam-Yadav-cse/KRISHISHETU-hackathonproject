import React, { useState, useEffect } from 'react';
import { FaTruck, FaRupeeSign, FaCheckCircle, FaMapMarkerAlt } from 'react-icons/fa';
import { deliveryAPI } from '../../services/api';
import { useSocket } from '../../context/SocketContext';
import OrderStatusBadge from '../../components/common/OrderStatusBadge';
import StatCard from '../../components/common/StatCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const NEXT_STATUSES = {
  'Assigned': 'Picked Up',
  'Picked Up': 'Out for Delivery',
  'Out for Delivery': 'Delivered'
};

export default function DeliveryDashboard() {
  const { socket } = useSocket();
  const [orders, setOrders] = useState([]);
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    Promise.all([deliveryAPI.getMyDeliveries(), deliveryAPI.getEarnings()]).then(([oRes, eRes]) => {
      setOrders(oRes.data.data);
      setEarnings(eRes.data.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const updateStatus = async (orderId, status) => {
    setUpdating(orderId);
    try {
      await deliveryAPI.updateStatus(orderId, { status, note: `Delivery partner updated: ${status}` });
      toast.success(`Order marked as ${status}`);
      const res = await deliveryAPI.getMyDeliveries();
      setOrders(res.data.data);
      if (socket) socket.emit('order_status_update', { orderId, status });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  if (loading) return <LoadingSpinner text="Loading deliveries..." />;

  const pendingOrders = orders.filter(o => o.deliveryStatus !== 'Delivered');
  const completedOrders = orders.filter(o => o.deliveryStatus === 'Delivered');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="section-title mb-6">🚴 Delivery Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={FaTruck} label="Total Assigned" value={orders.length} color="blue" />
        <StatCard icon={FaCheckCircle} label="Completed" value={completedOrders.length} color="green" />
        <StatCard icon={FaRupeeSign} label="Today's Earnings" value={`₹${earnings?.todayEarnings || 0}`} color="orange" />
        <StatCard icon={FaRupeeSign} label="Total Earnings" value={`₹${earnings?.totalEarnings || 0}`} color="purple" />
      </div>

      <div className="mb-6">
        <h2 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
          Active Deliveries ({pendingOrders.length})
        </h2>
        <div className="space-y-4">
          {pendingOrders.length === 0 ? (
            <div className="card text-center py-8 text-gray-400">
              <FaTruck className="text-4xl mx-auto mb-3 opacity-30" />
              <p>No active deliveries. Check back soon!</p>
            </div>
          ) : pendingOrders.map(order => {
            const nextStatus = NEXT_STATUSES[order.deliveryStatus];
            return (
              <div key={order._id} className="card border-l-4 border-orange-400">
                <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">Order #{order._id.slice(-6).toUpperCase()}</p>
                    <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</p>
                  </div>
                  <OrderStatusBadge status={order.deliveryStatus} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mb-1">PICKUP FROM</p>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{order.farmer?.name}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <FaMapMarkerAlt className="text-blue-500" />{order.farmer?.city}, {order.farmer?.state}
                    </p>
                    {order.farmer?.phone && <p className="text-xs text-gray-500 mt-1">📞 {order.farmer?.phone}</p>}
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                    <p className="text-xs text-green-600 dark:text-green-400 font-semibold mb-1">DELIVER TO</p>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{order.customer?.name}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <FaMapMarkerAlt className="text-green-500" />{order.deliveryAddress?.address}, {order.deliveryAddress?.city}
                    </p>
                    {order.customer?.phone && <p className="text-xs text-gray-500 mt-1">📞 {order.customer?.phone}</p>}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div>
                    <p className="text-xs text-gray-500">Products</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{order.products?.map(p => `${p.name} ×${p.quantity}`).join(', ')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Your Earning</p>
                    <p className="font-bold text-green-600 text-lg">₹{order.partnerEarning || 20}</p>
                  </div>
                </div>

                {nextStatus && (
                  <button onClick={() => updateStatus(order._id, nextStatus)} disabled={updating === order._id}
                    className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-60">
                    {updating === order._id ? 'Updating...' : `Mark as "${nextStatus}" →`}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="font-bold text-gray-900 dark:text-white mb-4">Completed Deliveries</h2>
        <div className="space-y-3">
          {completedOrders.map(order => (
            <div key={order._id} className="card flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Order #{order._id.slice(-6).toUpperCase()}</p>
                <p className="text-xs text-gray-500">{order.customer?.name} · {new Date(order.deliveredAt || order.updatedAt).toLocaleDateString('en-IN')}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-green-600">₹{order.partnerEarning || 20}</span>
                <OrderStatusBadge status="Delivered" />
              </div>
            </div>
          ))}
          {completedOrders.length === 0 && <p className="text-gray-400 text-sm text-center py-4">No completed deliveries yet</p>}
        </div>
      </div>
    </div>
  );
}
