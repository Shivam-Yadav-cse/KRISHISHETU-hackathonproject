import React, { useState, useEffect } from 'react';
import { orderAPI } from '../../services/api';
import OrderStatusBadge from '../../components/common/OrderStatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function FarmerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.getFarmerOrders().then(res => { setOrders(res.data.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner text="Loading orders..." />;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="section-title mb-6">Farmer Orders</h1>
      {orders.length === 0 ? (
        <div className="text-center py-20"><div className="text-6xl mb-4">📦</div><p className="text-gray-500">No orders received yet</p></div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order._id} className="card">
              <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">Order #{order._id.slice(-6).toUpperCase()}</p>
                  <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Customer: <strong>{order.customer?.name}</strong> · {order.customer?.phone}</p>
                  {order.deliveryPartner && <p className="text-sm text-gray-600 dark:text-gray-400">Delivery: <strong>{order.deliveryPartner?.name}</strong></p>}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <OrderStatusBadge status={order.deliveryStatus} />
                  <OrderStatusBadge status={order.paymentStatus} />
                  <p className={`text-xs font-medium ${order.farmerPaymentReleased ? 'text-green-600' : 'text-orange-500'}`}>
                    {order.farmerPaymentReleased ? '✓ Payment Released' : '⏳ Awaiting Delivery'}
                  </p>
                </div>
              </div>
              <div className="space-y-1 mb-3">
                {order.products.map((p, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">{p.name} × {p.quantity}</span>
                    <span className="font-medium text-gray-900 dark:text-white">₹{p.price * p.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 p-3 rounded-xl">
                <span className="text-sm text-gray-600 dark:text-gray-400">Your Earning</span>
                <span className="font-bold text-green-600 text-lg">₹{order.farmerAmount}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
