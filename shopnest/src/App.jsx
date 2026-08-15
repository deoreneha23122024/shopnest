import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getMe } from './store/authSlice';
import { fetchLocaleSettings } from './store/settingsSlice';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import SellerOnboardingPage from './pages/SellerOnboardingPage';
import SellerStatusPage from './pages/SellerStatusPage';
import SellerDashboardPage from './pages/SellerDashboardPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import { AdminRoute, SellerRoute, BuyerRoute, GuestRoute, ProtectedRoute } from './components/ProtectedRoute';

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMe());
    dispatch(fetchLocaleSettings());
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen bg-fk-bg text-fk-text font-sans selection:bg-fk-blue/20 selection:text-fk-blue">
      <Toaster />
      <Header />
      
      <main className="flex-grow">
        <Routes>
          {/* Public/Guest Routes */}
          <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
          <Route path="/forgot-password" element={<GuestRoute><ForgotPasswordPage /></GuestRoute>} />
          <Route path="/reset-password/:token" element={<GuestRoute><ResetPasswordPage /></GuestRoute>} />
          
          {/* Shared/Public Routes (Buyer view mainly) */}
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/checkout" element={<BuyerRoute><CheckoutPage /></BuyerRoute>} />
          <Route path="/orders" element={<BuyerRoute><OrdersPage /></BuyerRoute>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />

          {/* Seller Routes */}
          <Route path="/seller/onboarding" element={<SellerRoute><SellerOnboardingPage /></SellerRoute>} />
          <Route path="/seller/status" element={<SellerRoute><SellerStatusPage /></SellerRoute>} />
          <Route path="/seller/dashboard" element={<SellerRoute requireApproved><SellerDashboardPage /></SellerRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
      <Chatbot />
    </div>
  );
}
