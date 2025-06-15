import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Menu, X, ChevronDown, Search, User, Heart, Home, ShoppingCart } from 'lucide-react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa';
import { categories } from '../../data/categories';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

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
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white">
        {/* Top Bar - Desktop Only */}
        <div className="hidden md:block border-b border-gray-100">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-10 text-sm">
              <div className="flex items-center space-x-6">
                <a href="tel:+911234567890" className="text-gray-600 hover:text-orange-600">
                  +91 1234567890
                </a>
                <a href="mailto:info@poemsofwood.com" className="text-gray-600 hover:text-orange-600">
                  info@poemsofwood.com
                </a>
              </div>
              <div className="flex items-center space-x-6">
                <Link to="/" className="text-gray-600 hover:text-orange-600">
                  Home
                </Link>
                <Link to="/shop" className="text-gray-600 hover:text-orange-600">
                  Shop
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
          <div className="flex items-center justify-between h-16 md:h-24">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img src="/logo.png" alt="Poems of Wood" className="h-12 md:h-20" />
            </Link>

            {/* Search Box - Desktop Only */}
            <div className="hidden md:block flex-1 max-w-xl mx-8">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-10 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent"
                />
                <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-600">
                  <Search className="w-5 h-5" />
                </button>
              </form>
            </div>

            {/* Right Icons - Desktop Only */}
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/wishlist" className="text-gray-700 hover:text-orange-600 transition-colors">
                <Heart className="w-5 h-5" />
              </Link>
              <Link to="/cart" className="text-gray-700 hover:text-orange-600 transition-colors relative">
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  0
                </span>
              </Link>
              <Link 
                to="/login" 
                className="flex items-center px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-full hover:bg-orange-700 transition-colors"
              >
                Login / Register
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-700 hover:text-orange-600 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

       
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="md:hidden fixed inset-0 bg-white z-50 overflow-y-auto"
            >
              <div className="container mx-auto px-4 py-4">
                {/* Mobile Menu Header */}
                <div className="flex items-center justify-between mb-4">
                  <Link to="/" className="flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
                    <img src="/logo.png" alt="Poems of Wood" className="h-12" />
                  </Link>
                  <button
                    className="text-gray-700 hover:text-orange-600 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="relative mb-4">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-4 pr-10 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent"
                  />
                  <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-600">
                    <Search className="w-5 h-5" />
                  </button>
                </form>

                {/* Mobile Navigation */}
                <nav className="space-y-4">
                  <div className="space-y-3">
                    <Link
                      to="/"
                      className="block text-base font-medium text-gray-900 hover:text-orange-600 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Home
                    </Link>
                    <Link
                      to="/shop"
                      className="block text-base font-medium text-gray-900 hover:text-orange-600 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Shop
                    </Link>
                    <Link
                      to="/about"
                      className="block text-base font-medium text-gray-900 hover:text-orange-600 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      About us
                    </Link>
                    <Link
                      to="/contact"
                      className="block text-base font-medium text-gray-900 hover:text-orange-600 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Contact us
                    </Link>
                  </div>

                  {/* Categories Section */}
                  <div className="pt-4 border-t border-gray-100">
                    <h3 className="text-base font-medium text-gray-900 mb-3">Categories</h3>
                    <div className="space-y-3">
                      {categories.map((category) => (
                        <div key={category.name} className="space-y-2">
                          <button
                            onClick={() => handleCategoryClick(category.name)}
                            className="text-sm text-gray-700 hover:text-orange-600 transition-colors"
                          >
                            {category.name}
                          </button>
                          {category.submenu && (
                            <div className="pl-4 space-y-2">
                              {category.submenu.map((sub) => (
                                <div key={sub.name}>
                                  <button
                                    onClick={() => handleCategoryClick(category.name, sub.name)}
                                    className="text-sm text-gray-600 hover:text-orange-600 transition-colors"
                                  >
                                    {sub.name}
                                  </button>
                                  {sub.items && (
                                    <div className="pl-4 space-y-2">
                                      {sub.items.map((item) => (
                                        <button
                                          key={item}
                                          onClick={() => handleCategoryClick(category.name, sub.name, item)}
                                          className="text-sm text-gray-600 hover:text-orange-600 transition-colors"
                                        >
                                          {item}
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Account Section */}
                  <div className="pt-4 border-t border-gray-100">
                    <Link
                      to="/login"
                      className="flex items-center justify-center w-full px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-full hover:bg-orange-700 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Login / Register
                    </Link>
                  </div>

                  {/* Social Links */}
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-center space-x-6">
                      <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-orange-600">
                        <FaFacebookF className="w-5 h-5" />
                      </a>
                      <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-orange-600">
                        <FaTwitter className="w-5 h-5" />
                      </a>
                      <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-orange-600">
                        <FaInstagram className="w-5 h-5" />
                      </a>
                      <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-orange-600">
                        <FaLinkedinIn className="w-5 h-5" />
                      </a>
                      <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-orange-600">
                        <FaYoutube className="w-5 h-5" />
                      </a>
                    </div>
                  </div>
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <nav className="flex justify-around items-center h-14">
          <Link to="/" className="flex flex-col items-center justify-center text-gray-600 hover:text-orange-600 transition-colors">
            <Home className="w-5 h-5" />
            <span className="text-xs mt-0.5">Home</span>
          </Link>
          <Link to="/shop" className="flex flex-col items-center justify-center text-gray-600 hover:text-orange-600 transition-colors">
            <ShoppingCart className="w-5 h-5" />
            <span className="text-xs mt-0.5">Shop</span>
          </Link>
          <Link to="/wishlist" className="flex flex-col items-center justify-center text-gray-600 hover:text-orange-600 transition-colors">
            <Heart className="w-5 h-5" />
            <span className="text-xs mt-0.5">Wishlist</span>
          </Link>
          <Link to="/cart" className="flex flex-col items-center justify-center text-gray-600 hover:text-orange-600 transition-colors relative">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
              0
            </span>
            <span className="text-xs mt-0.5">Cart</span>
          </Link>
          <Link to="/login" className="flex flex-col items-center justify-center text-gray-600 hover:text-orange-600 transition-colors">
            <User className="w-5 h-5" />
            <span className="text-xs mt-0.5">Account</span>
          </Link>
        </nav>
      </div>

      {/* Spacer to prevent content from being hidden under fixed header and bottom nav */}
      <div className="h-[40px] md:h-[100px] mb-14 md:mb-0"></div>
    </>
  );
};

export default Header; 