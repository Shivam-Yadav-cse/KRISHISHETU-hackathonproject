import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaMapMarkerAlt, FaShoppingCart, FaHeart, FaArrowUp, FaArrowDown, FaMinus, FaBolt, FaLeaf } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { wishlistAPI } from '../../services/api';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const DELIVERY_ETAS = ['20 mins', '25 mins', '30 mins', '35 mins', '45 mins', '1 hr'];

function getETA(productId) {
  const code = productId ? productId.slice(-2) : '00';
  const idx = parseInt(code, 16) % DELIVERY_ETAS.length;
  return DELIVERY_ETAS[idx];
}

export default function ProductCard({ product }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [wishlisted, setWishlisted] = useState(false);
  const [adding, setAdding] = useState(false);

  const imageUrl = product.image
    ? (product.image.startsWith('http') ? product.image : `${API_URL}${product.image}`)
    : `https://via.placeholder.com/400x300/16a34a/ffffff?text=${encodeURIComponent(product.name)}`;

  const savings = product.mandiPrice && product.mandiPrice > product.price
    ? product.mandiPrice - product.price
    : 0;

  const savingPct = savings > 0 ? Math.round((savings / product.mandiPrice) * 100) : 0;

  const eta = getETA(product._id);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to add to cart'); return; }
    if (user.role !== 'consumer') { toast.error('Only consumers can add to cart'); return; }
    setAdding(true);
    await addToCart(product._id);
    setAdding(false);
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to wishlist'); return; }
    try {
      await wishlistAPI.toggle(product._id);
      setWishlisted(w => !w);
      toast.success(wishlisted ? 'Removed from wishlist' : 'Added to wishlist');
    } catch { toast.error('Failed to update wishlist'); }
  };

  const TrendIcon = product.marketTrend === 'Rising' ? FaArrowUp : product.marketTrend === 'Falling' ? FaArrowDown : FaMinus;
  const trendColor = product.marketTrend === 'Rising' ? 'text-green-400' : product.marketTrend === 'Falling' ? 'text-red-400' : 'text-gray-400';
  const trendBg = product.marketTrend === 'Rising' ? 'bg-green-900/70' : product.marketTrend === 'Falling' ? 'bg-red-900/70' : 'bg-gray-800/70';
  const demandColor = product.demandLevel === 'High' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : product.demandLevel === 'Low' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400' : 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400';
  const isOrganic = product.category === 'Organic' || (product.name || '').toLowerCase().includes('organic');

  return (
    <Link to={`/product/${product._id}`} className="block group">
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:-translate-y-1.5 flex flex-col h-full">

        {/* Savings badge — top left */}
        {savingPct > 0 && (
          <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
            {savingPct}% OFF
          </div>
        )}

        {/* Organic badge */}
        {isOrganic && (
          <div className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md" style={savingPct > 0 ? { top: '2.5rem' } : {}}>
            <FaLeaf className="text-[10px]" /> Organic
          </div>
        )}

        {/* Wishlist */}
        <button onClick={handleWishlist} className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm ${wishlisted ? 'bg-red-500 text-white' : 'bg-white/90 dark:bg-gray-700/90 text-gray-500 hover:bg-red-50 hover:text-red-500'}`}>
          <FaHeart className="text-xs" />
        </button>

        {/* Image */}
        <div className="relative overflow-hidden h-44 bg-gray-100 dark:bg-gray-700">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
            style={{ '--tw-scale-x': 'group-hover:1.08', '--tw-scale-y': 'group-hover:1.08' }}
            onError={e => { e.target.src = `https://via.placeholder.com/400x300/16a34a/ffffff?text=${encodeURIComponent(product.name)}`; }}
//             onError={(e) => {
//  e.target.src =
//   `https://loremflickr.com/600/400/${encodeURIComponent(product.category)}?lock=${product._id}`;
// }}

          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* Bottom badges on image */}
          <div className="absolute bottom-2 left-2 flex gap-1.5 flex-wrap">
            <span className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full text-white ${trendBg}`}>
              <TrendIcon className="text-[8px]" />{product.marketTrend || 'Stable'}
            </span>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${demandColor}`}>
              {product.demandLevel} Demand
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          {/* Name + Category */}
          <div className="flex items-start justify-between mb-1.5">
            <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-tight line-clamp-1 flex-1 mr-2">{product.name}</h3>
            <span className="shrink-0 text-[10px] bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full font-medium">{product.category}</span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-2">
            <FaMapMarkerAlt className="text-green-500 shrink-0" />
            <span className="truncate">{product.city || product.farmerLocation || 'Local Farm'}</span>
          </div>

          {/* Rating + Delivery ETA */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1">
              <FaStar className="text-yellow-400 text-xs" />
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{product.rating || 0}</span>
              <span className="text-xs text-gray-400">({product.totalReviews || 0})</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-medium">
              <FaBolt className="text-[10px]" />
              <span>{eta}</span>
            </div>
          </div>

          {/* Price Comparison */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-100 dark:border-green-800/40 rounded-xl p-2.5 mb-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-center">
                <p className="text-[10px] text-gray-400 font-medium mb-0.5">Market Price</p>
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 line-through">₹{product.mandiPrice || product.price}/{product.unit || 'kg'}</p>
              </div>
              <div className="text-center border-l border-green-200 dark:border-green-700">
                <p className="text-[10px] text-green-600 dark:text-green-400 font-medium mb-0.5">Our Price</p>
                <p className="text-sm font-bold text-green-600 dark:text-green-400">₹{product.price}/{product.unit || 'kg'}</p>
              </div>
            </div>
            {savings > 0 && (
              <div className="mt-1.5 text-center">
                <span className="text-[10px] font-bold text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/50 px-2 py-0.5 rounded-full">
                  💰 Save ₹{savings}/{product.unit || 'kg'}
                </span>
              </div>
            )}
          </div>

          {/* Add to cart */}
          <div className="mt-auto">
            <button
              onClick={handleAddToCart}
              disabled={adding || product.quantity === 0}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold text-sm py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 shadow-sm hover:shadow-md"
            >
              <FaShoppingCart className="text-xs" />
              {product.quantity === 0 ? 'Out of Stock' : adding ? 'Adding...' : t('marketplace.addToCart')}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
