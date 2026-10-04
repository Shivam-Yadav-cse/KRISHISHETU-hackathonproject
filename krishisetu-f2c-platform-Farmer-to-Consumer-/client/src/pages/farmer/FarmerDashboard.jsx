import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBoxOpen, FaShoppingBag, FaRupeeSign, FaPlus, FaStar, FaChartLine } from 'react-icons/fa';
import { productAPI, orderAPI, paymentAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/common/StatCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import OrderStatusBadge from '../../components/common/OrderStatusBadge';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function FarmerDashboard() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [priceRec, setPriceRec] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      productAPI.getMyProducts(),
      orderAPI.getFarmerOrders(),
      productAPI.getPriceRecommendation({ cropName: 'Tomato', state: user?.state || 'Maharashtra' })
    ]).then(([pRes, oRes, prRes]) => {
      setProducts(pRes.data.data);
      setOrders(oRes.data.data);
      setPriceRec(prRes.data.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner text="Loading dashboard..." />;

  const totalRevenue = orders.filter(o => o.farmerPaymentReleased).reduce((acc, o) => acc + o.farmerAmount, 0);
  const pendingOrders = orders.filter(o => o.deliveryStatus !== 'Delivered').length;
  const avgRating = products.reduce((acc, p) => acc + p.rating, 0) / (products.length || 1);

  const chartData = products.slice(0, 6).map(p => ({ name: p.name.slice(0, 8), sold: p.totalSold || 0, price: p.price }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">🌾 Farmer Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back, {user?.name?.split(' ')[0]}!</p>
        </div>
        <Link to="/add-product" className="btn-primary flex items-center gap-2"><FaPlus />Add Product</Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={FaBoxOpen} label="My Products" value={products.length} color="green" />
        <StatCard icon={FaShoppingBag} label="Total Orders" value={orders.length} color="blue" />
        <StatCard icon={FaRupeeSign} label="Earnings Released" value={`₹${totalRevenue}`} color="orange" />
        <StatCard icon={FaStar} label="Avg Rating" value={avgRating.toFixed(1)} color="purple" subtext="across all products" />
      </div>

      {priceRec && (
        <div className="card mb-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-100 dark:border-green-800">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-green-600 rounded-2xl flex items-center justify-center">
              <FaChartLine className="text-white text-xl" />
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-gray-900 dark:text-white mb-1">Smart Pricing Insight — Tomato</h2>
              <p className="text-sm text-green-700 dark:text-green-300 mb-3">{priceRec.recommendation}</p>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center"><p className="text-xs text-gray-500">Mandi Price</p><p className="text-xl font-bold text-gray-700 dark:text-gray-300">₹{priceRec.mandiPrice}</p></div>
                <div className="text-center"><p className="text-xs text-gray-500">Suggested Price</p><p className="text-xl font-bold text-green-600">₹{priceRec.suggestedPrice}</p></div>
                <div className="text-center"><p className="text-xs text-gray-500">Est. Profit</p><p className="text-xl font-bold text-orange-600">₹{priceRec.profit}</p></div>
              </div>
              <div className="flex gap-2 mt-3">
                <span className={`badge ${priceRec.demandLevel === 'High' ? 'badge-green' : 'badge-orange'}`}>Demand: {priceRec.demandLevel}</span>
                <span className="badge badge-blue">Trend: {priceRec.trend}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="card">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4">Product Sales Overview</h2>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="sold" fill="#16a34a" radius={[4, 4, 0, 0]} name="Units Sold" />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-gray-400 text-sm text-center py-8">No sales data yet</p>}
        </div>

        <div className="card">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4">Recent Orders</h2>
          <div className="space-y-3 max-h-52 overflow-y-auto">
            {orders.slice(0, 5).map(order => (
              <div key={order._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div>
                  <p className="font-medium text-sm text-gray-900 dark:text-white">#{order._id.slice(-6).toUpperCase()}</p>
                  <p className="text-xs text-gray-500">{order.customer?.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600 text-sm">₹{order.totalAmount}</p>
                  <OrderStatusBadge status={order.deliveryStatus} />
                </div>
              </div>
            ))}
            {orders.length === 0 && <p className="text-gray-400 text-sm text-center py-4">No orders yet</p>}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900 dark:text-white">My Products</h2>
          <Link to="/add-product" className="text-green-600 text-sm font-medium hover:underline">+ Add New</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
              <th className="text-left pb-3">Product</th>
              <th className="text-right pb-3">Price</th>
              <th className="text-right pb-3">Stock</th>
              <th className="text-right pb-3">Sold</th>
              <th className="text-right pb-3">Rating</th>
              <th className="text-right pb-3">Trend</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
              {products.map(p => (
                <tr key={p._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="py-3"><div><p className="font-medium text-gray-900 dark:text-white">{p.name}</p><p className="text-xs text-gray-400">{p.category}</p></div></td>
                  <td className="py-3 text-right font-bold text-green-600">₹{p.price}</td>
                  <td className="py-3 text-right text-gray-700 dark:text-gray-300">{p.quantity} {p.unit || 'kg'}</td>
                  <td className="py-3 text-right text-gray-700 dark:text-gray-300">{p.totalSold || 0}</td>
                  <td className="py-3 text-right"><span className="flex items-center justify-end gap-1"><span>⭐</span>{p.rating || 0}</span></td>
                  <td className="py-3 text-right"><span className={`badge ${p.marketTrend === 'Rising' ? 'badge-green' : p.marketTrend === 'Falling' ? 'badge-red' : 'badge-orange'}`}>{p.marketTrend}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && <p className="text-center text-gray-400 py-8">No products yet. <Link to="/add-product" className="text-green-600 hover:underline">Add your first product</Link></p>}
        </div>
      </div>
    </div>
  );
}
