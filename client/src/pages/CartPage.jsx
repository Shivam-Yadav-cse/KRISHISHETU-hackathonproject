import React from 'react';
import { Link } from 'react-router-dom';
import { FaTrash, FaShoppingCart, FaArrowRight, FaLeaf } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useTranslation } from 'react-i18next';
import LoadingSpinner from '../components/common/LoadingSpinner';

const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

export default function CartPage() {
  const { t } = useTranslation();
  const { cart, cartTotal, cartLoading, removeFromCart, updateQuantity } = useCart();

  if (cartLoading) return <LoadingSpinner text="Loading cart..." />;

  const items = cart?.items || [];
  const deliveryFee = 30;
  const total = cartTotal + deliveryFee;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="section-title mb-6">{t('cart.title')}</h1>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <FaShoppingCart className="text-6xl text-gray-200 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">{t('cart.empty')}</h3>
          <p className="text-gray-400 mb-6">Browse fresh produce from local farmers</p>
          <Link to="/marketplace" className="btn-primary">Shop Now</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => {
              const imageUrl = item.image
                ? (item.image.startsWith('http') ? item.image : `${API_URL}${item.image}`)
                : `https://via.placeholder.com/100x100/16a34a/fff?text=${encodeURIComponent(item.name)}`;
              return (
                <div key={item.product?._id || item._id} className="card flex items-center gap-4">
                  <img src={imageUrl} alt={item.name} className="w-20 h-20 rounded-xl object-cover" onError={e => { e.target.src = `https://via.placeholder.com/100x100/16a34a/fff?text=${encodeURIComponent(item.name)}`; }} />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{item.name}</h3>
                    <p className="text-green-600 font-bold text-lg">₹{item.price}/kg</p>
                    <p className="text-xs text-gray-400">Subtotal: ₹{item.price * item.quantity}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(item.product?._id || item.product, item.quantity - 1)}
                      className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 font-bold">-</button>
                    <span className="w-10 text-center font-semibold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product?._id || item.product, item.quantity + 1)}
                      className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 font-bold">+</button>
                  </div>
                  <button onClick={() => removeFromCart(item.product?._id || item.product)} className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors">
                    <FaTrash />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="space-y-4">
            <div className="card">
              <h2 className="font-bold text-gray-900 dark:text-white mb-4">Order Summary</h2>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex justify-between"><span>Subtotal ({items.length} items)</span><span className="font-semibold text-gray-900 dark:text-white">₹{cartTotal}</span></div>
                <div className="flex justify-between"><span>Delivery Fee</span><span className="font-semibold text-gray-900 dark:text-white">₹{deliveryFee}</span></div>
                <div className="flex justify-between"><span>Platform Fee</span><span className="text-green-600 font-medium">FREE</span></div>
                <div className="border-t border-gray-100 dark:border-gray-700 pt-2 flex justify-between text-base font-bold text-gray-900 dark:text-white">
                  <span>{t('cart.total')}</span><span className="text-green-600 text-xl">₹{total}</span>
                </div>
              </div>
              <Link to="/checkout" className="btn-primary mt-4 w-full flex items-center justify-center gap-2">
                {t('cart.checkout')} <FaArrowRight />
              </Link>
            </div>

            <div className="card bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800">
              <div className="flex items-start gap-3">
                <FaLeaf className="text-green-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-green-800 dark:text-green-300 text-sm">Escrow Payment Protection</p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">Your payment is held securely and released to the farmer only after you confirm delivery.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
