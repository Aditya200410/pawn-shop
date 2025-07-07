import { useState, useEffect } from 'react';
import { useLocation, Link, useSearchParams } from 'react-router-dom';
import { Slider } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartIcon, ShoppingCartIcon, EyeIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';
// import { products } from '../data/products';
// import { categories } from '../data/categories';
import ProductCard from '../components/ProductCard/ProductCard.jsx';
import config from '../config/config.js';
import Loader from '../components/Loader';
import { useCart } from '../context/CartContext';

const Shop = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { setSellerTokenFromURL } = useCart();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [selectedCategories, setSelectedCategories] = useState({
    main: null,
    sub: null,
    item: null
  });
  const [expandedCategories, setExpandedCategories] = useState({});
  const [sortBy, setSortBy] = useState('popularity');
  const [viewMode, setViewMode] = useState(16);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dynamicCategories, setDynamicCategories] = useState([]);

  // Handle seller token from URL
  useEffect(() => {
    const sellerToken = searchParams.get('seller');
    if (sellerToken) {
      setSellerTokenFromURL(sellerToken);
    }
  }, [searchParams, setSellerTokenFromURL]);

  // Handle category from query param (for footer links)
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategories({ main: categoryParam, sub: null, item: null });
      setExpandedCategories(prev => ({ ...prev, [categoryParam]: true }));
    }
  }, [searchParams]);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(config.API_URLS.SHOP);
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();

        const productsArray = Array.isArray(data) ? data : data.products || [];
        setProducts(productsArray);
        
        // Calculate maximum price from products
        if (productsArray.length > 0) {
          const maxProductPrice = Math.max(...productsArray.map(product => product.price || 0));
          setMaxPrice(maxProductPrice);
          setPriceRange([0, maxProductPrice]);
        }
        
        // Generate dynamic categories from products data
        generateDynamicCategories(data);
      } catch (err) {
        setError(err.message || 'Error fetching products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Generate dynamic categories from products data
  const generateDynamicCategories = (productsData) => {
    const categoryMap = {};
    
    productsData.forEach(product => {
      if (!categoryMap[product.category]) {
        categoryMap[product.category] = {
          name: product.category,
          submenu: {}
        };
      }
      
      if (product.subcategory) {
        if (!categoryMap[product.category].submenu[product.subcategory]) {
          categoryMap[product.category].submenu[product.subcategory] = {
            name: product.subcategory,
            items: new Set()
          };
        }
        
        // If there's an item field, add it to the items set
        if (product.item) {
          categoryMap[product.category].submenu[product.subcategory].items.add(product.item);
        }
      }
    });
    
    // Convert to the format expected by the UI
    const categories = Object.values(categoryMap).map(category => ({
      name: category.name,
      submenu: Object.values(category.submenu).map(sub => ({
        name: sub.name,
        items: Array.from(sub.items).length > 0 ? Array.from(sub.items) : undefined
      }))
    }));
    
    setDynamicCategories(categories);
  };

  // Handle category selection from header dropdown
  useEffect(() => {
    if (location.state?.selectedCategory) {
      setSelectedCategories(location.state.selectedCategory);
      if (location.state.selectedCategory.main) {
        setExpandedCategories(prev => ({
          ...prev,
          [location.state.selectedCategory.main]: true
        }));
      }
    }
  }, [location.state]);

  useEffect(() => {
    filterProducts();
  }, [products, priceRange, selectedCategories, sortBy]);

  const filterProducts = () => {
    let filtered = [...products];

    // Price filter
    filtered = filtered.filter(
      (product) => product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Category filter
    if (selectedCategories.main) {
      filtered = filtered.filter(product => {
        if (selectedCategories.item) {
          return product.category === selectedCategories.main && 
                 product.subcategory === selectedCategories.sub &&
                 product.item === selectedCategories.item;
        }
        if (selectedCategories.sub) {
          return product.category === selectedCategories.main && 
                 product.subcategory === selectedCategories.sub;
        }
        return product.category === selectedCategories.main;
      });
    }

    // Sorting
    switch (sortBy) {
      case 'popularity':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'latest':
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'alphabetical':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  };

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const toggleCategory = (categoryName) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryName]: !prev[categoryName]
    }));
  };

  const handleCategoryClick = (main, sub = null, item = null) => {
    setSelectedCategories({
      main: main === selectedCategories.main && !sub ? null : main,
      sub: sub === selectedCategories.sub && !item ? null : sub,
      item: item === selectedCategories.item ? null : item
    });
  };

  const isCategorySelected = (main, sub = null, item = null) => {
    return selectedCategories.main === main && 
           (!sub || selectedCategories.sub === sub) && 
           (!item || selectedCategories.item === item);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Mobile Filter Button */}
        <div className="md:hidden mb-6">
          <button
            onClick={() => setIsMobileFiltersOpen(true)}
            className="w-full flex items-center justify-center gap-2 bg-white px-4 py-3 rounded-xl shadow-sm border border-gray-100 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <FunnelIcon className="h-5 w-5" />
            <span>Filters</span>
          </button>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          {/* Filters - Desktop */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden md:block w-64 space-y-6"
          >
            {/* Categories Filter */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                {dynamicCategories.map((category) => (
                  <div key={category.name}>
                    <button
                      onClick={() => {
                        handleCategoryClick(category.name);
                        if (category.submenu?.length > 0) {
                          toggleCategory(category.name);
                        }
                      }}
                      className={`w-full text-left px-4 py-2 rounded-xl transition-all duration-300 flex items-center justify-between ${
                        isCategorySelected(category.name) 
                          ? 'bg-pink-600 text-white shadow-md' 
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span>{category.name}</span>
                      {category.submenu?.length > 0 && (
                        <svg
                          className={`w-4 h-4 transform transition-transform duration-300 ${
                            expandedCategories[category.name] ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </button>
                    <AnimatePresence>
                    {expandedCategories[category.name] && category.submenu && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="ml-4 mt-2 space-y-2 overflow-hidden"
                        >
                        {category.submenu.map((sub) => (
                          <div key={sub.name}>
                            <button
                              onClick={() => {
                                handleCategoryClick(category.name, sub.name);
                                if (sub.items?.length > 0) {
                                  toggleCategory(sub.name);
                                }
                              }}
                                className={`w-full text-left px-4 py-2 rounded-xl transition-all duration-300 flex items-center justify-between ${
                                  isCategorySelected(category.name, sub.name) 
                                    ? 'bg-pink-600 text-white shadow-md' 
                                    : 'text-gray-600 hover:bg-gray-50'
                              }`}
                            >
                              <span>{sub.name}</span>
                              {sub.items?.length > 0 && (
                                <svg
                                    className={`w-4 h-4 transform transition-transform duration-300 ${
                                    expandedCategories[sub.name] ? 'rotate-180' : ''
                                  }`}
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              )}
                            </button>
                              <AnimatePresence>
                            {expandedCategories[sub.name] && sub.items && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="ml-4 mt-2 space-y-2 overflow-hidden"
                                  >
                                {sub.items.map((item) => (
                                  <button
                                    key={item}
                                    onClick={() => handleCategoryClick(category.name, sub.name, item)}
                                        className={`w-full text-left px-4 py-2 rounded-xl transition-all duration-300 ${
                                          isCategorySelected(category.name, sub.name, item) 
                                            ? 'bg-pink-600 text-white shadow-md' 
                                            : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                  >
                                    {item}
                                  </button>
                                ))}
                                  </motion.div>
                            )}
                              </AnimatePresence>
                          </div>
                        ))}
                        </motion.div>
                    )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Range</h3>
              <Slider
                value={priceRange}
                onChange={handlePriceChange}
                valueLabelDisplay="auto"
                min={0}
                max={maxPrice}
                className="text-pink-600"
              />
              <div className="flex justify-between mt-2">
                <span className="text-sm text-gray-600">₹{priceRange[0].toLocaleString()}</span>
                <span className="text-sm text-gray-600">₹{priceRange[1].toLocaleString()}</span>
              </div>
            </div>

            {/* Sort By Filter */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sort By</h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-600 focus:border-transparent transition-all duration-300"
              >
                <option value="popularity">Popularity</option>
                <option value="latest">Latest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="alphabetical">Alphabetical</option>
              </select>
            </div>

            {/* Clear Filters Button */}
            {(selectedCategories.main || priceRange[0] > 0 || priceRange[1] < maxPrice || sortBy !== 'popularity') && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSelectedCategories({ main: null, sub: null, item: null });
                  setPriceRange([0, maxPrice]);
                  setSortBy('popularity');
                }}
                className="w-full bg-gray-100 text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-200 transition-all duration-300 shadow-sm"
              >
                Clear All Filters
              </motion.button>
            )}
          </motion.div>

          {/* Mobile Filters Sidebar */}
          <AnimatePresence>
            {isMobileFiltersOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 z-40 md:hidden"
                  onClick={() => setIsMobileFiltersOpen(false)}
                />
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 20 }}
                  className="fixed right-0 top-0 h-full w-80 bg-white z-50 p-6 overflow-y-auto md:hidden"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Filters</h2>
                    <button
                      onClick={() => setIsMobileFiltersOpen(false)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>
                  {/* Mobile Filters Content */}
                  <div className="space-y-6">
                    {/* Categories Filter */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Categories</h3>
                      <div className="space-y-2">
                        {dynamicCategories.map((category) => (
                          <div key={category.name}>
                            <button
                              onClick={() => {
                                handleCategoryClick(category.name);
                                if (category.submenu?.length > 0) {
                                  toggleCategory(category.name);
                                }
                              }}
                              className={`w-full text-left px-4 py-2 rounded-xl transition-all duration-300 flex items-center justify-between ${
                                isCategorySelected(category.name) 
                                  ? 'bg-pink-600 text-white shadow-md' 
                                  : 'text-gray-600 hover:bg-gray-50'
                              }`}
                            >
                              <span>{category.name}</span>
                              {category.submenu?.length > 0 && (
                                <svg
                                  className={`w-4 h-4 transform transition-transform duration-300 ${
                                    expandedCategories[category.name] ? 'rotate-180' : ''
                                  }`}
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              )}
                            </button>
                            <AnimatePresence>
                              {expandedCategories[category.name] && category.submenu && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="ml-4 mt-2 space-y-2 overflow-hidden"
                                >
                                  {category.submenu.map((sub) => (
                                    <div key={sub.name}>
                                      <button
                                        onClick={() => {
                                          handleCategoryClick(category.name, sub.name);
                                          if (sub.items?.length > 0) {
                                            toggleCategory(sub.name);
                                          }
                                        }}
                                        className={`w-full text-left px-4 py-2 rounded-xl transition-all duration-300 flex items-center justify-between ${
                                          isCategorySelected(category.name, sub.name) 
                                            ? 'bg-pink-600 text-white shadow-md' 
                                            : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                      >
                                        <span>{sub.name}</span>
                                        {sub.items?.length > 0 && (
                                          <svg
                                            className={`w-4 h-4 transform transition-transform duration-300 ${
                                              expandedCategories[sub.name] ? 'rotate-180' : ''
                                            }`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                          >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                          </svg>
                                        )}
                                      </button>
                                      <AnimatePresence>
                                        {expandedCategories[sub.name] && sub.items && (
                                          <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="ml-4 mt-2 space-y-2 overflow-hidden"
                                          >
                                            {sub.items.map((item) => (
                                              <button
                                                key={item}
                                                onClick={() => handleCategoryClick(category.name, sub.name, item)}
                                                className={`w-full text-left px-4 py-2 rounded-xl transition-all duration-300 ${
                                                  isCategorySelected(category.name, sub.name, item) 
                                                    ? 'bg-pink-600 text-white shadow-md' 
                                                    : 'text-gray-600 hover:bg-gray-50'
                                                }`}
                                              >
                                                {item}
                                              </button>
                                            ))}
                                          </motion.div>
                                        )}
                                      </AnimatePresence>
                                    </div>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Price Range Filter */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Price Range</h3>
                      <Slider
                        value={priceRange}
                        onChange={handlePriceChange}
                        valueLabelDisplay="auto"
                        min={0}
                        max={maxPrice}
                        className="text-pink-600"
                      />
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">₹{priceRange[0].toLocaleString()}</span>
                        <span className="text-sm text-gray-600">₹{priceRange[1].toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Sort By Filter */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Sort By</h3>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-600 focus:border-transparent transition-all duration-300"
                      >
                        <option value="popularity">Popularity</option>
                        <option value="latest">Latest</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="alphabetical">Alphabetical</option>
                      </select>
                    </div>

                    {/* Clear Filters Button */}
                    {(selectedCategories.main || priceRange[0] > 0 || priceRange[1] < maxPrice || sortBy !== 'popularity') && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setSelectedCategories({ main: null, sub: null, item: null });
                          setPriceRange([0, maxPrice]);
                          setSortBy('popularity');
                        }}
                        className="w-full bg-gray-100 text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-200 transition-all duration-300 shadow-sm"
                      >
                        Clear All Filters
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                <Loader size="large" text="Loading products..." />
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                <svg className="w-12 h-12 text-red-500 mb-4" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path fill="currentColor" d="M15 9l-6 6m0-6l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-lg text-red-600">{error}</span>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-12 px-4 bg-white rounded-2xl shadow-sm border border-gray-100"
              >
                <svg
                  className="w-16 h-16 text-gray-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Available</h3>
                <p className="text-gray-600 text-center mb-6">
                  {selectedCategories.main
                    ? "No products found matching your selected filters. Try adjusting your filters or browse other categories."
                    : "No products found in this category. Please check back later or browse other categories."}
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSelectedCategories({ main: null, sub: null, item: null });
                    setPriceRange([0, 100000]);
                    setSortBy('popularity');
                  }}
                  className="px-6 py-3 bg-pink-600 text-white rounded-xl hover:bg-pink-700 transition-colors shadow-lg"
                >
                  Clear All Filters
                </motion.button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop; 