import React, { useState, useEffect } from 'react';
import { FaTrash, FaSearch } from 'react-icons/fa';
import { productAPI, adminAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await productAPI.getAll({ search, category, limit: 50 });
      setProducts(res.data.data);
    } catch { toast.error('Failed to fetch products'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, [category]);

  const deleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await adminAPI.deleteProduct(id);
      toast.success('Product deleted');
      fetchProducts();
    } catch { toast.error('Failed to delete'); }
  };

  if (loading) return <LoadingSpinner text="Loading products..." />;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="section-title mb-6">Product Management</h1>

      <div className="card mb-6 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && fetchProducts()} className="input-field pl-10" placeholder="Search products..." />
        </div>
        <select value={category} onChange={e => setCategory(e.target.value)} className="input-field w-44">
          <option value="">All Categories</option>
          {['Vegetables','Fruits','Grains','Dairy','Organic'].map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button onClick={fetchProducts} className="btn-primary">Search</button>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
            <th className="text-left pb-3">Product</th>
            <th className="text-left pb-3">Farmer</th>
            <th className="text-left pb-3">Category</th>
            <th className="text-right pb-3">Price</th>
            <th className="text-right pb-3">Stock</th>
            <th className="text-right pb-3">Rating</th>
            <th className="text-right pb-3">Action</th>
          </tr></thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
            {products.map(p => (
              <tr key={p._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <img src={p.image ? `${API_URL}${p.image}` : `https://via.placeholder.com/32x32/16a34a/fff?text=${p.name[0]}`}
                      className="w-8 h-8 rounded-lg object-cover" onError={e => { e.target.src = `https://via.placeholder.com/32x32/16a34a/fff?text=${p.name[0]}`; }} />
                    <span className="font-medium text-gray-900 dark:text-white">{p.name}</span>
                  </div>
                </td>
                <td className="py-3 text-gray-500">{p.farmerName || 'N/A'}</td>
                <td className="py-3"><span className="badge badge-green">{p.category}</span></td>
                <td className="py-3 text-right font-bold text-green-600">₹{p.price}</td>
                <td className="py-3 text-right text-gray-700 dark:text-gray-300">{p.quantity} {p.unit}</td>
                <td className="py-3 text-right">⭐ {p.rating}</td>
                <td className="py-3 text-right">
                  <button onClick={() => deleteProduct(p._id)} className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && <p className="text-center text-gray-400 py-8">No products found</p>}
      </div>
    </div>
  );
}
