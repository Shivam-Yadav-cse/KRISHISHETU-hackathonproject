import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FaLock, FaCreditCard, FaLeaf } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { paymentAPI, orderAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { cart, cartTotal } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { address: user?.address || '', city: user?.city || '', state: user?.state || '', pincode: user?.pincode || '' }
  });

  const items = cart?.items || [];
  const deliveryFee = 30;
  const total = cartTotal + deliveryFee;

  const handleStripeCheckout = async (data) => {
    setLoading(true);
    try {
      const res = await paymentAPI.createSession({ deliveryAddress: data });
      if (res.data.data.url) {
        window.location.href = res.data.data.url;
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to initiate payment');
    } finally {
      setLoading(false);
    }
  };

  const handleCOD = async (data) => {
    setLoading(true);
    try {
      const res = await orderAPI.create({ deliveryAddress: data, paymentMethod: 'cod' });
      toast.success('Order placed successfully!');
      navigate(`/track/${res.data.data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="section-title mb-6">{t('checkout.title')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="card">
            <h2 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-7 h-7 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
              {t('checkout.address')}
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Street Address *</label>
                <input {...register('address', { required: 'Address is required' })} className="input-field" placeholder="House/Street/Area" />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">City *</label>
                  <input {...register('city', { required: 'City is required' })} className="input-field" />
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Pincode *</label>
                  <input {...register('pincode', { required: 'Pincode is required' })} className="input-field" />
                  {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode.message}</p>}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">State</label>
                <input {...register('state')} className="input-field" />
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-7 h-7 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
              {t('checkout.payment')}
            </h2>
            <div className="p-4 mb-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <FaLock className="text-blue-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-blue-800 dark:text-blue-300 text-sm">{t('checkout.escrow')}</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">{t('payment.escrowNote')}</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <button onClick={handleSubmit(handleStripeCheckout)} disabled={loading}
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl flex items-center justify-center gap-3 transition-all disabled:opacity-60">
                <FaCreditCard /> {loading ? 'Processing...' : t('checkout.payNow')} (Stripe — Test Mode)
              </button>
              <button onClick={handleSubmit(handleCOD)} disabled={loading}
                className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl flex items-center justify-center gap-3 transition-all disabled:opacity-60">
                💵 {loading ? 'Processing...' : 'Cash on Delivery'}
              </button>
            </div>
          </div>
        </div>

        <div>
          <div className="card sticky top-20">
            <h2 className="font-bold text-gray-900 dark:text-white mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4">
              {items.map(item => (
                <div key={item._id} className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center text-lg">🌿</div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white text-sm">{item.name}</p>
                    <p className="text-xs text-gray-500">₹{item.price} × {item.quantity}</p>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 dark:border-gray-700 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600 dark:text-gray-400"><span>Subtotal</span><span>₹{cartTotal}</span></div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400"><span>Delivery Fee</span><span>₹{deliveryFee}</span></div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400"><span>Platform Fee</span><span className="text-green-600">FREE</span></div>
              <div className="flex justify-between font-bold text-gray-900 dark:text-white text-lg border-t border-gray-100 dark:border-gray-700 pt-2">
                <span>Total</span><span className="text-green-600">₹{total}</span>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-green-600 bg-green-50 dark:bg-green-900/20 p-3 rounded-xl">
              <FaLeaf />
              <span>Payment protected by escrow — released only after delivery</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
