import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaStar, FaMapMarkerAlt, FaShoppingCart, FaArrowLeft, FaLeaf, FaUser } from 'react-icons/fa';
import { productAPI, reviewAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';
import LoadingSpinner from '../components/common/LoadingSpinner';
import OrderStatusBadge from '../components/common/OrderStatusBadge';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [qty, setQty] = useState(1);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pRes, rRes] = await Promise.all([productAPI.getById(id), reviewAPI.getByProduct(id)]);
        setProduct(pRes.data.data);
        setReviews(rRes.data.data);
      } catch (err) {
        toast.error('Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) { toast.error('Please login'); return; }
    if (user.role !== 'consumer') { toast.error('Only consumers can add to cart'); return; }
    setAdding(true);
    await addToCart(id, qty);
    setAdding(false);
  };

  const onReviewSubmit = async (data) => {
    if (!user) { toast.error('Please login to review'); return; }
    try {
      await reviewAPI.create({ productId: id, rating: Number(data.rating), comment: data.comment });
      toast.success('Review submitted!');
      reset();
      const rRes = await reviewAPI.getByProduct(id);
      setReviews(rRes.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    }
  };

  if (loading) return <LoadingSpinner text="Loading product..." />;
  if (!product) return <div className="text-center py-20 text-gray-500">Product not found</div>;

  const imageUrl = product.image
    ? (product.image.startsWith('http') ? product.image : `${API_URL}${product.image}`)
    : `https://via.placeholder.com/600x400/16a34a/ffffff?text=${encodeURIComponent(product.name)}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/marketplace" className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium mb-6 text-sm">
        <FaArrowLeft /> Back to Marketplace
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div>
          <img src={imageUrl} alt={product.name} className="w-full rounded-2xl object-cover h-80 lg:h-96" onError={e => { e.target.src = `https://via.placeholder.com/600x400/16a34a/ffffff?text=${encodeURIComponent(product.name)}`; }} />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="badge badge-green">{product.category}</span>
            <span className={`badge ${product.demandLevel === 'High' ? 'badge-green' : product.demandLevel === 'Low' ? 'badge-red' : 'badge-orange'}`}>{product.demandLevel} Demand</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{product.name}</h1>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex">
              {[1,2,3,4,5].map(s => <FaStar key={s} className={s <= (product.rating || 0) ? 'text-yellow-400' : 'text-gray-200'} />)}
            </div>
            <span className="text-sm text-gray-500">({product.totalReviews || 0} reviews)</span>
          </div>

          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mb-4">
            <FaMapMarkerAlt className="text-green-500" />
            <span>{product.farmerLocation || product.city} · {product.farmerName}</span>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-xs text-gray-500">Our Price</p>
                <p className="text-4xl font-bold text-green-600">₹{product.price}<span className="text-lg text-gray-500">/{product.unit || 'kg'}</span></p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Mandi Price</p>
                <p className="text-xl font-semibold text-gray-500 line-through">₹{product.mandiPrice}/{product.unit || 'kg'}</p>
                <p className="text-xs text-green-600 font-medium">You save ₹{Math.max(0, product.mandiPrice - product.price)}/{product.unit || 'kg'}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <span className="badge badge-blue">Market: {product.marketTrend}</span>
              <span className="badge badge-green">Available: {product.quantity} {product.unit || 'kg'}</span>
            </div>
          </div>

          <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm leading-relaxed">{product.description || 'Fresh from the farm, delivered directly to your doorstep.'}</p>

          <div className="flex items-center gap-4 mb-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Quantity ({product.unit || 'kg'})</label>
            <div className="flex items-center gap-2">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 font-bold">-</button>
              <span className="w-12 text-center font-semibold">{qty}</span>
              <button onClick={() => setQty(q => Math.min(product.quantity, q + 1))} className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 font-bold">+</button>
            </div>
            <span className="text-sm text-gray-500">= ₹{(product.price * qty).toFixed(0)}</span>
          </div>

          <div className="flex gap-3">
            <button onClick={handleAddToCart} disabled={adding || product.quantity === 0} className="flex-1 btn-primary flex items-center justify-center gap-2 py-3 disabled:opacity-60">
              <FaShoppingCart />{adding ? 'Adding...' : 'Add to Cart'}
            </button>
            <Link to="/cart" className="btn-secondary py-3 px-6">Buy Now</Link>
          </div>

          <div className="mt-4 flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-sm text-blue-700 dark:text-blue-400">
            <FaLeaf />
            <span>Payment held in <strong>Escrow</strong> — released to farmer only after delivery</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Farmer Info</h2>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <FaUser className="text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">{product.farmerId?.name || product.farmerName}</p>
              <p className="text-sm text-gray-500">{product.farmerId?.city || product.city}, {product.farmerId?.state || product.state}</p>
            </div>
          </div>
          {product.farmerId?.phone && <p className="text-sm text-gray-500">📞 {product.farmerId.phone}</p>}
        </div>

        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Reviews ({reviews.length})</h2>
          <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
            {reviews.length === 0 ? (
              <p className="text-gray-400 text-sm">No reviews yet. Be the first!</p>
            ) : reviews.map(r => (
              <div key={r._id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm text-gray-800 dark:text-white">{r.userName || r.user?.name || 'User'}</span>
                  <div className="flex">{[1,2,3,4,5].map(s => <FaStar key={s} className={`text-xs ${s <= r.rating ? 'text-yellow-400' : 'text-gray-200'}`} />)}</div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{r.comment}</p>
              </div>
            ))}
          </div>
          {user && (
            <form onSubmit={handleSubmit(onReviewSubmit)} className="border-t border-gray-100 dark:border-gray-700 pt-4 space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Rating</label>
                <select {...register('rating', { required: true })} className="input-field mt-1">
                  {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Star{n !== 1 ? 's' : ''}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Comment</label>
                <textarea {...register('comment')} className="input-field mt-1" rows={2} placeholder="Share your experience..." />
              </div>
              <button type="submit" className="btn-primary py-2 text-sm">Submit Review</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
