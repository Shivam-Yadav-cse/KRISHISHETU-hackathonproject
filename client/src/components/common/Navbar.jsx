import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaLeaf, FaShoppingCart, FaBars, FaTimes, FaSun, FaMoon, FaChevronDown, FaGlobe } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import i18n, { SUPPORTED_LANGUAGES } from '../../i18n';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { dark, toggleDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const dropdownRef = useRef(null);
  const langRef = useRef(null);

  const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === i18n.language) || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Apply RTL for Urdu
  useEffect(() => {
    const isRTL = SUPPORTED_LANGUAGES.find(l => l.code === i18n.language)?.rtl;
    document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', i18n.language);
  }, [i18n.language]);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
    setMenuOpen(false);
    setDropdownOpen(false);
  };

  const switchLang = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem('lang', code);
    setLangOpen(false);
    const langName = SUPPORTED_LANGUAGES.find(l => l.code === code)?.label;
    toast.success(`Language: ${langName}`, { duration: 1500, icon: '🌐' });
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'farmer') return '/farmer/dashboard';
    if (user.role === 'delivery') return '/delivery/dashboard';
    if (user.role === 'admin') return '/admin/dashboard';
    return '/my-orders';
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-sm border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-black text-xl text-green-700 dark:text-green-400 hover:opacity-90 transition-opacity">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
              <FaLeaf className="text-white text-sm" />
            </div>
            KrishiSetu
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1 text-sm font-medium">
            <Link to="/" className={`px-3 py-2 rounded-lg transition-all ${isActive('/') ? 'text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30 font-semibold' : 'text-gray-600 dark:text-gray-300 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'}`}>
              {t('nav.home')}
            </Link>
            <Link to="/marketplace" className={`px-3 py-2 rounded-lg transition-all ${isActive('/marketplace') ? 'text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30 font-semibold' : 'text-gray-600 dark:text-gray-300 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'}`}>
              {t('nav.marketplace')}
            </Link>
            {user && (
              <Link to={getDashboardLink()} className={`px-3 py-2 rounded-lg transition-all ${isActive(getDashboardLink()) ? 'text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30 font-semibold' : 'text-gray-600 dark:text-gray-300 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'}`}>
                {t('nav.dashboard')}
              </Link>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">

            {/* Language switcher — 13 languages */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangOpen(v => !v)}
                className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded-lg border border-green-300 dark:border-green-700 text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40 transition-all"
                title="Change Language"
              >
                <FaGlobe className="text-[11px]" />
                <span>{currentLang.flag}</span>
                <span className="hidden sm:inline">{currentLang.code.toUpperCase()}</span>
                <FaChevronDown className={`text-[9px] transition-transform ${langOpen ? 'rotate-180' : ''}`} />
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-1.5 w-44 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-1 z-50 overflow-hidden max-h-72 overflow-y-auto">
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold px-3 py-1.5 border-b border-gray-100 dark:border-gray-700">Select Language</p>
                  {SUPPORTED_LANGUAGES.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => switchLang(lang.code)}
                      className={`w-full text-left flex items-center gap-2.5 px-3 py-2 text-sm transition-all hover:bg-green-50 dark:hover:bg-green-900/20 ${i18n.language === lang.code ? 'text-green-700 dark:text-green-400 font-semibold bg-green-50 dark:bg-green-900/20' : 'text-gray-700 dark:text-gray-300'}`}
                    >
                      <span className="text-base">{lang.flag}</span>
                      <span className="flex-1">{lang.label}</span>
                      {lang.rtl && <span className="text-[10px] text-gray-400">RTL</span>}
                      {i18n.language === lang.code && <span className="text-green-500 text-xs">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dark mode */}
            <button onClick={toggleDark} className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" title="Toggle Dark Mode">
              {dark ? <FaSun className="text-yellow-400 text-base" /> : <FaMoon className="text-base" />}
            </button>

            {/* Cart */}
            {user?.role === 'consumer' && (
              <Link to="/cart" className="relative p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <FaShoppingCart className="text-lg" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 text-white text-[10px] rounded-full flex items-center justify-center font-black shadow-sm">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* User dropdown */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-semibold text-sm hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
                >
                  <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-[10px] font-black">
                    {user.name[0].toUpperCase()}
                  </div>
                  <span className="hidden sm:inline max-w-20 truncate">{user.name.split(' ')[0]}</span>
                  <FaChevronDown className={`text-[10px] transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold mb-0.5">Signed in as</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                      <span className="inline-flex items-center mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 capitalize">
                        {user.role}
                      </span>
                    </div>
                    <Link to={getDashboardLink()} onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      📊 {t('nav.dashboard')}
                    </Link>
                    {user.role === 'consumer' && (
                      <>
                        <Link to="/my-orders" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          📦 {t('nav.orders')}
                        </Link>
                        <Link to="/cart" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          🛒 {t('nav.cart')}
                        </Link>
                      </>
                    )}
                    <div className="border-t border-gray-100 dark:border-gray-700 mt-1 pt-1">
                      <button onClick={handleLogout} className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                        🚪 {t('nav.logout')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="hidden sm:block text-sm font-semibold text-green-700 dark:text-green-400 hover:underline px-2 py-2">
                  {t('nav.login')}
                </Link>
                <Link to="/register" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold text-sm py-2 px-4 rounded-xl transition-all shadow-sm active:scale-95">
                  {t('nav.register')}
                </Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <FaTimes className="text-gray-600 dark:text-gray-300" /> : <FaBars className="text-gray-600 dark:text-gray-300" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 dark:border-gray-800 py-4 flex flex-col gap-1">
            <Link to="/" onClick={() => setMenuOpen(false)} className={`py-2.5 px-3 rounded-xl font-medium text-sm ${isActive('/') ? 'text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-900/30' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
              🏠 {t('nav.home')}
            </Link>
            <Link to="/marketplace" onClick={() => setMenuOpen(false)} className={`py-2.5 px-3 rounded-xl font-medium text-sm ${isActive('/marketplace') ? 'text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-900/30' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
              🛒 {t('nav.marketplace')}
            </Link>
            {user ? (
              <>
                <Link to={getDashboardLink()} onClick={() => setMenuOpen(false)} className="py-2.5 px-3 rounded-xl font-medium text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                  📊 {t('nav.dashboard')}
                </Link>
                {user.role === 'consumer' && (
                  <Link to="/my-orders" onClick={() => setMenuOpen(false)} className="py-2.5 px-3 rounded-xl font-medium text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                    📦 {t('nav.orders')}
                  </Link>
                )}
                <button onClick={handleLogout} className="py-2.5 px-3 rounded-xl font-medium text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 text-left">
                  🚪 {t('nav.logout')}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="py-2.5 px-3 rounded-xl font-medium text-sm text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20">
                  {t('nav.login')}
                </Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="py-2.5 px-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-green-600 to-emerald-600 text-white text-center mt-1">
                  {t('nav.register')}
                </Link>
              </>
            )}
            {/* Mobile language grid */}
            <div className="border-t border-gray-100 dark:border-gray-800 mt-2 pt-3">
              <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-2 px-1">Language / भाषा</p>
              <div className="grid grid-cols-3 gap-1.5">
                {SUPPORTED_LANGUAGES.map(lang => (
                  <button key={lang.code} onClick={() => { switchLang(lang.code); setMenuOpen(false); }}
                    className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold border transition-all ${i18n.language === lang.code ? 'border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-green-300'}`}
                  >
                    <span>{lang.flag}</span>
                    <span className="truncate">{lang.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
