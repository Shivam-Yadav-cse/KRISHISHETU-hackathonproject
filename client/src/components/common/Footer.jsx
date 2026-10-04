import React from 'react';
import { Link } from 'react-router-dom';
import { FaLeaf, FaTwitter, FaInstagram, FaFacebook, FaWhatsapp, FaLinkedin, FaShieldAlt, FaLock, FaCreditCard } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 text-white font-black text-xl mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
                <FaLeaf className="text-sm" />
              </div>
              KrishiSetu
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-5">
              India's premier farm-to-consumer marketplace. Empowering farmers with fair prices, fresh produce for consumers, and rural employment for delivery partners.
            </p>
            <div className="flex gap-2">
              {[
                { Icon: FaTwitter, href: 'https://twitter.com', label: 'Twitter' },
                { Icon: FaInstagram, href: 'https://instagram.com', label: 'Instagram' },
                { Icon: FaFacebook, href: 'https://facebook.com', label: 'Facebook' },
                { Icon: FaWhatsapp, href: 'https://wa.me/911800123456', label: 'WhatsApp' },
                { Icon: FaLinkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
              ].map(({ Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="w-9 h-9 bg-gray-800 hover:bg-gradient-to-br hover:from-green-600 hover:to-emerald-600 rounded-lg flex items-center justify-center transition-all duration-200 hover:shadow-md">
                  <Icon className="text-xs" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wide">Platform</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                ['/','Home'],
                ['/marketplace','Marketplace'],
                ['/register','Join as Farmer'],
                ['/register','Become Delivery Partner'],
                ['/login','Sign In'],
              ].map(([to, label]) => (
                <li key={label}>
                  <Link to={to} className="hover:text-green-400 transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-green-500 rounded-full group-hover:w-2 transition-all"></span>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wide">Features</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              {[
                '🌾 Smart Price Suggestions',
                '🔒 Escrow Payments',
                '📍 Live GPS Tracking',
                '🗣️ Voice Input (Hindi)',
                '📊 Farmer Analytics',
                '🌿 Organic Certification',
                '🚴 Rural Employment',
                '📱 Multilingual Support',
              ].map(f => (
                <li key={f} className="flex items-center gap-2 hover:text-gray-300 transition-colors">
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wide">Contact Us</h4>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-start gap-2">
                <span className="mt-0.5">📧</span>
                <div>
                  <p className="text-gray-300 font-medium">Email Support</p>
                  <a href="mailto:support@krishisetu.in" className="hover:text-green-400 transition-colors">support@krishisetu.in</a>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-0.5">📞</span>
                <div>
                  <p className="text-gray-300 font-medium">Toll Free Helpline</p>
                  <a href="tel:18001234567" className="hover:text-green-400 transition-colors">1800-123-4567</a>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-0.5">🏢</span>
                <div>
                  <p className="text-gray-300 font-medium">Head Office</p>
                  <p>Agri-Tech Hub, Bandra Kurla Complex, Mumbai 400051</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-0.5">⏰</span>
                <div>
                  <p className="text-gray-300 font-medium">Support Hours</p>
                  <p>Mon–Sat, 8:00 AM – 8:00 PM IST</p>
                </div>
              </div>
            </div>

            {/* Payment trust badges */}
            <div className="mt-5 p-3 bg-gray-800 rounded-xl border border-gray-700">
              <p className="text-xs text-gray-400 font-semibold mb-2 uppercase tracking-wide">Secure Payments</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { icon: FaShieldAlt, label: 'SSL Secured' },
                  { icon: FaLock, label: 'Escrow Safe' },
                  { icon: FaCreditCard, label: 'Stripe' },
                ].map(({ icon: Icon, label }) => (
                  <span key={label} className="flex items-center gap-1.5 bg-gray-700 px-2 py-1 rounded-lg text-[10px] text-gray-300">
                    <Icon className="text-green-400 text-[10px]" />{label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 text-sm text-gray-500">
            <p>© {new Date().getFullYear()} KrishiSetu Technologies Pvt. Ltd. All rights reserved.</p>
            <span className="hidden sm:block">·</span>
            <p>Empowering India's Farmers</p>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <a href="#" className="hover:text-gray-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-gray-400 transition-colors">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
