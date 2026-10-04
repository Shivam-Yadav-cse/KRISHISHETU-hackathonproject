import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FaLeaf, FaEye, FaEyeSlash, FaTractor, FaShoppingBag, FaMotorcycle } from 'react-icons/fa';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const STATES = ['Andhra Pradesh','Assam','Bihar','Chhattisgarh','Delhi','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal'];

const ROLES = [
  { value: 'farmer', label: 'Farmer', icon: FaTractor, desc: 'List & sell your produce', color: 'green' },
  { value: 'consumer', label: 'Consumer', icon: FaShoppingBag, desc: 'Buy fresh farm products', color: 'blue' },
  { value: 'delivery', label: 'Delivery Partner', icon: FaMotorcycle, desc: 'Earn by delivering orders', color: 'orange' },
];

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('consumer');
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({ defaultValues: { role: 'consumer' } });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await authAPI.register({ ...data, role: selectedRole });
      const { token, ...userData } = res.data.data;
      login(userData, token);
      toast.success(`Welcome to KrishiSetu, ${userData.name.split(' ')[0]}!`);
      if (userData.role === 'farmer') navigate('/farmer/dashboard');
      else if (userData.role === 'delivery') navigate('/delivery/dashboard');
      else navigate('/marketplace');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      {/* Left panel — hidden on mobile */}
      <div className="hidden lg:flex lg:w-2/5 bg-hero-pattern flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-green-300 blur-3xl" />
        </div>
        <div className="relative z-10 text-white text-center">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/30">
              <FaLeaf className="text-4xl text-white" />
            </div>
            <h1 className="text-4xl font-black mb-3">KrishiSetu</h1>
            <p className="text-green-100 text-lg mb-8 leading-relaxed">India's Premier<br />Farm-to-Consumer Platform</p>
            <div className="space-y-3 text-left">
              {['🌾 Fair Prices for Farmers', '🔒 Secure Escrow Payment', '📍 Hyperlocal Delivery', '⚡ Real-time GPS Tracking', '🌿 Verified Organic Produce', '🏦 Rural Employment'].map(f => (
                <div key={f} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2.5 text-sm border border-white/10">
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-lg">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 lg:hidden shadow-lg">
              <FaLeaf className="text-white text-xl" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white">Create Account</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Join India's fastest growing agri-marketplace</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

              {/* Role Selector */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">I want to join as *</label>
                <div className="grid grid-cols-3 gap-3">
                  {ROLES.map(({ value, label, icon: Icon, desc, color }) => (
                    <button key={value} type="button" onClick={() => setSelectedRole(value)}
                      className={`relative flex flex-col items-center gap-1.5 border-2 rounded-xl p-3 text-center cursor-pointer transition-all duration-200 ${
                        selectedRole === value
                          ? `border-${color === 'green' ? 'green' : color === 'blue' ? 'blue' : 'orange'}-500 bg-${color === 'green' ? 'green' : color === 'blue' ? 'blue' : 'orange'}-50 dark:bg-${color === 'green' ? 'green' : color === 'blue' ? 'blue' : 'orange'}-900/20`
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <Icon className={`text-xl ${selectedRole === value ? (color === 'green' ? 'text-green-600' : color === 'blue' ? 'text-blue-600' : 'text-orange-500') : 'text-gray-400'}`} />
                      <span className={`text-xs font-bold ${selectedRole === value ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>{label}</span>
                      <span className="text-[10px] text-gray-400 leading-tight hidden sm:block">{desc}</span>
                      {selectedRole === value && (
                        <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-[8px] font-black">✓</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1.5">Full Name *</label>
                  <input {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'At least 2 characters' } })}
                    className="input-field" placeholder="Ramesh Kumar" />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1.5">Email Address *</label>
                  <input {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })}
                    className="input-field" placeholder="your@email.com" type="email" />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1.5">Phone Number</label>
                  <input {...register('phone', { pattern: { value: /^[6-9]\d{9}$/, message: 'Enter valid 10-digit number' } })}
                    className="input-field" placeholder="9876543210" type="tel" />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1.5">Password *</label>
                  <div className="relative">
                    <input {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
                      className="input-field pr-10" placeholder="Min 6 characters" type={showPass ? 'text' : 'password'} />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                      {showPass ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1.5">Address / Village</label>
                  <input {...register('address')} className="input-field" placeholder="Village/Street/Area" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1.5">Pincode</label>
                  <input {...register('pincode')} className="input-field" placeholder="400001" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1.5">City</label>
                  <input {...register('city')} className="input-field" placeholder="Mumbai" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1.5">State</label>
                  <select {...register('state')} className="input-field">
                    <option value="">Select State</option>
                    {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 disabled:opacity-60 mt-2 text-base">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                    Creating Account...
                  </span>
                ) : 'Create Account →'}
              </button>
            </form>
          </div>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-green-600 font-bold hover:underline">Sign In</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
