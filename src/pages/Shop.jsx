import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Slider } from '@mui/material';
import { motion } from 'framer-motion';
import { HeartIcon, ShoppingCartIcon, EyeIcon } from '@heroicons/react/24/outline';
import { products } from '../data/products';
import { categories } from '../data/categories';

const Shop = () => {
  const location = useLocation();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [selectedCategories, setSelectedCategories] = useState({
    main: null,
    sub: null,
    item: null
  });
  const [expandedCategories, setExpandedCategories] = useState({});
  const [sortBy, setSortBy] = useState('popularity');
  const [viewMode, setViewMode] = useState(16);

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
  }, [priceRange, selectedCategories, sortBy, viewMode]);

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

    setFilteredProducts(viewMode === -1 ? filtered : filtered.slice(0, viewMode));
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

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          {/* Filters */}
          <div className="w-full md:w-64 space-y-6">
            {/* Categories Filter */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
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
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center justify-between ${
                        isCategorySelected(category.name) ? 'bg-orange-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span>{category.name}</span>
                      {category.submenu?.length > 0 && (
                        <svg
                          className={`w-4 h-4 transform transition-transform ${
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
                    {expandedCategories[category.name] && category.submenu && (
                      <div className="ml-4 mt-2 space-y-2">
                        {category.submenu.map((sub) => (
                          <div key={sub.name}>
                            <button
                              onClick={() => {
                                handleCategoryClick(category.name, sub.name);
                                if (sub.items?.length > 0) {
                                  toggleCategory(sub.name);
                                }
                              }}
                              className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center justify-between ${
                                isCategorySelected(category.name, sub.name) ? 'bg-orange-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                              }`}
                            >
                              <span>{sub.name}</span>
                              {sub.items?.length > 0 && (
                                <svg
                                  className={`w-4 h-4 transform transition-transform ${
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
                            {expandedCategories[sub.name] && sub.items && (
                              <div className="ml-4 mt-2 space-y-2">
                                {sub.items.map((item) => (
                                  <button
                                    key={item}
                                    onClick={() => handleCategoryClick(category.name, sub.name, item)}
                                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                                      isCategorySelected(category.name, sub.name, item) ? 'bg-orange-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                                    }`}
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

            {/* Price Range Filter */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Range</h3>
              <Slider
                value={priceRange}
                onChange={handlePriceChange}
                valueLabelDisplay="auto"
                min={0}
                max={100000}
                className="text-orange-600"
              />
              <div className="flex justify-between mt-2">
                <span className="text-sm text-gray-600">₹{priceRange[0].toLocaleString()}</span>
                <span className="text-sm text-gray-600">₹{priceRange[1].toLocaleString()}</span>
              </div>
            </div>

            {/* Sort By Filter */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sort By</h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent"
              >
                <option value="popularity">Popularity</option>
                <option value="latest">Latest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            {/* Clear Filters Button */}
            {(selectedCategories.main || priceRange[0] > 0 || priceRange[1] < 100000 || sortBy !== 'popularity') && (
              <button
                onClick={() => {
                  setSelectedCategories({ main: null, sub: null, item: null });
                  setPriceRange([0, 100000]);
                  setSortBy('popularity');
                }}
                className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Clear All Filters
              </button>
            )}
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300"
                  >
                    <Link to={`/product/${product.id}`} className="block">
                      <div className="relative overflow-hidden rounded-t-lg">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        {product.outOfStock && (
                          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm">
                            Out of Stock
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300" />
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white bg-opacity-90 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                          <div className="flex justify-center space-x-4">
                            <button className="p-2 text-gray-600 hover:text-orange-600 transition-colors">
                              <HeartIcon className="h-5 w-5" />
                            </button>
                            <button className="p-2 text-gray-600 hover:text-orange-600 transition-colors">
                              <ShoppingCartIcon className="h-5 w-5" />
                            </button>
                            <button className="p-2 text-gray-600 hover:text-orange-600 transition-colors">
                              <EyeIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-sm text-gray-500 mb-1">{product.category}</p>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">{product.name}</h3>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-semibold text-orange-600">₹{product.price.toFixed(2)}</span>
                          <div className="flex items-center">
                            <span className="text-sm text-gray-500 mr-1">Rating:</span>
                            <span className="text-orange-600">{product.popularity}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-4 bg-white rounded-lg shadow-sm">
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
                <button
                  onClick={() => {
                    setSelectedCategories({ main: null, sub: null, item: null });
                    setPriceRange([0, 100000]);
                    setSortBy('popularity');
                  }}
                  className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop; 