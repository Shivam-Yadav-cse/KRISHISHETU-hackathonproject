import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FaSearch, FaMapMarkerAlt, FaLeaf, FaFire, FaBolt, FaSeedling, FaCheese, FaGlobe } from 'react-icons/fa';
import { productAPI } from '../services/api';
import ProductCard from '../components/common/ProductCard';
import { SkeletonCard } from '../components/common/LoadingSpinner';

const CATEGORIES = [
  { value: '', label: 'All', icon: '🌾' },
  { value: 'Vegetables', label: 'Vegetables', icon: '🥬' },
  { value: 'Fruits', label: 'Fruits', icon: '🍎' },
  { value: 'Grains', label: 'Grains', icon: '🌽' },
  { value: 'Dairy', label: 'Dairy', icon: '🥛' },
  { value: 'Organic', label: 'Organic', icon: '🌿' },
];

const SORTS = [
  { value: '', label: 'Latest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

const SEARCH_PLACEHOLDERS = [
  'Search fresh vegetables...',
  'Find nearby farmers...',
  'Search organic products...',
  'Search by city or pincode...',
  'Find fast delivery items...',
];

export default function MarketplacePage() {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setPlaceholderIdx(i => (i + 1) % SEARCH_PLACEHOLDERS.length), 3000);
    return () => clearInterval(timer);
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { sort, page, limit: 12 };
      if (search.trim()) params.search = search.trim();
      if (category) params.category = category;
      if (city.trim()) params.city = city.trim();
      if (pincode.trim()) params.pincode = pincode.trim();
      const res = await productAPI.getAll(params);
      setProducts(res.data.data || []);
      setTotal(res.data.total || 0);
      setPages(res.data.pages || 1);
    } catch (err) {
      console.error(err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [search, category, sort, city, pincode, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  const handleCategoryChange = (val) => {
    setCategory(val);
    setPage(1);
  };

  const clearAll = () => {
    setSearch('');
    setCategory('');
    setCity('');
    setPincode('');
    setSort('');
    setPage(1);
  };

  const hasFilters = search || category || city || pincode || sort;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-700 to-emerald-700 text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-black mb-1">{t('marketplace.title')}</h1>
            <p className="text-green-100">
              {total > 0 ? `${total} fresh listings from local farmers` : t('marketplace.subtitle')}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Search Bar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 mb-6">
          <form onSubmit={handleSearch} className="flex flex-wrap gap-3 items-end">
            {/* Search input */}
            <div className="flex-1 min-w-52 relative">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all placeholder-gray-400"
                placeholder={SEARCH_PLACEHOLDERS[placeholderIdx]}
              />
            </div>
            {/* City */}
            <div className="relative">
              <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
              <input
                value={city}
                onChange={e => setCity(e.target.value)}
                className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl py-2.5 pl-8 pr-3 text-sm w-36 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                placeholder="City"
              />
            </div>
            {/* Pincode */}
            <input
              value={pincode}
              onChange={e => setPincode(e.target.value)}
              className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl py-2.5 px-3 text-sm w-28 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
              placeholder="Pincode"
            />
            {/* Sort */}
            <select
              value={sort}
              onChange={e => { setSort(e.target.value); setPage(1); }}
              className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
            >
              {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
            <button type="submit" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-2.5 px-5 rounded-xl flex items-center gap-2 text-sm transition-all active:scale-95 shadow-sm">
              <FaSearch />Search
            </button>
            {hasFilters && (
              <button type="button" onClick={clearAll} className="text-sm text-red-500 hover:text-red-700 font-medium px-3 py-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
                ✕ Clear
              </button>
            )}
          </form>
        </motion.div>

        {/* Category pills */}
        <div className="flex gap-2 flex-wrap mb-8">
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              onClick={() => handleCategoryChange(cat.value)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                category === cat.value
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md scale-105'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-green-400 hover:text-green-600 dark:hover:text-green-400'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Products grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
            <div className="text-7xl mb-5">🌾</div>
            <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">{t('marketplace.noProducts')}</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">{t('marketplace.noProductsHint')}</p>
            <button onClick={clearAll} className="bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all active:scale-95">
              {t('marketplace.clearFilters')}
            </button>
          </motion.div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
            >
              {products.map((product, i) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination + count */}
            <div className="flex items-center justify-between mt-10 flex-wrap gap-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('marketplace.showing')} <span className="font-semibold text-gray-700 dark:text-gray-300">{products.length}</span> {t('marketplace.of')} <span className="font-semibold text-gray-700 dark:text-gray-300">{total}</span> {t('marketplace.products')}
              </p>
              {pages > 1 && (
                <div className="flex gap-2 flex-wrap">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm disabled:opacity-40 hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-400 transition-all">
                    ← Prev
                  </button>
                  {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => setPage(p)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${p === page ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md' : 'border border-gray-200 dark:border-gray-700 hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-400'}`}>
                      {p}
                    </button>
                  ))}
                  <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}
                    className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm disabled:opacity-40 hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-400 transition-all">
                    Next →
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
