import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Menu, X, ChevronDown, Search, User, Heart, Home, ShoppingCart } from 'lucide-react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa';
import { categories } from '../../data/categories';
import { useCart } from '../../context/CartContext';
import logo from '/logo.png';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCategoryClick = (category, subcategory = null, item = null) => {
    navigate('/shop', {
      state: {
        selectedCategory: {
          main: category,
          sub: subcategory,
          item: item
        }
      }
    });
    setIsMobileMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
   
  
  ];

  const mobileMenuVariants = {
    closed: {
      x: '100%',
      transition: {
        type: 'tween',
        duration: 0.3,
        ease: 'easeInOut'
      }
    },
    open: {
      x: 0,
      transition: {
        type: 'tween',
        duration: 0.3,
        ease: 'easeInOut'
      }
    }
  };

  return (
    <>
      <header className={`w-full z-[10000] transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-white shadow-md'
      }`}>
        {/* Top Bar - Desktop Only */}
        <div className="hidden md:block border-b border-gray-100">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-10 text-sm">
              <div className="flex items-center space-x-6">
                <a href="tel:+911234567890" className="text-gray-600 hover:text-orange-600">
                  +91 1234567890
                </a>
                <a href="mailto:info@rikocraft.com" className="text-gray-600 hover:text-orange-600">
                  info@rikocraft.com
                </a>
              </div>
              <div className="flex items-center space-x-6">
               
                <Link to="/faq" className="text-gray-600 hover:text-orange-600">
                  FAQ
                </Link>
                <Link to="/about" className="text-gray-600 hover:text-orange-600">
                  About us
                </Link>
                <Link to="/contact" className="text-gray-600 hover:text-orange-600">
                  Contact us
                </Link>
                <div className="flex items-center space-x-4 pl-4 border-l border-gray-200">
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-orange-600">
                    <FaFacebookF className="w-4 h-4" />
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-orange-600">
                    <FaTwitter className="w-4 h-4" />
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-orange-600">
                    <FaInstagram className="w-4 h-4" />
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-orange-600">
                    <FaLinkedinIn className="w-4 h-4" />
                  </a>
                  <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-orange-600">
                    <FaYoutube className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-[90px] md:h-[120px]">
            {/* Desktop Logo */}
            <Link to="/" className="hidden md:block">
              <img src={logo} alt="Riko Craft" className="h-20 w-auto" />
            </Link>

            {/* Mobile Hamburger Menu - Left */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-gray-600 hover:text-orange-600 transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Logo Image - Centered (Mobile Only) */}
            <div className="absolute left-1/2 transform -translate-x-1/2 md:hidden">
              <img src={logo} alt="Riko Craft" className="h-16 w-auto" />
            </div>

            {/* Desktop Search */}
            <div className="hidden md:block flex-1 max-w-2xl mx-8">
              <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-12 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent"
              />
                <button 
                  type="submit" 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-600 transition-colors"
                >
                  <Search size={18} />
              </button>
              </form>
        </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    isActive(item.path) ? 'text-orange-600' : 'text-gray-600 hover:text-orange-600'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Desktop Icons */}
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/account" className="text-gray-600 hover:text-orange-600 transition-colors">
                <User size={20} />
              </Link>
              <Link to="/cart" className="text-gray-600 hover:text-orange-600 transition-colors relative">
                <ShoppingCart size={20} />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </Link>
              <Link 
                to="/login" 
                className="flex items-center px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-full hover:bg-orange-700 transition-colors"
              >
                Login / Register
              </Link>
            </div>

            {/* Mobile Cart Icon - Right */}
            <Link 
              to="/cart" 
              className="md:hidden text-gray-600 hover:text-orange-600 transition-colors relative"
            >
              <ShoppingCart size={24} />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 bg-black/50 md:hidden z-[100]"
              />
              
              {/* Menu Panel */}
            <motion.div
                initial={{ x: '-100%' }}
              animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
                className="fixed top-0 left-0 w-[85%] max-w-sm h-full bg-white shadow-xl md:hidden z-[100] overflow-y-auto"
              >
                <div className="flex flex-col h-full">
                  {/* Menu Header */}
                  <div className="p-6 border-b">
                    <div className="flex items-center justify-between mb-6 relative">
                <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-gray-600 hover:text-orange-600 transition-colors absolute right-0"
                >
                        <X size={24} />
                </button>
                      <Link to="/" className="mx-auto" onClick={() => setIsMobileMenuOpen(false)}>
                        <img src={logo} alt="Riko Craft" className="h-12 w-auto" />
                      </Link>
              </div>

                    {/* Search Box */}
                    <form onSubmit={handleSearch} className="relative mb-6">
                      <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-4 pr-10 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent"
                      />
                      <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-600">
                        <Search size={18} />
                      </button>
                    </form>

                    {/* Quick Actions */}
                    <div className="space-y-4">
                      <Link
                        to="/cart"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <div className="flex items-center space-x-3">
                          <ShoppingCart size={24} className="text-orange-600" />
                          <span className="font-medium">Shopping Cart</span>
                        </div>
                        {cartItems.length > 0 && (
                          <span className="bg-orange-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                            {cartItems.length}
                          </span>
                        )}
                      </Link>
                      <Link
                        to="/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center justify-center w-full px-4 py-3 bg-orange-600 text-white text-sm font-medium rounded-full hover:bg-orange-700 transition-colors"
                      >
                        Login / Register
                      </Link>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <nav className="flex-1 p-6">
                    <ul className="space-y-6">
                      <li>
                        <Link
                          to="/"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block text-lg font-medium text-gray-600 hover:text-orange-600 transition-colors"
                        >
                          Home
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/shop"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block text-lg font-medium text-gray-600 hover:text-orange-600 transition-colors"
                        >
                          Shop
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/story"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block text-lg font-medium text-gray-600 hover:text-orange-600 transition-colors"
                        >
                          Story
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/contact"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block text-lg font-medium text-gray-600 hover:text-orange-600 transition-colors"
                        >
                          Contact
                        </Link>
                                  </li>
                              </ul>
                  </nav>

                  {/* Menu Footer */}
                  <div className="p-6 border-t">
                    <div className="flex items-center space-x-4">
                      <Link to="/account" className="flex items-center space-x-2 text-gray-600 hover:text-orange-600 transition-colors">
                        <User size={20} />
                        <span>Account</span>
                      </Link>
                      </div>
                  </div>
              </div>
            </motion.div>
            </>
        )}
        </AnimatePresence>
      </header>

        {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-[10000]">
        <nav className="flex justify-around items-center h-14">
          <Link to="/" className="flex flex-col items-center justify-center text-gray-600 hover:text-orange-600 transition-colors">
            <Home className="w-5 h-5" />
            <span className="text-xs mt-0.5">Home</span>
          </Link>
          <Link to="/shop" className="flex flex-col items-center justify-center text-gray-600 hover:text-orange-600 transition-colors">
            <ShoppingCart className="w-5 h-5" />
            <span className="text-xs mt-0.5">Shop</span>
          </Link>
          <Link to="/account" className="flex flex-col items-center justify-center text-gray-600 hover:text-orange-600 transition-colors">
            <User className="w-5 h-5" />
            <span className="text-xs mt-0.5">Account</span>
          </Link>
          <Link to="/cart" className="flex flex-col items-center justify-center text-gray-600 hover:text-orange-600 transition-colors relative">
            <ShoppingBag className="w-5 h-5" />
            <span className="text-xs mt-0.5">Cart</span>
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </Link>
          
          </nav>
        </div>
    </>
  );
};

export default Header; 