import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HeartIcon, ShoppingCartIcon, EyeIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import config from '../../config/config.js';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function WeeklyBestsellers() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(config.API_URLS.BESTSELLER);
        if (!res.ok) throw new Error('Failed to fetch bestseller products');
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error('Error fetching bestseller products:', err);
        setError(err.message || 'Error fetching bestseller products');
        // Set empty array to prevent crashes
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = useMemo(() => ['All', ...new Set(products.map(product => product.category))], [products]);

  const filteredProducts = useMemo(() => {
    let filtered = selectedCategory === 'All' 
      ? products 
      : products.filter(product => product.category === selectedCategory);
    
    // Limit products on mobile devices
    if (isMobile) {
      filtered = filtered.slice(0, 4);
    }
    
    return filtered;
  }, [selectedCategory, products, isMobile]);

  const handleCategoryChange = (category) => {
    setLoading(true);
    setSelectedCategory(category);
    setTimeout(() => {
      setLoading(false);
    }, 300);
  };

  // If there are no products, don't render the section
  if (!loading && products.length === 0) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8 md:py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (error) {
    // Don't show error, just return null to not break the page
    return null;
  }

  return (
    <section className="py-8 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-12 lg:mb-16"
        >
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-light tracking-tight text-gray-900 mb-4 md:mb-6">
              Weekly <span className="font-serif italic">Bestsellers</span>
            </h2>
            <p className="text-gray-600 text-sm md:text-base lg:text-lg leading-relaxed mb-6 md:mb-8 max-w-2xl mx-auto">
              The most popular handcrafted pieces that customers can't stop talking about
            </p>
            <div className="w-16 md:w-20 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600 mx-auto"></div>
          </div>
        </motion.div>

        {/* Category Filter */}
        {categories.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-center mb-8 md:mb-12"
          >
            <div className="flex flex-wrap justify-center gap-2 md:gap-4">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 md:px-6 py-2 md:py-3 rounded-full text-sm md:text-base font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-orange-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Products Grid */}
        <div className="flex justify-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className={`grid gap-3 md:gap-6 lg:gap-8 max-w-7xl ${
              isMobile 
                ? 'grid-cols-2 gap-3' 
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            }`}
          >
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                variants={itemVariants}
                className={`group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 ${
                  isMobile ? 'w-full' : ''
                }`}
              >
                <Link to={`/product/${product.id}`} className="block">
                  <div className="relative overflow-hidden">
                    <div className={`overflow-hidden ${
                      isMobile ? 'aspect-square' : 'aspect-[4/3]'
                    }`}>
                      <img
                        src={config.fixImageUrl(product.image)}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={e => {
                          e.target.onerror = null;
                          e.target.src = 'https://placehold.co/400x400/e2e8f0/475569?text=Product+Image';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>
                  
                  <div className={`${isMobile ? 'p-4' : 'p-5 md:p-6'}`}>
                    <div className="mb-3 md:mb-4">
                      <p className={`text-gray-500 ${isMobile ? 'text-xs' : 'text-sm'} font-medium uppercase tracking-wide`}>
                        {product.category}
                      </p>
                    </div>
                    
                    <h3 className={`font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2 ${
                      isMobile ? 'text-sm md:text-base mb-3 leading-tight' : 'text-lg mb-4'
                    }`}>
                      {product.name}
                    </h3>
                    
                    {!isMobile && (
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed">{product.description}</p>
                    )}
                    
                    <div className={`flex items-center justify-between pt-3 md:pt-4 border-t border-gray-100 ${
                      isMobile ? 'flex-col items-start gap-2 md:gap-3' : ''
                    }`}>
                      <span className={`font-bold text-orange-600 ${
                        isMobile ? 'text-base md:text-lg' : 'text-lg'
                      }`}>
                        ₹{product.price?.toFixed(2)}
                      </span>
                      
                      {/* Add to Cart Button - Always Visible */}
                      <button className={`bg-gradient-to-r from-orange-600 to-orange-700 text-white font-semibold hover:from-orange-700 hover:to-orange-800 transition-all duration-300 shadow-lg hover:shadow-xl ${
                        isMobile 
                          ? 'w-full py-2.5 md:py-3 rounded-xl text-xs md:text-sm' 
                          : 'px-6 py-2 rounded-xl text-sm'
                      }`}>
                        <div className="flex items-center justify-center gap-2">
                          <ShoppingCartIcon className={isMobile ? "h-3 w-3 md:h-4 md:w-4" : "h-4 w-4"} />
                          Add to Cart
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Hover Effect Border */}
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-orange-200 rounded-2xl transition-colors duration-300 pointer-events-none" />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
        
        {/* Show "View More" button on mobile if there are more products */}
        {isMobile && products.length > 4 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-8 md:mt-12"
          >
            <div className="max-w-md mx-auto">
              <p className="text-gray-600 text-sm mb-4 md:mb-6">
                Discover more bestseller products in our collection
              </p>
              <Link 
                to="/shop" 
                className="inline-flex items-center px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-xl font-semibold hover:from-orange-700 hover:to-orange-800 transition-all duration-300 text-sm shadow-lg hover:shadow-xl"
              >
                View More Products
                <svg 
                  className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
} 