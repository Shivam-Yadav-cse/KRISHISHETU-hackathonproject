import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaBoxOpen, FaShoppingBag, FaRupeeSign, FaChartBar } from 'react-icons/fa';
import { adminAPI } from '../../services/api';
import StatCard from '../../components/common/StatCard';
import OrderStatusBadge from '../../components/common/OrderStatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#16a34a', '#2563eb', '#ea580c', '#9333ea'];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getStats().then(res => { setStats(res.data.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner text="Loading admin dashboard..." />;
  if (!stats) return <div className="text-center py-20 text-gray-500">Failed to load stats</div>;

  const userPieData = [
    { name: 'Farmers', value: stats.users.farmers },
    { name: 'Consumers', value: stats.users.consumers },
    { name: 'Delivery', value: stats.users.delivery },
    { name: 'Others', value: Math.max(0, stats.users.total - stats.users.farmers - stats.users.consumers - stats.users.delivery) }
  ].filter(d => d.value > 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">⚙️ Admin Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">KrishiSetu Platform Overview</p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/users" className="btn-secondary text-sm py-2">Manage Users</Link>
          <Link to="/admin/orders" className="btn-primary text-sm py-2">Manage Orders</Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={FaUsers} label="Total Users" value={stats.users.total} color="blue" subtext={`${stats.users.farmers} farmers, ${stats.users.consumers} consumers`} />
        <StatCard icon={FaBoxOpen} label="Products Listed" value={stats.products.total} color="green" />
        <StatCard icon={FaShoppingBag} label="Total Orders" value={stats.orders.total} color="orange" subtext={`${stats.orders.pending} pending`} />
        <StatCard icon={FaRupeeSign} label="Platform Revenue" value={`₹${stats.revenue.platform?.toFixed(0) || 0}`} color="purple" subtext={`Total GMV: ₹${stats.revenue.total?.toFixed(0) || 0}`} />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card text-center"><p className="text-3xl font-bold text-orange-600">{stats.orders.escrow}</p><p className="text-sm text-gray-500 mt-1">Escrow Holds</p></div>
        <div className="card text-center"><p className="text-3xl font-bold text-green-600">{stats.orders.delivered}</p><p className="text-sm text-gray-500 mt-1">Delivered</p></div>
        <div className="card text-center"><p className="text-3xl font-bold text-blue-600">{stats.users.farmers}</p><p className="text-sm text-gray-500 mt-1">Active Farmers</p></div>
        <div className="card text-center"><p className="text-3xl font-bold text-purple-600">{stats.users.delivery}</p><p className="text-sm text-gray-500 mt-1">Delivery Partners</p></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="card">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4">Monthly Revenue</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stats.monthlyOrders || []}>
              <XAxis dataKey="_id.month" tick={{ fontSize: 11 }} tickFormatter={(v) => ['', 'Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][v] || v} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => [`₹${v}`, 'Revenue']} />
              <Bar dataKey="revenue" fill="#16a34a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4">User Distribution</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={userPieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                {userPieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900 dark:text-white">Recent Orders</h2>
          <Link to="/admin/orders" className="text-green-600 text-sm font-medium hover:underline">View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
              <th className="text-left pb-3">Order ID</th>
              <th className="text-left pb-3">Customer</th>
              <th className="text-left pb-3">Farmer</th>
              <th className="text-right pb-3">Amount</th>
              <th className="text-right pb-3">Status</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
              {(stats.recentOrders || []).map(o => (
                <tr key={o._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="py-3 font-medium text-gray-900 dark:text-white">#{o._id.slice(-6).toUpperCase()}</td>
                  <td className="py-3 text-gray-600 dark:text-gray-400">{o.customer?.name || 'N/A'}</td>
                  <td className="py-3 text-gray-600 dark:text-gray-400">{o.farmer?.name || 'N/A'}</td>
                  <td className="py-3 text-right font-bold text-green-600">₹{o.totalAmount}</td>
                  <td className="py-3 text-right"><OrderStatusBadge status={o.deliveryStatus} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
