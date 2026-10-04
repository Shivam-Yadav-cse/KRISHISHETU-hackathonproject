import React from 'react';
import { Link } from 'react-router-dom';
import { FaTimesCircle } from 'react-icons/fa';

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
      <div className="card max-w-md w-full text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaTimesCircle className="text-5xl text-red-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Payment Cancelled</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Your payment was cancelled. Your cart items are still saved.</p>
        <div className="flex gap-3 justify-center">
          <Link to="/cart" className="btn-primary">Back to Cart</Link>
          <Link to="/marketplace" className="btn-secondary">Browse Marketplace</Link>
        </div>
      </div>
    </div>
  );
}
