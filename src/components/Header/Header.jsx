import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Menu, X, ChevronDown, Search, User, Heart, Home, ShoppingCart, Phone, Mail } from 'lucide-react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import logo from '/logo.png';
import config from '../../config/config.js';
import axios from 'axios';
import Loader from '../Loader';
import { useSellerNavigation } from '../../hooks/useSellerNavigation';


const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDesktopSearchFocused, setIsDesktopSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const searchInputRef = useRef(null);
  const searchBarRef = useRef(null);
  const desktopSearchRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems } = useCart();
  const { user } = useAuth();
  const [dynamicCategories, setDynamicCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState('menu');
  const { navigateToHome, navigateToShop, navigateToProduct } = useSellerNavigation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
    // Close on outside click
    const handleClickOutside = (e) => {
      if (isSearchOpen && searchBarRef.current && !searchBarRef.current.contains(e.target)) {
        setIsSearchOpen(false);
        setSearchResults([]);
        setSearchQuery('');
      }
      if (isDesktopSearchFocused && desktopSearchRef.current && !desktopSearchRef.current.contains(e.target)) {
        setIsDesktopSearchFocused(false);
        setSearchResults([]);
        setSearchQuery('');
      }
    };
    // Close on Esc
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setSearchResults([]);
        setSearchQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isSearchOpen]);

  // Search products as user types
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setSearchError(null);
      return;
    }
    setSearchLoading(true);
    setSearchError(null);
    fetch(config.API_URLS.SHOP)
      .then(res => res.json())
      .then(data => {
        const q = searchQuery.trim().toLowerCase();
        const results = data.filter(p =>
          (p.name && p.name.toLowerCase().includes(q)) ||
          (p.description && p.description.toLowerCase().includes(q))
        );
        setSearchResults(results);
        setSearchLoading(false);
      })
      .catch(err => {
        setSearchError('Failed to fetch products');
        setSearchLoading(false);
      });
  }, [searchQuery]);

  // Fetch categories for mobile menu
  useEffect(() => {
    setCategoriesLoading(true);
    axios.get(config.API_URLS.CATEGORIES)
      .then(response => {
        setDynamicCategories(response.data.categories || []);
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
        setDynamicCategories([]);
      })
      .finally(() => {
        setCategoriesLoading(false);
      });
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
      navigateToShop();
      setIsMobileMenuOpen(false);
    }
  };

  const handleSearchIconClick = () => {
    setIsSearchOpen((prev) => !prev);
    setSearchQuery('');
    setSearchResults([]);
    setSearchError(null);
  };

  const handleResultClick = (id) => {
    setIsSearchOpen(false);
    setIsDesktopSearchFocused(false);
    setSearchResults([]);
    setSearchQuery('');
    navigateToProduct(id);
  };

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
   
  ];

  const MmenuItems = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Seller Program', path: '/seller' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];


  const mobileMenuVariants = {
    closed: {
      x: '-100%',
      transition: {
        type: 'tween',
        duration: 0.4,
        ease: [0.4, 0.0, 0.2, 1]
      }
    },
    open: {
      x: 0,
      transition: {
        type: 'tween',
        duration: 0.4,
        ease: [0.4, 0.0, 0.2, 1]
      }
    }
  };

  return (
    <>
      {/* Animated Search Bar Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed top-0 left-0 w-full z-[20000] bg-white/900 backdrop-blur-md shadow-2xl border-b border-gray-100 px-4 py-4 flex flex-col items-center"
            ref={searchBarRef}
          >
            <form onSubmit={handleSearch} className="w-full max-w-2xl relative flex">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-6 pr-12 py-3 border-0 rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 shadow-lg bg-gray-50/80 backdrop-blur-sm"
              />
              <button
                type="submit"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-pink-600 transition-colors duration-200"
              >
                <Search size={20} />
              </button>
            </form>
            {/* Results Dropdown */}
            <div className="w-full max-w-2xl mt-3 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
              {searchLoading && (
                <div className="flex items-center justify-center py-8 text-pink-600">
                  <Loader />
                </div>
              )}
              {searchError && (
                <div className="py-8 text-center text-red-500">{searchError}</div>
              )}
              {!searchLoading && !searchError && searchResults.length > 0 && (
                <ul>
                  {searchResults.slice(0, 8).map(product => (
                    <li
                      key={product._id}
                      className="flex items-center px-6 py-4 hover:bg-pink-50/80 cursor-pointer transition-all duration-200 border-b last:border-b-0 border-gray-100"
                      onClick={() => handleResultClick(product._id)}
                    >
                      <img
                        src={config.fixImageUrl(product.image)}
                        alt={product.name}
                        className="w-14 h-14 object-cover rounded-xl mr-4 border border-gray-200 shadow-sm"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500 truncate">{product.description}</div>
                      </div>
                      <div className="ml-4 text-pink-600 font-bold whitespace-nowrap">₹{product.price}</div>
                    </li>
                  ))}
                </ul>
              )}
              {!searchLoading && !searchError && searchQuery && searchResults.length === 0 && (
                <div className="py-8 text-center text-gray-500">No products found.</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <header 
        className="w-full z-[10000] transition-all duration-500"
        style={{ 
          backgroundImage: "linear-gradient(135deg, rgba(119, 42, 75, 0.95) 0%, rgba(143, 58, 97, 0.95) 50%, rgba(119, 42, 75, 0.95) 100%), url('/footer.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Top Bar - Desktop Only */}
        <div className="hidden md:block border-b border-white/10">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between h-12 text-sm">
              <div className="flex items-center space-x-8">
                <a href="tel:+9183406246358" className="text-white/90 hover:text-white transition-colors duration-200 flex items-center gap-2">
                  <Phone size={16} className="opacity-80" />
                  +91 83406246358
                </a>
                <a href="mailto:care@rikocraft.com" className="text-white/90 hover:text-white transition-colors duration-200 flex items-center gap-2">
                  <Mail size={16} className="opacity-80" />
                  care@rikocraft.com
                </a>
              </div>
              <div className="flex items-center space-x-8">
                <a href="/about" className="text-white/90 hover:text-white transition-colors duration-200">Our Story</a>
                <a href="/contact" className="text-white/90 hover:text-white transition-colors duration-200">Contact</a>
                <a href="/FAQ" className="text-white/90 hover:text-white transition-colors duration-200">FAQ</a>
                <Link to="/seller" className="text-white/90 hover:text-white transition-colors duration-200">Seller Program</Link>
                <div className="flex items-center space-x-4 text-white">
                  <a href="#" className="hover:opacity-80 transition-opacity duration-200 p-2 rounded-full hover:bg-white/10"><FaFacebookF /></a>
                  <a href="https://www.instagram.com/riko.craft?igsh=YWlsZmRnNmk5eXp2" className="hover:opacity-80 transition-opacity duration-200 p-2 rounded-full hover:bg-white/10"><FaInstagram /></a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-[100px] md:h-[140px]">
            {/* Desktop Logo */}
            <motion.button 
              onClick={navigateToHome} 
              className="hidden md:block hover:scale-105 transition-transform duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img src={logo} alt="Riko Craft" className="h-24 w-auto drop-shadow-lg" />
            </motion.button>

            {/* Mobile Hamburger Menu - Left */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-white/90 hover:text-white transition-colors duration-200 p-2 rounded-lg hover:bg-white/10"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>

            {/* Logo Image - Centered (Mobile Only) */}
            <div className="absolute left-1/2 transform -translate-x-1/2 md:hidden">
              <motion.button 
                onClick={navigateToHome} 
                className="hover:scale-105 transition-transform duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <img src={logo} alt="Riko Craft" className="h-20 w-auto drop-shadow-lg" />
              </motion.button>
            </div>

            {/* Desktop Search */}
            <div className="hidden md:block flex-1 max-w-2xl mx-8 relative" ref={desktopSearchRef}>
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsDesktopSearchFocused(true)}
                  className="w-full pl-6 pr-12 py-3 border-0 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 bg-white/20 backdrop-blur-sm text-white placeholder-white/70 shadow-lg"
                />
                <button 
                  type="submit" 
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors duration-200"
                >
                  <Search size={18} />
                </button>
              </form>
              
              {/* Desktop Search Results Dropdown */}
              {(isDesktopSearchFocused && searchQuery.trim()) && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-3 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                >
                  {searchLoading && (
                    <div className="flex items-center justify-center py-8 text-[#772a4b]">
                      <Loader />
                    </div>
                  )}
                  {searchError && (
                    <div className="py-8 text-center text-red-500">{searchError}</div>
                  )}
                  {!searchLoading && !searchError && searchResults.length > 0 && (
                    <ul>
                      {searchResults.slice(0, 6).map(product => (
                        <li
                          key={product._id}
                          className="flex items-center px-6 py-4 hover:bg-gray-50/80 cursor-pointer transition-all duration-200 border-b last:border-b-0 border-gray-100"
                          onClick={() => handleResultClick(product._id)}
                        >
                          <img
                            src={config.fixImageUrl(product.image)}
                            alt={product.name}
                            className="w-14 h-14 object-cover rounded-xl mr-4 border border-gray-200 shadow-sm"
                          />
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500 truncate">{product.description}</div>
                          </div>
                          <div className="ml-4 text-[#772a4b] font-bold whitespace-nowrap">₹{product.price}</div>
                        </li>
                      ))}
                    </ul>
                  )}
                  {!searchLoading && !searchError && searchQuery && searchResults.length === 0 && (
                    <div className="py-8 text-center text-gray-500">No products found.</div>
                  )}
                </motion.div>
              )}
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-10">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-medium transition-all duration-200 relative group ${
                    isActive(item.path)
                      ? 'text-white'
                      : 'text-white/90 hover:text-white'
                  }`}
                >
                  {item.name}
                  <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-200 group-hover:w-full ${
                    isActive(item.path) ? 'w-full' : ''
                  }`}></span>
                </Link>
              ))}
            </nav>

            {/* Desktop Icons */}
            <div className="hidden md:flex items-center space-x-6">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Link to="/cart" className="text-white/90 hover:text-white transition-colors duration-200 relative p-2 rounded-full hover:bg-white/10">
                  <ShoppingCart size={22} />
                  {cartItems.length > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 bg-white text-[#772a4b] text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-lg"
                    >
                      {cartItems.length}
                    </motion.span>
                  )}
                </Link>
              </motion.div>
              {user ? (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    to="/account" 
                    className="flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm text-white text-sm font-semibold rounded-2xl hover:bg-white/30 transition-all duration-200 shadow-lg border border-white/20"
                  >
                    My Account
                  </Link>
                </motion.div>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    to="/login" 
                    className="flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm text-white text-sm font-semibold rounded-2xl hover:bg-white/30 transition-all duration-200 shadow-lg border border-white/20"
                  >
                    Login / Register
                  </Link>
                </motion.div>
              )}
            </div>

            {/* Mobile Search Icon (Top Right) */}
            <motion.button
              onClick={handleSearchIconClick}
              className="md:hidden text-white/90 hover:text-white transition-colors duration-200 p-2 rounded-lg hover:bg-white/10"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Open search"
            >
              <Search size={24} />
            </motion.button>
          </div>
        </div>

        {/* New Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[20000]"
              />
              
              {/* Menu Panel */}
              <motion.div
                variants={mobileMenuVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="fixed top-0 left-0 h-full w-full max-w-sm bg-gradient-to-br from-[#772a4b] to-[#8f3a61] z-[20001] flex flex-col shadow-2xl"
              >
                {/* Menu Header with Close Button */}
                <div className="flex items-center justify-between p-6 border-b border-white/20">
                  <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
                    <img src={logo} alt="Riko Craft" className="h-12 w-auto drop-shadow-lg" />
                  </Link>
                  <motion.button 
                    onClick={() => setIsMobileMenuOpen(false)} 
                    className="p-2 text-white hover:bg-white/10 rounded-full transition-colors duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X size={24} />
                  </motion.button>
                </div>

                {/* Tab Navigation */}
                <div className="flex border-b border-white/20">
                  <button
                    onClick={() => setActiveMobileTab('menu')}
                    className={`flex-1 py-4 text-center text-sm font-semibold transition-all duration-200 ${
                      activeMobileTab === 'menu'
                        ? 'text-white border-b-2 border-white'
                        : 'text-white/70'
                    }`}
                  >
                    MENU
                  </button>
                  <button
                    onClick={() => setActiveMobileTab('categories')}
                    className={`flex-1 py-4 text-center text-sm font-semibold transition-all duration-200 ${
                      activeMobileTab === 'categories'
                        ? 'text-white border-b-2 border-white'
                        : 'text-white/70'
                    }`}
                  >
                    CATEGORIES
                  </button>
                </div>

                {/* Menu Content */}
                <div className="flex-grow overflow-y-auto">
                  {/* Menu Tab */}
                  {activeMobileTab === 'menu' && (
                    <div className="p-6 space-y-2">
                      {/* Navigation Links */}
                      <nav>
                        <ul className="space-y-2">
                          {MmenuItems.map((item) => (
                            <li key={item.path}>
                              <Link
                                to={item.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block py-4 px-6 rounded-xl text-white/90 hover:bg-white/10 hover:text-white transition-all duration-200 font-medium"
                              >
                                {item.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </nav>
                    </div>
                  )}

                  {/* Categories Tab */}
                  {activeMobileTab === 'categories' && (
                    <div className="p-6">
                      {categoriesLoading ? (
                        <div className="flex items-center justify-center py-12">
                          <Loader />
                        </div>
                      ) : dynamicCategories.length > 0 ? (
                        <ul className="space-y-2">
                          {dynamicCategories.map(category => (
                            <li key={category._id || category.id}>
                              <button 
                                onClick={() => {
                                  handleCategoryClick(category.name);
                                  setIsMobileMenuOpen(false);
                                }}
                                className="w-full text-left py-4 px-6 rounded-xl text-white/90 hover:bg-white/10 hover:text-white transition-all duration-200 font-medium"
                              >
                                {category.name}
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-center py-12 text-white/60">
                          No categories available
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Menu Footer */}
                <div className="p-6 border-t border-white/20">
                  {user ? (
                    <Link
                      to="/account"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 py-3 px-6 rounded-xl text-white/90 hover:bg-white/10 hover:text-white transition-all duration-200 font-medium"
                    >
                      <User size={20} /> My Account
                    </Link>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 py-3 px-6 rounded-xl text-white/90 hover:bg-white/10 hover:text-white transition-all duration-200 font-medium"
                    >
                      <User size={20} /> Login / Register
                    </Link>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-t from-[#772a4b] to-[#8f3a61] border-t border-white/20 z-[10000] backdrop-blur-md">
        <nav className="flex justify-around items-center h-16 px-4">
          <Link to="/" className="flex flex-col items-center justify-center text-white/90 hover:text-white transition-colors duration-200">
            <Home className="w-6 h-6" />
            <span className="text-xs mt-1 font-medium">Home</span>
          </Link>
          <Link to="/shop" className="flex flex-col items-center justify-center text-white/90 hover:text-white transition-colors duration-200">
            <ShoppingCart className="w-6 h-6" />
            <span className="text-xs mt-1 font-medium">Shop</span>
          </Link>
          <Link to="/cart" className="flex flex-col items-center justify-center text-white/90 hover:text-white transition-colors duration-200 relative">
            <ShoppingBag className="w-6 h-6" />
            <span className="text-xs mt-1 font-medium">Cart</span>
            {cartItems.length > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-white text-[#772a4b] text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg"
              >
                {cartItems.length}
              </motion.span>
            )}
          </Link>
          <Link to="/account" className="flex flex-col items-center justify-center text-white/90 hover:text-white transition-colors duration-200">
            <User className="w-6 h-6" />
            <span className="text-xs mt-1 font-medium">Account</span>
          </Link>
        </nav>
      </div>
    </>
  );
};

export default Header;