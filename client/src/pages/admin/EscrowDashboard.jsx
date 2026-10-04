import React, { useState, useEffect } from 'react';
import { FaLock, FaRupeeSign } from 'react-icons/fa';
import { adminAPI } from '../../services/api';
import OrderStatusBadge from '../../components/common/OrderStatusBadge';
import StatCard from '../../components/common/StatCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function EscrowDashboard() {
  const [orders, setOrders] = useState([]);
  const [totalEscrowed, setTotalEscrowed] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getEscrow().then(res => {
      setOrders(res.data.data);
      setTotalEscrowed(res.data.totalEscrowed);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner text="Loading escrow data..." />;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="section-title mb-6">Escrow Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard icon={FaLock} label="Orders in Escrow" value={orders.length} color="orange" />
        <StatCard icon={FaRupeeSign} label="Total Escrowed" value={`₹${totalEscrowed}`} color="blue" />
        <div className="card bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800">
          <h3 className="font-bold text-blue-800 dark:text-blue-300 mb-2">How Escrow Works</h3>
          <ol className="text-xs text-blue-600 dark:text-blue-400 space-y-1 list-decimal list-inside">
            <li>Consumer pays — funds held in escrow</li>
            <li>Delivery partner delivers the order</li>
            <li>Consumer confirms & releases payment</li>
            <li>Farmer receives payment minus platform fee</li>
          </ol>
        </div>
      </div>

      <div className="card">
        <h2 className="font-bold text-gray-900 dark:text-white mb-4">Orders with Escrow Hold</h2>
        {orders.length === 0 ? (
          <div className="text-center py-12 text-gray-400"><FaLock className="text-4xl mx-auto mb-3 opacity-30" /><p>No orders in escrow</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
                <th className="text-left pb-3">Order</th>
                <th className="text-left pb-3">Customer</th>
                <th className="text-left pb-3">Farmer</th>
                <th className="text-right pb-3">Total</th>
                <th className="text-right pb-3">Farmer Amount</th>
                <th className="text-right pb-3">Delivery Status</th>
                <th className="text-left pb-3">Date</th>
              </tr></thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                {orders.map(o => (
                  <tr key={o._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="py-3 font-medium text-gray-900 dark:text-white">#{o._id.slice(-6).toUpperCase()}</td>
                    <td className="py-3 text-gray-600 dark:text-gray-400">{o.customer?.name}</td>
                    <td className="py-3 text-gray-600 dark:text-gray-400">{o.farmer?.name}</td>
                    <td className="py-3 text-right font-bold text-gray-900 dark:text-white">₹{o.totalAmount}</td>
                    <td className="py-3 text-right font-bold text-green-600">₹{o.farmerAmount}</td>
                    <td className="py-3 text-right"><OrderStatusBadge status={o.deliveryStatus} /></td>
                    <td className="py-3 text-gray-500 text-xs">{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
