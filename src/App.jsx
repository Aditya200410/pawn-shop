import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { SellerProvider } from './context/SellerContext';
import Loader from './components/Loader';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import Categories from './components/Categories/Categories';
import FeaturedProducts from './components/Products/FeaturedProducts';
import WeeklyBestsellers from './components/Products/WeeklyBestsellers';
import Testimonials from './components/Testimonials/Testimonials';
import Footer from './components/Footer/Footer';
import MissionVision from './components/MissionVision/MissionVision';
import FAQ from './components/FAQ/FAQ';
import ContactPage from './pages/ContactPage';
import Shop from './pages/Shop';
import Login from './pages/Login';
import Signup from './pages/Signup';  
import Account from './pages/Account';  
import Wishlist from './pages/Wishlist';
import ProductView from './pages/ProductView';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import useScrollToTop from './hooks/useScrollToTop';
import MostLoved from './components/Products/MostLoved';
import Cart from './components/Cart';
import Checkout from './pages/Checkout';
import Toast from './components/Toast/Toast';
import ForgotPassword from './pages/ForgotPassword';
import AboutUs from './pages/AboutUs';
import OrderConfirmation from './pages/OrderConfirmation';
import Becomeseller from './pages/Becomeseller';
import SellerAuth from './pages/SellerAuth';
import SellerProfile from './pages/SellerProfile';
import VerifyOTP from './pages/OTPVerification';
import Policies from './pages/Policies';
import PaymentSuccess from './pages/PaymentSuccess';
// Protected Route component
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader size="md" text="Loading..." />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return children;
};

// Simple Error Boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-4">Please try refreshing the page.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function AppContent() {
  useScrollToTop();
  const { toast, setToast } = useCart();
  const { loading: authLoading } = useAuth();

  // Show loading only if auth is still loading
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader size="md" text="Loading..." showLogo={true} />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <Routes>
        <Route path="/" element={
          <main>
            <ErrorBoundary>
              <Hero />
            </ErrorBoundary>
            <ErrorBoundary>
              <Categories/>
            </ErrorBoundary>
            <ErrorBoundary>
              <FeaturedProducts />
            </ErrorBoundary>
            <ErrorBoundary>
              <WeeklyBestsellers />
            </ErrorBoundary>
            <ErrorBoundary>
              <MostLoved />
            </ErrorBoundary>
            <ErrorBoundary>
              <Testimonials />
            </ErrorBoundary>
            <ErrorBoundary>
              <MissionVision />
            </ErrorBoundary>
          </main>
        } />
        <Route path="/faq" element={<FAQ />} />
        
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/otp-verification" element={<VerifyOTP />} />
        <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path='/seller' element={<Becomeseller/>}/>
        <Route path='/seller/auth' element={<SellerAuth/>}/>
        
        <Route path='/seller/profile' element={<SellerProfile/>}/>
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
        <Route path="/product/:id" element={<ProductView />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/policies" element={<Policies />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
      </Routes>
      <Footer />
      <ScrollToTop />
      <Toaster position="top-right" />
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <CartProvider>
        <AuthProvider>
          <SellerProvider>
            <Router>
              <AppContent />
            </Router>
          </SellerProvider>
        </AuthProvider>
      </CartProvider>
    </ErrorBoundary>
  );
}

export default App;