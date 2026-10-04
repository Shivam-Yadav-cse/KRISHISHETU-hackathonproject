import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaLeaf, FaShieldAlt, FaMapMarkerAlt, FaBolt, FaStar, FaArrowRight, FaTruck, FaChartLine, FaArrowUp, FaArrowDown, FaMinus, FaFire, FaClock } from 'react-icons/fa';
import { productAPI, paymentAPI } from '../services/api';
import ProductCard from '../components/common/ProductCard';
import { SkeletonCard } from '../components/common/LoadingSpinner';
import { useTranslation } from 'react-i18next';

const useCounter = (target, duration = 2000) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target]);
  return count;
};

const Counter = ({ target, suffix = '' }) => {
  const val = useCounter(target);
  return <span>{val.toLocaleString()}{suffix}</span>;
};

const PRICE_COMPARISON = [
  { name: 'Tomato', category: 'Vegetables', city: 'Nashik', retailPrice: 40, krishiPrice: 28, unit: 'kg', eta: '30 mins', rating: 4.5, trend: 'Rising', demand: 'High', organic: false, fresh: true },
  { name: 'Onion', category: 'Vegetables', city: 'Nashik', retailPrice: 45, krishiPrice: 32, unit: 'kg', eta: '30 mins', rating: 4.7, trend: 'Rising', demand: 'High', organic: false, fresh: true },
  { name: 'Mango', category: 'Fruits', city: 'Muzaffarnagar', retailPrice: 100, krishiPrice: 65, unit: 'kg', eta: '45 mins', rating: 4.9, trend: 'Rising', demand: 'High', organic: false, fresh: true },
  { name: 'Organic Honey', category: 'Organic', city: 'Kolar', retailPrice: 500, krishiPrice: 350, unit: 'kg', eta: '1 hr', rating: 4.9, trend: 'Rising', demand: 'High', organic: true, fresh: false },
  { name: 'Milk (A2)', category: 'Dairy', city: 'Amritsar', retailPrice: 72, krishiPrice: 52, unit: 'litre', eta: '20 mins', rating: 4.8, trend: 'Stable', demand: 'High', organic: false, fresh: true },
  { name: 'Apple', category: 'Fruits', city: 'Amritsar', retailPrice: 130, krishiPrice: 85, unit: 'kg', eta: '45 mins', rating: 4.7, trend: 'Stable', demand: 'High', organic: false, fresh: true },
  { name: 'Paneer', category: 'Dairy', city: 'Amritsar', retailPrice: 320, krishiPrice: 220, unit: 'kg', eta: '35 mins', rating: 4.7, trend: 'Stable', demand: 'High', organic: false, fresh: true },
  { name: 'Organic Veggie Pack', category: 'Organic', city: 'Kolar', retailPrice: 180, krishiPrice: 120, unit: 'pack', eta: '1 hr', rating: 4.6, trend: 'Rising', demand: 'High', organic: true, fresh: true },
];

const PriceComparisonCard = ({ item, i }) => {
  const savings = item.retailPrice - item.krishiPrice;
  const savingPct = Math.round((savings / item.retailPrice) * 100);
  const TrendIcon = item.trend === 'Rising' ? FaArrowUp : item.trend === 'Falling' ? FaArrowDown : FaMinus;
  const trendColor = item.trend === 'Rising' ? 'text-orange-400' : item.trend === 'Falling' ? 'text-red-400' : 'text-gray-400';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: i * 0.07 }}
      className="relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group"
    >
      {/* Savings badge */}
      <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-black px-2.5 py-1 rounded-full shadow-md">
        {savingPct}% OFF
      </div>

      {/* Category color bar */}
      <div className={`h-1.5 w-full ${item.organic ? 'bg-emerald-500' : item.category === 'Fruits' ? 'bg-orange-400' : item.category === 'Dairy' ? 'bg-blue-400' : item.category === 'Grains' ? 'bg-yellow-500' : 'bg-green-500'}`} />

      <div className="p-4 pt-3">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-2xl">
                {item.category === 'Vegetables' ? '🥬' : item.category === 'Fruits' ? '🍎' : item.category === 'Dairy' ? '🥛' : item.category === 'Grains' ? '🌾' : '🌿'}
              </span>
              <h3 className="font-bold text-gray-900 dark:text-white text-base">{item.name}</h3>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <FaMapMarkerAlt className="text-green-500" />
              <span>{item.city}</span>
              <span className="text-gray-300 dark:text-gray-600">•</span>
              <span>{item.category}</span>
            </div>
          </div>
          <span className={`flex items-center gap-1 text-xs font-semibold ${trendColor}`}>
            <TrendIcon className="text-[10px]" />{item.trend}
          </span>
        </div>

        {/* Price Comparison */}
        <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 mb-3">
          <div className="text-center">
            <p className="text-[10px] text-gray-400 font-medium mb-1">Retail Market</p>
            <p className="text-lg font-bold text-gray-400 line-through">₹{item.retailPrice}<span className="text-xs">/{item.unit}</span></p>
          </div>
          <div className="text-xl font-black text-gray-300">→</div>
          <div className="text-center">
            <p className="text-[10px] text-green-600 dark:text-green-400 font-bold mb-1">KrishiSetu</p>
            <p className="text-xl font-black text-green-600 dark:text-green-400">₹{item.krishiPrice}<span className="text-xs font-normal">/{item.unit}</span></p>
          </div>
        </div>

        {/* Savings highlight */}
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/40 rounded-xl px-3 py-2 mb-3 text-center">
          <span className="text-sm font-black text-green-700 dark:text-green-400">💰 Save ₹{savings}/{item.unit}</span>
        </div>

        {/* Meta row */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium">
            <FaBolt className="text-[10px]" /><span>Delivery in {item.eta}</span>
          </div>
          <div className="flex items-center gap-0.5">
            <FaStar className="text-yellow-400 text-[10px]" />
            <span className="font-semibold text-gray-700 dark:text-gray-300">{item.rating}</span>
          </div>
        </div>

        {/* Badges */}
        <div className="flex gap-1.5 flex-wrap mt-2.5">
          {item.fresh && <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full font-semibold">🌿 Fresh Today</span>}
          {item.organic && <span className="text-[10px] bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full font-semibold">✓ Organic</span>}
          <span className="text-[10px] bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 px-2 py-0.5 rounded-full font-semibold">{item.demand} Demand</span>
        </div>
      </div>
    </motion.div>
  );
};

const FeatureCard = ({ icon: Icon, title, desc, color }) => (
  <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
    className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
    <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
      <Icon className="text-2xl text-white" />
    </div>
    <h3 className="font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
  </motion.div>
);

const Testimonial = ({ name, role, text, rating, lang }) => (
  <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
    className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all">
    <div className="flex gap-1 mb-3">{[...Array(rating)].map((_, i) => <FaStar key={i} className="text-yellow-400 text-sm" />)}</div>
    <p className="text-gray-600 dark:text-gray-400 text-sm italic mb-4 leading-relaxed">"{text}"</p>
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center font-bold text-white text-sm">{name[0]}</div>
      <div>
        <p className="font-semibold text-gray-900 dark:text-white text-sm">{name}</p>
        <p className="text-xs text-gray-400">{role}</p>
        {lang && <p className="text-[10px] text-gray-300 dark:text-gray-600 italic">{lang}</p>}
      </div>
    </div>
  </motion.div>
);

export default function HomePage() {
  const { t } = useTranslation();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    Promise.all([
      productAPI.getAll({ limit: 8, sort: 'rating' }),
      productAPI.getAll({ limit: 4, sort: 'rating', category: 'Organic' }),
    ]).then(([pRes, tRes]) => {
      setFeaturedProducts(pRes.data.data || []);
      setTrendingProducts(tRes.data.data || []);
      setLoadingProducts(false);
    }).catch(() => setLoadingProducts(false));
  }, []);

  const features = [
    { icon: FaLeaf, title: 'Direct Farm to Home', desc: 'Connect directly with local farmers. No middlemen, no markups — just fresh produce at fair prices.', color: 'bg-green-500' },
    { icon: FaShieldAlt, title: 'Escrow Payment Security', desc: 'Your payment is held safely until delivery is confirmed. Farmers get paid, consumers stay protected.', color: 'bg-blue-500' },
    { icon: FaMapMarkerAlt, title: 'Hyperlocal Delivery', desc: 'Find farmers near you based on pincode. Get fresh produce delivered within your local area.', color: 'bg-orange-500' },
    { icon: FaBolt, title: 'Live Order Tracking', desc: 'Track your order in real-time with live GPS updates. Know exactly where your delivery is.', color: 'bg-purple-500' },
    { icon: FaChartLine, title: 'Smart Pricing AI', desc: 'Our rule-based system suggests optimal prices based on live mandi data, demand, and seasons.', color: 'bg-pink-500' },
    { icon: FaTruck, title: 'Rural Employment', desc: 'Empowering village youth as delivery partners. Earn ₹15,000+ per month through hyperlocal delivery.', color: 'bg-teal-500' },
  ];

  const testimonials = [
    { name: 'Ramesh Patel', role: 'Farmer, Nashik', text: 'KrishiSetu helped me sell tomatoes at ₹35/kg instead of ₹22 at mandi. My income increased by 60% this season!', rating: 5, lang: 'English' },
    { name: 'Priya Sharma', role: 'Consumer, Mumbai', text: 'मुझे ताज़ी सब्ज़ियाँ सीधे घर मिलती हैं। KrishiSetu पर कीमतें बाज़ार से बहुत कम हैं!', rating: 5, lang: 'Hindi' },
    { name: 'Suresh Kumar', role: 'Delivery Partner, Pune', text: 'I earn ₹800-1000 daily delivering farm produce in my area. KrishiSetu created real employment for me.', rating: 5, lang: 'English' },
    { name: 'Meena Devi', role: 'Farmer, UP', text: 'Hindi में voice feature से मैंने आसानी से अपने चावल लिस्ट किए। अब 50+ परिवारों को सीधे बेचती हूँ।', rating: 5, lang: 'Hindi' },
  ];

  return (
    <div className="overflow-x-hidden">

      {/* HERO */}
      <section className="relative bg-hero-pattern text-white min-h-[88vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-white blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-green-300 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-emerald-400 blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm mb-6">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span>{t('hero.liveTag')}</span>
              </div>
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black leading-tight mb-4">
                Fresh Farm Products
                <br />
                <span className="text-green-300">Delivered Directly</span>
                <br />
                From Farmers
              </h1>
              <p className="text-green-100 text-lg mb-4 leading-relaxed max-w-lg">{t('hero.subtitle')}</p>
              <div className="flex flex-wrap gap-2 mb-8">
                {['No Middlemen', 'Farm Fresh', '30-min Delivery', 'Secure Payments'].map(b => (
                  <span key={b} className="bg-white/10 border border-white/20 text-xs px-3 py-1 rounded-full font-medium">✓ {b}</span>
                ))}
              </div>
              <div className="flex flex-wrap gap-4">
                <Link to="/marketplace" className="bg-white text-green-700 font-black px-8 py-3.5 rounded-2xl hover:bg-green-50 transition-all shadow-xl hover:shadow-2xl active:scale-95 flex items-center gap-2 text-base">
                  🛒 {t('hero.cta')} <FaArrowRight />
                </Link>
                <Link to="/register" className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-bold px-8 py-3.5 rounded-2xl hover:bg-white/20 transition-all flex items-center gap-2 text-base">
                  🌾 {t('hero.cta2')}
                </Link>
              </div>
            </motion.div>

            {/* Right — stats + floating cards */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="hidden lg:block">
              <div className="grid grid-cols-2 gap-4 mb-4">
                {[
                  { label: 'Active Farmers', value: 1247, suffix: '+', icon: '👨‍🌾' },
                  { label: 'Products Listed', value: 3580, suffix: '+', icon: '🥬' },
                  { label: 'Happy Consumers', value: 18500, suffix: '+', icon: '😊' },
                  { label: 'Farmer Savings', value: 42, suffix: '%', icon: '📈' },
                ].map(stat => (
                  <div key={stat.label} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 text-center hover:bg-white/15 transition-all">
                    <span className="text-3xl">{stat.icon}</span>
                    <p className="text-3xl font-black mt-2"><Counter target={stat.value} suffix={stat.suffix} /></p>
                    <p className="text-green-200 text-sm mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
              {/* Floating product preview cards */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { name: 'Tomato', price: 28, mandi: 40, icon: '🍅' },
                  { name: 'Mango', price: 65, mandi: 100, icon: '🥭' },
                  { name: 'Milk A2', price: 52, mandi: 72, icon: '🥛' },
                ].map((item, i) => (
                  <motion.div key={item.name}
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.6, ease: 'easeInOut' }}
                    className="bg-white/15 backdrop-blur-sm border border-white/25 rounded-xl p-3 text-center"
                  >
                    <div className="text-2xl mb-1">{item.icon}</div>
                    <p className="text-xs font-bold text-white">{item.name}</p>
                    <p className="text-[10px] text-green-200 line-through">₹{item.mandi}</p>
                    <p className="text-sm font-black text-green-300">₹{item.price}</p>
                    <p className="text-[9px] text-emerald-300 font-semibold mt-0.5">Save ₹{item.mandi - item.price}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="bg-green-700 text-white py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm font-medium">
            {['🚀 30-min Delivery', '🔒 Secure Escrow', '🌿 100% Fresh', '👨‍🌾 Direct from Farm', '⭐ Verified Farmers', '🏆 Hackathon Ready'].map(item => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </section>

      {/* PRICE COMPARISON SECTION — replaces Mandi Ticker */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold px-4 py-2 rounded-full mb-4">
            💰 Save More Every Day
          </div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-3">{t('home.compareTitle')}</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">{t('home.compareSubtitle')}</p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PRICE_COMPARISON.map((item, i) => <PriceComparisonCard key={item.name} item={item} i={i} />)}
        </div>
        <div className="text-center mt-8">
          <Link to="/marketplace" className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold px-8 py-3 rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg active:scale-95">
            {t('common.viewAll')} Products <FaArrowRight />
          </Link>
        </div>
      </section>

      {/* TOP RATED PRODUCTS */}
      <section className="bg-gray-50 dark:bg-gray-800/50 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <FaStar className="text-yellow-400" />
                <h2 className="text-2xl font-black text-gray-900 dark:text-white">{t('home.featuredTitle')}</h2>
              </div>
              <p className="text-gray-500 dark:text-gray-400">{t('home.featuredSubtitle')}</p>
            </div>
            <Link to="/marketplace" className="hidden md:flex items-center gap-2 border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white font-semibold px-5 py-2 rounded-xl transition-all text-sm">
              {t('common.viewAll')} <FaArrowRight />
            </Link>
          </div>
          {loadingProducts ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {featuredProducts.map(product => <ProductCard key={product._id} product={product} />)}
            </div>
          )}
          <div className="text-center mt-8 md:hidden">
            <Link to="/marketplace" className="inline-flex items-center gap-2 bg-green-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-green-700 transition-all">
              {t('common.viewAll')} <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ORGANIC COLLECTION */}
      {!loadingProducts && trendingProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <FaLeaf className="text-emerald-500" />
                <h2 className="text-2xl font-black text-gray-900 dark:text-white">{t('home.organicTitle')}</h2>
              </div>
              <p className="text-gray-500 dark:text-gray-400">Certified organic produce from trusted farms</p>
            </div>
            <Link to="/marketplace?category=Organic" className="hidden md:flex items-center gap-2 border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white font-semibold px-5 py-2 rounded-xl transition-all text-sm">
              {t('common.viewAll')} <FaArrowRight />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {trendingProducts.map(product => <ProductCard key={product._id} product={product} />)}
          </div>
        </section>
      )}

      {/* WHY CHOOSE US */}
      <section className="bg-gradient-to-br from-gray-50 to-green-50 dark:from-gray-900 dark:to-green-900/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-3">{t('home.whyTitle')}</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">{t('home.whySubtitle')}</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(f => <FeatureCard key={f.title} {...f} />)}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-3">{t('home.howTitle')}</h2>
            <p className="text-gray-500 dark:text-gray-400">{t('home.howSubtitle')}</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {[
              { step: '01', icon: '🌾', title: 'Farmer Lists Products', desc: 'Farmers add fresh produce with smart pricing from live mandi data. Voice input in Hindi & English.' },
              { step: '02', icon: '🔍', title: 'Consumer Browses', desc: 'Browse by pincode, filter by category, compare prices, read reviews from verified buyers.' },
              { step: '03', icon: '🛒', title: 'Place Order & Pay', desc: 'Add to cart and pay securely via Stripe. Payment is held in escrow until delivery.' },
              { step: '04', icon: '🚴', title: 'Delivered Fresh', desc: 'Local delivery partner delivers within 30-60 mins. Release escrow after confirmation.' },
            ].map((step, i) => (
              <motion.div key={step.step} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 text-center border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-black text-xs shadow-md">{step.step}</div>
                <div className="text-4xl mb-4 mt-2">{step.icon}</div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                {i < 3 && <div className="hidden md:block absolute top-1/2 -right-3 z-10 text-gray-300 dark:text-gray-600 text-xl font-bold">→</div>}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <h2 className="text-3xl font-black mb-2">{t('home.statsTitle')}</h2>
            <p className="text-gray-400">{t('home.statsSubtitle')}</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Farmer Income Increase', value: 60, suffix: '%', color: 'text-green-400', icon: '📈' },
              { label: 'States Covered', value: 15, suffix: '+', color: 'text-blue-400', icon: '🗺️' },
              { label: 'Rural Jobs Created', value: 3200, suffix: '+', color: 'text-orange-400', icon: '💼' },
              { label: 'Daily Transactions', value: 850, suffix: '+', color: 'text-purple-400', icon: '🛒' },
            ].map(stat => (
              <motion.div key={stat.label} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                className="text-center p-6 bg-white/5 rounded-2xl hover:bg-white/10 transition-all border border-white/5">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <p className={`text-4xl font-black ${stat.color}`}><Counter target={stat.value} suffix={stat.suffix} /></p>
                <p className="text-gray-400 text-sm mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-3">{t('home.testimonialsTitle')}</h2>
          <p className="text-gray-500 dark:text-gray-400">{t('home.testimonialsSubtitle')}</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map(t => <Testimonial key={t.name} {...t} />)}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-hero-pattern py-20 text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="text-5xl mb-4">🚀</div>
            <h2 className="text-4xl font-black mb-4">{t('home.ctaTitle')}</h2>
            <p className="text-green-100 text-lg mb-8 max-w-xl mx-auto">{t('home.ctaSubtitle')}</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/register" className="bg-white text-green-700 font-black px-8 py-3.5 rounded-2xl hover:bg-green-50 transition-all shadow-xl active:scale-95 text-base">
                {t('common.getStarted')}
              </Link>
              <Link to="/marketplace" className="border-2 border-white/50 text-white font-bold px-8 py-3.5 rounded-2xl hover:bg-white/10 transition-all text-base">
                {t('common.browsMarketplace')}
              </Link>
            </div>
            <p className="text-green-200 text-sm mt-6">🔐 Secure Login · Trusted by 18,500+ consumers across India</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
