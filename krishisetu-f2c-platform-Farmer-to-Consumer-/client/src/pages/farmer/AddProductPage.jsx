import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FaMicrophone, FaUpload, FaChartLine, FaArrowLeft } from 'react-icons/fa';
import { productAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const CATEGORIES = ['Vegetables', 'Fruits', 'Grains', 'Dairy', 'Organic'];
const CROPS = ['Tomato', 'Potato', 'Onion', 'Wheat', 'Rice', 'Milk', 'Mango', 'Spinach', 'Carrot'];

export default function AddProductPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [listening, setListening] = useState(false);
  const [priceRec, setPriceRec] = useState(null);
  const [loadingRec, setLoadingRec] = useState(false);
  const fileRef = useRef(null);
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: { state: user?.state || '', city: user?.city || '', pincode: user?.pincode || '' }
  });

  const cropName = watch('name');

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('Voice input not supported in this browser');
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    setListening(true);
    recognition.start();
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setValue('name', transcript.trim());
      toast.success(`Heard: "${transcript.trim()}"`);
      setListening(false);
    };
    recognition.onerror = () => { toast.error('Voice input failed'); setListening(false); };
    recognition.onend = () => setListening(false);
  };

  const fetchPriceRec = async () => {
    if (!cropName) { toast.error('Enter crop name first'); return; }
    setLoadingRec(true);
    try {
      const res = await productAPI.getPriceRecommendation({ cropName, state: user?.state });
      setPriceRec(res.data.data);
      setValue('price', res.data.data.suggestedPrice);
    } catch { toast.error('Could not fetch price recommendation'); }
    finally { setLoadingRec(false); }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([k, v]) => { if (v) formData.append(k, v); });
      if (fileRef.current?.files[0]) formData.append('image', fileRef.current.files[0]);
      await productAPI.create(formData);
      toast.success('Product listed successfully!');
      navigate('/farmer/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium mb-6 text-sm">
        <FaArrowLeft />Back to Dashboard
      </button>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Add New Product</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="card">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4">Product Information</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Crop/Product Name *</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input {...register('name', { required: 'Product name is required' })} className="input-field" placeholder="e.g., Tomato, Wheat, Milk" list="crop-suggestions" />
                <datalist id="crop-suggestions">{CROPS.map(c => <option key={c} value={c} />)}</datalist>
              </div>
              <button type="button" onClick={handleVoiceInput} className={`px-4 py-3 rounded-xl flex items-center gap-2 font-medium text-sm transition-all ${listening ? 'bg-red-500 text-white animate-pulse' : 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-100 border border-green-200 dark:border-green-800'}`}>
                <FaMicrophone />{listening ? 'Listening...' : 'Voice'}
              </button>
            </div>
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            <p className="text-xs text-gray-400 mt-1">💡 Click Voice to speak the crop name in English or Hindi</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category *</label>
              <select {...register('category', { required: 'Category is required' })} className="input-field">
                <option value="">Select Category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Unit</label>
              <select {...register('unit')} className="input-field">
                {['kg', 'litre', 'dozen', 'piece', 'quintal'].map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quantity Available *</label>
              <input {...register('quantity', { required: 'Quantity required', min: { value: 1, message: 'Min 1' } })} type="number" className="input-field" placeholder="e.g., 200" />
              {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Selling Price (₹) *</label>
              <input {...register('price', { required: 'Price required', min: { value: 1, message: 'Min ₹1' } })} type="number" className="input-field" placeholder="e.g., 35" />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea {...register('description')} className="input-field" rows={3} placeholder="Describe your product, quality, farming method..." />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900 dark:text-white">Smart Price Recommendation</h2>
            <button type="button" onClick={fetchPriceRec} disabled={loadingRec} className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-xl text-sm font-medium hover:bg-blue-100 transition-all disabled:opacity-60">
              <FaChartLine />{loadingRec ? 'Fetching...' : 'Get Smart Price'}
            </button>
          </div>
          {priceRec ? (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <p className="text-sm text-green-700 dark:text-green-300 font-medium mb-3">{priceRec.recommendation}</p>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div><p className="text-xs text-gray-500">Mandi Price</p><p className="text-lg font-bold text-gray-700 dark:text-gray-300">₹{priceRec.mandiPrice}</p></div>
                <div><p className="text-xs text-gray-500">Suggested</p><p className="text-lg font-bold text-green-600">₹{priceRec.suggestedPrice}</p></div>
                <div><p className="text-xs text-gray-500">Est. Profit</p><p className="text-lg font-bold text-orange-600">₹{priceRec.profit}</p></div>
              </div>
              <div className="flex gap-2 mt-3 justify-center">
                <span className={`badge ${priceRec.demandLevel === 'High' ? 'badge-green' : 'badge-orange'}`}>{priceRec.demandLevel} Demand</span>
                <span className="badge badge-blue">{priceRec.trend}</span>
              </div>
              <p className="text-xs text-gray-400 mt-2 text-center">✓ Price auto-filled above. You can adjust it.</p>
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-4">Enter crop name and click "Get Smart Price" to see market-based price recommendation</p>
          )}
        </div>

        <div className="card">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4">Location & Image</h2>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City</label>
              <input {...register('city')} className="input-field" placeholder="Nashik" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pincode</label>
              <input {...register('pincode')} className="input-field" placeholder="400001" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State</label>
              <input {...register('state')} className="input-field" placeholder="Maharashtra" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Product Image</label>
            <div onClick={() => fileRef.current?.click()} className="border-2 border-dashed border-gray-200 dark:border-gray-600 hover:border-green-400 rounded-xl p-6 text-center cursor-pointer transition-all">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="h-32 object-cover rounded-xl mx-auto" />
              ) : (
                <div>
                  <FaUpload className="text-3xl text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Click to upload product image</p>
                  <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full btn-primary py-3 text-base disabled:opacity-60">
          {loading ? 'Listing Product...' : '🌾 List Product on Marketplace'}
        </button>
      </form>
    </div>
  );
}
