import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import config from '../../config/config.js';
import { categories as staticCategories } from '../../data/categories.js';

const containerVariants = {
  hidden: {},
  visible: {
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

// Static category images mapping
const categoryImages = {
  "Wooden Craft": "/images/categories/wooden-craft.jpg",
  "Terracotta Items": "/images/categories/terracotta.jpg", 
  "Dokra Art": "/images/categories/dokra-art.jpg",
  "Handmade Jewellery": "/images/categories/jewellery.jpg"
};

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(config.API_URLS.CATEGORIES);
      // The response data is in the format { categories: [...] }
      const apiCategories = response.data.categories || [];
      setCategories(apiCategories);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Fallback to static categories
      const fallbackCategories = staticCategories.map(category => ({
        id: category.name.toLowerCase().replace(/\s+/g, '-'),
        name: category.name,
        image: categoryImages[category.name] || '/images/categories/default.jpg'
      }));
      setCategories(fallbackCategories);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8 md:py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 md:py-16">
        <div className="text-red-500 text-lg font-medium">{error}</div>
      </div>
    );
  }

  return (
    <section className="py-6 md:py-10 lg:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6 md:mb-8 lg:mb-10"
        >
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-light tracking-tight text-gray-900 mb-3 md:mb-4">
              <span className="font-serif italic">Our Categories</span>
            </h2>
            <p className="text-gray-600 text-sm md:text-base lg:text-lg leading-relaxed mb-4 md:mb-6 max-w-2xl mx-auto">
              Discover our carefully curated collection of handcrafted treasures, each piece telling a unique story of craftsmanship and tradition
            </p>
            <div className="w-16 md:w-20 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600 mx-auto"></div>
          </div>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3 md:gap-6 lg:gap-8 max-w-6xl mx-auto"
        >
          {categories.map((category, index) => (
            <Link
              key={category.id || index}
              to="/shop"
              state={{ selectedCategory: { main: category.name } }}
              className="group"
            >
              <motion.div
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
                className="relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 aspect-square"
              >
                {/* Category Title - Above Image */}
                <div className="absolute top-0 left-0 right-0 z-10 p-3 bg-gradient-to-b from-black/80 to-transparent">
                  <h3 className="text-sm font-semibold text-white text-center line-clamp-2 leading-tight">
                    {category.name}
                  </h3>
                </div>

                {/* Image Container */}
                <div className="relative w-full h-full overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-500"
                    onError={e => {
                      e.target.onerror = null;
                      e.target.src = 'https://placehold.co/400x400/e2e8f0/475569?text=' + encodeURIComponent(category.name);
                    }}
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Bottom Overlay with Explore Text */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-xs text-white font-medium">
                        Explore
                      </span>
                      <svg 
                        className="w-3 h-3 text-white group-hover:translate-x-0.5 transition-transform duration-200" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Hover Effect Border */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-orange-200 rounded-2xl transition-colors duration-300 pointer-events-none" />
              </motion.div>
            </Link>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-6 md:mt-8 lg:mt-10"
        >
          <div className="max-w-md mx-auto">
            <p className="text-gray-600 text-sm md:text-base mb-4 md:mb-6">
              Ready to explore our complete collection?
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center px-6 md:px-8 py-3 md:py-4 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-all duration-300 group shadow-lg hover:shadow-xl"
            >
              View All Products
              <svg 
                className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Categories;
