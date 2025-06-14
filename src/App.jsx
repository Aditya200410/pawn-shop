import { motion } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import Categories from './components/Categories/Categories';
import FeaturedProducts from './components/Products/FeaturedProducts';
import WeeklyBestsellers from './components/Products/WeeklyBestsellers';
import Testimonials from './components/Testimonials/Testimonials';
import Footer from './components/Footer/Footer';
import MissionVision from './components/MissionVision/MissionVision';
import FAQ from './components/FAQ/FAQ';
import Story from './pages/Story';
import ContactPage from './pages/ContactPage';
import Shop from './pages/Shop';
import Login from './pages/Login';
import SignUp from './pages/Signup';  
import Account from './pages/Account';  
import Wishlist from './pages/Wishlist';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-white">
            <Header />
            <Routes>
              <Route path="/" element={
                <main>
                  <Hero />
                  <Categories />
                  <FeaturedProducts />
                  <WeeklyBestsellers />
                  <Testimonials />
                  <MissionVision />
                </main>
              } />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/story" element={<Story />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/account" element={<Account />} />
              <Route path="/wishlist" element={<Wishlist />} />
            </Routes>
            <Footer />
          </div>
          <Toaster position="top-right" />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
