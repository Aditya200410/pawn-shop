import React, { useState, useEffect, useMemo } from 'react';
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

// Cache for products data
let productsCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
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
        // Check cache first
        if (productsCache && cacheTimestamp && (Date.now() - cacheTimestamp) < CACHE_DURATION) {
          setProducts(productsCache);
          setLoading(false);
          return;
        }

        setLoading(true);
        setError(null);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const res = await fetch(`${config.API_URLS.SHOP}/section/featured`, {
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!res.ok) throw new Error('Failed to fetch featured products');
        const data = await res.json();
        
        // Cache the data
        productsCache = Array.isArray(data) ? data : data.products || [];
        cacheTimestamp = Date.now();
        
        setProducts(Array.isArray(data) ? data : data.products || []);
      } catch (err) {
        console.error('Error fetching featured products:', err);
        setError(err.message || 'Error fetching featured products');
        // Set empty array to prevent crashes
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Memoize displayed products to prevent unnecessary re-renders
  const displayedProducts = useMemo(() => {
    return isMobile ? products.slice(0, 4) : products;
  }, [products, isMobile]);

  // If there are no products, don't render the section
  if (!loading && products.length === 0) {
    return null;
  }

  if (loading) {
    return (
      <section className="py-6 md:py-10 lg:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 md:mb-8 lg:mb-10">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-light tracking-tight text-gray-900 mb-3 md:mb-4">
              Featured <span className="font-serif italic">Products</span>
            </h2>
          </div>
          <div className="flex items-center justify-center py-8 md:py-16">
            <Loader size="large" text="Loading featured products..." />
          </div>
        </div>
      </section>
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
            Featured <span className="font-serif italic">Products</span>
          </h2>
            <p className="text-gray-600 text-sm md:text-base lg:text-lg leading-relaxed mb-4 md:mb-6 max-w-2xl mx-auto">
              Discover our handpicked collection of exceptional handcrafted pieces, each telling a unique story of artistry and tradition
            </p>
            <div className="w-16 md:w-20 h-0.5 bg-gradient-to-r from-pink-500 to-pink-600 mx-auto"></div>
        </div>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6"
        >
            {displayedProducts.map((product) => (
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
            className="text-center mt-8 md:mt-12"
          >
            <Link
              to="/shop"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              View More Products
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
} 