import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FaLeaf, FaEye, FaEyeSlash, FaShieldAlt, FaBolt, FaTruck } from 'react-icons/fa';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await authAPI.login(data);
      const { token, ...userData } = res.data.data;
      login(userData, token);
      toast.success(`Welcome back, ${userData.name.split(' ')[0]}!`);
      if (userData.role === 'farmer') navigate('/farmer/dashboard');
      else if (userData.role === 'delivery') navigate('/delivery/dashboard');
      else if (userData.role === 'admin') navigate('/admin/dashboard');
      else navigate('/marketplace');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-hero-pattern flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-green-300 blur-3xl" />
        </div>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="relative z-10 text-white text-center">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/30">
            <FaLeaf className="text-4xl text-white" />
          </div>
          <h1 className="text-4xl font-black mb-3">KrishiSetu</h1>
          <p className="text-green-100 text-lg mb-10 leading-relaxed">Direct Farm to Home<br />Empowering India's Farmers</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {[
              { icon: '🌾', text: 'Fair Prices for Farmers' },
              { icon: '🔒', text: 'Secure Escrow Payment' },
              { icon: '📍', text: 'Hyperlocal Delivery' },
              { icon: '⚡', text: 'Real-time Tracking' },
              { icon: '🌿', text: 'Verified Organic' },
              { icon: '🏦', text: '30+ States Covered' },
            ].map(f => (
              <div key={f.text} className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center border border-white/10">
                <div className="text-xl mb-1">{f.icon}</div>
                <span className="text-xs">{f.text}</span>
              </div>
            ))}
          </div>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mt-8">
            {[['1,247+', 'Farmers'], ['18,500+', 'Consumers'], ['₹42L+', 'Saved']].map(([val, lbl]) => (
              <div key={lbl} className="text-center">
                <p className="text-2xl font-black text-green-300">{val}</p>
                <p className="text-xs text-green-200">{lbl}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-900">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 lg:hidden shadow-lg">
              <FaLeaf className="text-white text-xl" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white">Welcome Back</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Sign in to your KrishiSetu account</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1.5">Email Address</label>
                <input
                  {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })}
                  className="input-field" placeholder="your@email.com" type="email" autoComplete="email"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1.5">Password</label>
                <div className="relative">
                  <input
                    {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
                    className="input-field pr-10" placeholder="••••••••" type={showPass ? 'text' : 'password'} autoComplete="current-password"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors">
                    {showPass ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
              </div>

              <button type="submit" disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 disabled:opacity-60">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                    Signing in...
                  </span>
                ) : 'Sign In →'}
              </button>
            </form>
          </div>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-6 mt-5 text-xs text-gray-400">
            <span className="flex items-center gap-1"><FaShieldAlt className="text-green-500" /> Secure Login</span>
            <span className="flex items-center gap-1"><FaBolt className="text-yellow-500" /> Instant Access</span>
            <span className="flex items-center gap-1"><FaTruck className="text-blue-500" /> Fast Delivery</span>
          </div>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
            New to KrishiSetu?{' '}
            <Link to="/register" className="text-green-600 font-bold hover:underline">Create Account</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
