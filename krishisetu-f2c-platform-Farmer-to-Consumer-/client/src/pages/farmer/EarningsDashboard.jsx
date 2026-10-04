import React, { useState, useEffect } from 'react';
import { FaRupeeSign, FaShoppingBag, FaChartLine, FaDownload } from 'react-icons/fa';
import { orderAPI, paymentAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatCard from '../../components/common/StatCard';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export default function EarningsDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [mandiPrices, setMandiPrices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([orderAPI.getFarmerOrders(), paymentAPI.getMandiPrices()]).then(([oRes, mRes]) => {
      setOrders(oRes.data.data);
      setMandiPrices(mRes.data.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner text="Loading earnings..." />;

  const released = orders.filter(o => o.farmerPaymentReleased);
  const pending = orders.filter(o => !o.farmerPaymentReleased);
  const totalReleased = released.reduce((acc, o) => acc + o.farmerAmount, 0);
  const totalPending = pending.reduce((acc, o) => acc + o.farmerAmount, 0);

  const monthlyData = [];
  const monthMap = {};
  orders.forEach(o => {
    const month = new Date(o.createdAt).toLocaleString('en-IN', { month: 'short' });
    if (!monthMap[month]) monthMap[month] = { month, earnings: 0, orders: 0 };
    if (o.farmerPaymentReleased) monthMap[month].earnings += o.farmerAmount;
    monthMap[month].orders++;
  });
  Object.values(monthMap).forEach(m => monthlyData.push(m));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="section-title mb-6">Earnings Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={FaRupeeSign} label="Total Earned" value={`₹${totalReleased}`} color="green" />
        <StatCard icon={FaRupeeSign} label="Pending Payment" value={`₹${totalPending}`} color="orange" />
        <StatCard icon={FaShoppingBag} label="Total Orders" value={orders.length} color="blue" />
        <StatCard icon={FaChartLine} label="Completed" value={released.length} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="card">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4">Monthly Earnings</h2>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={monthlyData}>
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => [`₹${v}`, 'Earnings']} />
              <Area type="monotone" dataKey="earnings" stroke="#16a34a" fill="#dcfce7" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4">Live Mandi Prices</h2>
          <div className="space-y-2 max-h-52 overflow-y-auto">
            {mandiPrices.map(m => (
              <div key={m.crop} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl">
                <div>
                  <p className="font-medium text-sm text-gray-900 dark:text-white">{m.crop}</p>
                  <p className="text-xs text-gray-400">{m.category} · {m.demandLevel} Demand</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-700 dark:text-gray-300 text-sm">₹{m.mandiPrice}/{m.unit}</p>
                  <p className="text-xs text-green-600">Suggested: ₹{m.suggestedPrice}</p>
                  <span className={`text-xs font-medium ${m.trend === 'Rising' ? 'text-green-500' : m.trend === 'Falling' ? 'text-red-500' : 'text-gray-400'}`}>{m.trend === 'Rising' ? '↑' : m.trend === 'Falling' ? '↓' : '→'} {m.trend}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="font-bold text-gray-900 dark:text-white mb-4">Payment History</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
              <th className="text-left pb-3">Order</th>
              <th className="text-left pb-3">Date</th>
              <th className="text-right pb-3">Amount</th>
              <th className="text-right pb-3">Your Earning</th>
              <th className="text-right pb-3">Status</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
              {orders.map(o => (
                <tr key={o._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="py-3 font-medium text-gray-900 dark:text-white">#{o._id.slice(-6).toUpperCase()}</td>
                  <td className="py-3 text-gray-500">{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                  <td className="py-3 text-right text-gray-700 dark:text-gray-300">₹{o.totalAmount}</td>
                  <td className="py-3 text-right font-bold text-green-600">₹{o.farmerAmount}</td>
                  <td className="py-3 text-right"><span className={`badge ${o.farmerPaymentReleased ? 'badge-green' : 'badge-orange'}`}>{o.farmerPaymentReleased ? 'Released' : 'Pending'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && <p className="text-center text-gray-400 py-8">No payment history yet</p>}
        </div>
      </div>
    </div>
  );
}
