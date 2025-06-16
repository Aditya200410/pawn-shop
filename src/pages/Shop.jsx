import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Slider } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartIcon, ShoppingCartIcon, EyeIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { products } from '../data/products';
import { categories } from '../data/categories';

const Shop = () => {
  const location = useLocation();
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [selectedCategories, setSelectedCategories] = useState({
    main: null,
    sub: null,
    item: null
  });
  const [expandedCategories, setExpandedCategories] = useState({});
  const [sortBy, setSortBy] = useState('popularity');
  const [viewMode, setViewMode] = useState(16);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

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
  }, [priceRange, selectedCategories, sortBy]);

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
        filtered.sort((a, b) => b.popularity - a.popularity);
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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12"
    >
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
                {categories.map((category) => (
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
                          ? 'bg-amber-600 text-white shadow-md' 
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
                                    ? 'bg-amber-600 text-white shadow-md' 
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
                                            ? 'bg-amber-600 text-white shadow-md' 
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
                max={100000}
                className="text-amber-600"
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
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent transition-all duration-300"
              >
                <option value="popularity">Popularity</option>
                <option value="latest">Latest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            {/* Clear Filters Button */}
            {(selectedCategories.main || priceRange[0] > 0 || priceRange[1] < 100000 || sortBy !== 'popularity') && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSelectedCategories({ main: null, sub: null, item: null });
                  setPriceRange([0, 100000]);
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
                        {categories.map((category) => (
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
                                  ? 'bg-amber-600 text-white shadow-md' 
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
                                            ? 'bg-amber-600 text-white shadow-md' 
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
                                                    ? 'bg-amber-600 text-white shadow-md' 
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
                        max={100000}
                        className="text-amber-600"
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
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent transition-all duration-300"
                      >
                        <option value="popularity">Popularity</option>
                        <option value="latest">Latest</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                      </select>
                    </div>

                    {/* Clear Filters Button */}
                    {(selectedCategories.main || priceRange[0] > 0 || priceRange[1] < 100000 || sortBy !== 'popularity') && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setSelectedCategories({ main: null, sub: null, item: null });
                          setPriceRange([0, 100000]);
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
            {filteredProducts.length > 0 ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    variants={itemVariants}
                    className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                  >
                    <Link to={`/product/${product.id}`} className="block">
                      <div className="relative overflow-hidden">
                        <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://placehold.co/400x400/e2e8f0/475569?text=Product+Image';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          {product.outOfStock && (
                            <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                              Out of Stock
                            </div>
                          )}
                        </div>
                        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-lg"
                          >
                            <HeartIcon className="h-5 w-5 text-gray-700" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-lg"
                          >
                            <ShoppingCartIcon className="h-5 w-5 text-gray-700" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-lg"
                          >
                            <EyeIcon className="h-5 w-5 text-gray-700" />
                          </motion.button>
                        </div>
                      </div>
                      <div className="p-6">
                        <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                        <h3 className="text-lg font-medium text-gray-900 mb-3 line-clamp-2">{product.name}</h3>
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-semibold text-amber-600">₹{product.price.toFixed(2)}</span>
                          <div className="flex items-center">
                            <span className="text-sm text-gray-500 mr-1">Rating:</span>
                            <span className="text-amber-600">{product.popularity}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
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
                  className="px-6 py-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors shadow-lg"
                >
                  Clear All Filters
                </motion.button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Shop; 