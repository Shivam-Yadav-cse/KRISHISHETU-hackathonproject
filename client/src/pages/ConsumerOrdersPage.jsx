import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaUnlock } from 'react-icons/fa';
import { orderAPI } from '../services/api';
import { useTranslation } from 'react-i18next';
import OrderStatusBadge from '../components/common/OrderStatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

export default function ConsumerOrdersPage() {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.getMyOrders().then(res => { setOrders(res.data.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const releaseEscrow = async (orderId) => {
    try {
      await orderAPI.releaseEscrow(orderId);
      toast.success('Payment released to farmer!');
      const res = await orderAPI.getMyOrders();
      setOrders(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to release payment');
    }
  };

  if (loading) return <LoadingSpinner text="Loading your orders..." />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="section-title mb-6">{t('orders.title')}</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">No orders yet</h3>
          <Link to="/marketplace" className="btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order._id} className="card">
              <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">Order #{order._id.slice(-6).toUpperCase()}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(order.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <OrderStatusBadge status={order.deliveryStatus} />
                  <OrderStatusBadge status={order.paymentStatus} />
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {order.products.map((p, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700 dark:text-gray-300">{p.name} × {p.quantity}</span>
                    <span className="font-semibold text-gray-900 dark:text-white">₹{p.price * p.quantity}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between text-sm border-t border-gray-100 dark:border-gray-700 pt-2 mt-2">
                  <span className="text-gray-500">Delivery Fee</span>
                  <span className="text-gray-700 dark:text-gray-300">₹{order.deliveryFee}</span>
                </div>
                <div className="flex items-center justify-between font-bold">
                  <span className="text-gray-900 dark:text-white">Total</span>
                  <span className="text-green-600 text-lg">₹{order.totalAmount}</span>
                </div>
              </div>

              {order.deliveryAddress && (
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-4">
                  <FaMapMarkerAlt className="text-green-500" />
                  <span>{order.deliveryAddress.address}, {order.deliveryAddress.city} — {order.deliveryAddress.pincode}</span>
                </div>
              )}

              <div className="flex gap-3 flex-wrap">
                <Link to={`/track/${order._id}`} className="btn-secondary text-sm py-2 px-4">
                  {t('orders.track')}
                </Link>
                {order.paymentStatus === 'Escrow Hold' && order.deliveryStatus === 'Delivered' && (
                  <button onClick={() => releaseEscrow(order._id)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl text-sm transition-all">
                    <FaUnlock />{t('orders.release')}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
