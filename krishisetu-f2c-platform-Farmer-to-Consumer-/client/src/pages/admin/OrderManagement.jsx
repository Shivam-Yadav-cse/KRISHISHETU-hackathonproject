import React, { useState, useEffect } from 'react';
import { FaTruck } from 'react-icons/fa';
import { adminAPI } from '../../services/api';
import OrderStatusBadge from '../../components/common/OrderStatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [deliveryPartners, setDeliveryPartners] = useState([]);
  const [assigning, setAssigning] = useState(null);
  const [selectedPartner, setSelectedPartner] = useState({});

  useEffect(() => {
    Promise.all([
      adminAPI.getOrders(filter ? { status: filter } : {}),
      adminAPI.getUsers({ role: 'delivery' })
    ]).then(([oRes, dRes]) => {
      setOrders(oRes.data.data);
      setDeliveryPartners(dRes.data.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [filter]);

  const assignDelivery = async (orderId) => {
    if (!selectedPartner[orderId]) { toast.error('Select a delivery partner'); return; }
    setAssigning(orderId);
    try {
      await adminAPI.assignDelivery(orderId, { deliveryPartnerId: selectedPartner[orderId] });
      toast.success('Delivery partner assigned!');
      const res = await adminAPI.getOrders(filter ? { status: filter } : {});
      setOrders(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Assignment failed');
    } finally { setAssigning(null); }
  };

  if (loading) return <LoadingSpinner text="Loading orders..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="section-title mb-6">Order Management</h1>

      <div className="flex gap-2 mb-6 flex-wrap">
        {['', 'Pending', 'Assigned', 'Picked Up', 'Out for Delivery', 'Delivered'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === s ? 'bg-green-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-green-400'}`}>
            {s || 'All'}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {orders.map(order => (
          <div key={order._id} className="card">
            <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
              <div>
                <p className="font-bold text-gray-900 dark:text-white">#{order._id.slice(-6).toUpperCase()}</p>
                <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <OrderStatusBadge status={order.deliveryStatus} />
                <OrderStatusBadge status={order.paymentStatus} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <p className="text-xs text-gray-400 mb-1">Customer</p>
                <p className="font-medium text-gray-900 dark:text-white">{order.customer?.name || 'N/A'}</p>
                <p className="text-gray-500">{order.customer?.phone}</p>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <p className="text-xs text-gray-400 mb-1">Farmer</p>
                <p className="font-medium text-gray-900 dark:text-white">{order.farmer?.name || 'N/A'}</p>
                <p className="text-gray-500">{order.farmer?.phone}</p>
              </div>
              <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                <p className="text-xs text-gray-400 mb-1">Delivery Partner</p>
                <p className="font-medium text-gray-900 dark:text-white">{order.deliveryPartner?.name || 'Not Assigned'}</p>
                <p className="text-gray-500">{order.deliveryPartner?.phone}</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-bold text-green-600 text-lg">₹{order.totalAmount}</span>
              {order.deliveryStatus === 'Pending' && (
                <div className="flex items-center gap-2">
                  <select value={selectedPartner[order._id] || ''} onChange={e => setSelectedPartner(p => ({ ...p, [order._id]: e.target.value }))}
                    className="input-field text-sm py-2 w-44">
                    <option value="">Select Partner</option>
                    {deliveryPartners.map(dp => <option key={dp._id} value={dp._id}>{dp.name}</option>)}
                  </select>
                  <button onClick={() => assignDelivery(order._id)} disabled={assigning === order._id}
                    className="flex items-center gap-2 btn-primary text-sm py-2 disabled:opacity-60">
                    <FaTruck />{assigning === order._id ? 'Assigning...' : 'Assign'}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {orders.length === 0 && <div className="text-center py-16 text-gray-400"><p className="text-5xl mb-4">📦</p><p>No orders found</p></div>}
      </div>
    </div>
  );
}
