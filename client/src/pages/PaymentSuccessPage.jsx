import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import { paymentAPI, orderAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function PaymentSuccessPage() {
  const [params] = useSearchParams();
  const sessionId = params.get('session_id');
  const { user } = useAuth();
  const { fetchCart } = useCart();
  const [orderCreated, setOrderCreated] = useState(false);
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    const createOrder = async () => {
      if (!sessionId || orderCreated) return;
      try {
        const verifyRes = await paymentAPI.verify(sessionId);
        if (verifyRes.data.data.paid) {
          const orderRes = await orderAPI.create({
            deliveryAddress: { address: user?.address || '', city: user?.city || '', state: user?.state || '', pincode: user?.pincode || '' },
            paymentMethod: 'stripe',
            stripeSessionId: sessionId
          });
          setOrderId(orderRes.data.data._id);
          setOrderCreated(true);
          await fetchCart();
          toast.success('Order placed successfully!');
        }
      } catch (err) {
        console.error('Order creation error:', err);
      }
    };
    createOrder();
  }, [sessionId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
      <div className="card max-w-md w-full text-center">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaCheckCircle className="text-5xl text-green-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Payment Successful!</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-2">Your payment is held in <strong className="text-green-600">Escrow</strong></p>
        <p className="text-sm text-gray-400 mb-6">It will be released to the farmer once you confirm delivery.</p>
        {sessionId && <p className="text-xs text-gray-300 bg-gray-50 dark:bg-gray-700 p-2 rounded-lg mb-6 font-mono">Session: {sessionId.slice(0, 20)}...</p>}
        <div className="flex gap-3 justify-center">
          {orderId && <Link to={`/track/${orderId}`} className="btn-primary">Track Order</Link>}
          <Link to="/my-orders" className="btn-secondary">My Orders</Link>
        </div>
        <Link to="/marketplace" className="block text-green-600 hover:underline text-sm mt-4">Continue Shopping</Link>
      </div>
    </div>
  );
}
