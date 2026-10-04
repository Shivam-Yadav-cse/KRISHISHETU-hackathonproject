import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { SocketProvider } from './context/SocketContext';
import { ThemeProvider } from './context/ThemeContext';

import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MarketplacePage from './pages/MarketplacePage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ConsumerOrdersPage from './pages/ConsumerOrdersPage';
import LiveTrackingPage from './pages/LiveTrackingPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentCancelPage from './pages/PaymentCancelPage';

import FarmerDashboard from './pages/farmer/FarmerDashboard';
import AddProductPage from './pages/farmer/AddProductPage';
import FarmerOrdersPage from './pages/farmer/FarmerOrdersPage';
import EarningsDashboard from './pages/farmer/EarningsDashboard';

import DeliveryDashboard from './pages/delivery/DeliveryDashboard';

import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import ProductManagement from './pages/admin/ProductManagement';
import OrderManagement from './pages/admin/OrderManagement';
import EscrowDashboard from './pages/admin/EscrowDashboard';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div></div>;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
};

const AppRoutes = () => {
  const { user } = useAuth();
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
          <Route path="/register" element={user ? <Navigate to="/" /> : <RegisterPage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/payment/success" element={<PaymentSuccessPage />} />
          <Route path="/payment/cancel" element={<PaymentCancelPage />} />
          <Route path="/cart" element={<ProtectedRoute roles={['consumer']}><CartPage /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute roles={['consumer']}><CheckoutPage /></ProtectedRoute>} />
          <Route path="/my-orders" element={<ProtectedRoute roles={['consumer']}><ConsumerOrdersPage /></ProtectedRoute>} />
          <Route path="/track/:orderId" element={<ProtectedRoute><LiveTrackingPage /></ProtectedRoute>} />
          <Route path="/farmer/dashboard" element={<ProtectedRoute roles={['farmer']}><FarmerDashboard /></ProtectedRoute>} />
          <Route path="/add-product" element={<ProtectedRoute roles={['farmer']}><AddProductPage /></ProtectedRoute>} />
          <Route path="/farmer/orders" element={<ProtectedRoute roles={['farmer']}><FarmerOrdersPage /></ProtectedRoute>} />
          <Route path="/farmer/earnings" element={<ProtectedRoute roles={['farmer']}><EarningsDashboard /></ProtectedRoute>} />
          <Route path="/delivery/dashboard" element={<ProtectedRoute roles={['delivery']}><DeliveryDashboard /></ProtectedRoute>} />
          <Route path="/admin/dashboard" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}><UserManagement /></ProtectedRoute>} />
          <Route path="/admin/products" element={<ProtectedRoute roles={['admin']}><ProductManagement /></ProtectedRoute>} />
          <Route path="/admin/orders" element={<ProtectedRoute roles={['admin']}><OrderManagement /></ProtectedRoute>} />
          <Route path="/admin/escrow" element={<ProtectedRoute roles={['admin']}><EscrowDashboard /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <SocketProvider>
            <BrowserRouter>
              <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
              <AppRoutes />
            </BrowserRouter>
          </SocketProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
