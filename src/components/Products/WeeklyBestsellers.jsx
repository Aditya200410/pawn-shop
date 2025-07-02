import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import config from '../../config/config.js';
import Loader from '../Loader';
import ProductCard from '../ProductCard/ProductCard.jsx';

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
        const res = await fetch(`${config.API_URLS.SHOP}/section/bestsellers`);
        if (!res.ok) throw new Error('Failed to fetch bestseller products');
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : data.products || []);
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
        <Loader size="large" text="Loading bestsellers..." />
      </div>
    );
  }

  if (error) {
    // Don't show error, just return null to not break the page
    return null;
  }

  return (
    <section className="py-6 md:py-10 lg:py-12">
      <div className="container mx-auto px-2 sm:px-4 lg:px-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6 md:mb-8 lg:mb-10"
        >
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-light tracking-tight text-gray-900 mb-3 md:mb-4">
              Weekly <span className="font-serif italic">Bestsellers</span>
            </h2>
            <p className="text-gray-600 text-sm md:text-base lg:text-lg leading-relaxed mb-4 md:mb-6 max-w-2xl mx-auto">
              The most popular handcrafted pieces that customers can't stop talking about
            </p>
            <div className="w-16 md:w-20 h-0.5 bg-gradient-to-r from-[#8f3a61]-500 to-[#8f3a61]-600 mx-auto"></div>
          </div>
        </motion.div>

        {/* Category Filter */}
        {categories.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-center mb-6 md:mb-8"
          >
            <div className="flex flex-wrap justify-center gap-2 md:gap-4">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 md:px-6 py-2 md:py-3 rounded-full text-sm md:text-base font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-[#8f3a61] text-white shadow-lg'
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
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6"
        >
          {filteredProducts.map((product) => (
            <motion.div key={product.id} variants={itemVariants}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
        
        {/* Show "View More" button on mobile if there are more products */}
        {isMobile && products.length > 4 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-6 md:mt-8"
          >
            <div className="max-w-md mx-auto">
              <p className="text-gray-600 text-sm mb-4 md:mb-6">
                Discover more bestseller products in our collection
              </p>
              <Link 
                to="/shop" 
                className="inline-flex items-center px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-[#8f3a61]-600 to-[#8f3a61]-700 text-white rounded-xl font-semibold hover:from-[#8f3a61]-700 hover:to-[#8f3a61]-800 transition-all duration-300 text-sm shadow-lg hover:shadow-xl"
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