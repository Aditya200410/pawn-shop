import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import config from '../../config/config.js';

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
      setCategories(response.data.categories || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to load categories');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="text-red-500 text-lg font-medium">{error}</div>
      </div>
    );
  }

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 md:mb-20"
        >
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-light tracking-tight text-gray-900 mb-6">
              <span className="font-serif italic">Our Categories</span>
            </h2>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
              Discover our carefully curated collection of handcrafted treasures, each piece telling a unique story of craftsmanship and tradition
            </p>
            <div className="w-20 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600 mx-auto"></div>
          </div>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto"
        >
          {categories.map((category, index) => (
            <Link
              key={category.id}
              to="/shop"
              state={{ selectedCategory: { main: category.name } }}
              className="group"
            >
              <motion.div
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
                className="relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold bg-white/95 text-gray-800 backdrop-blur-sm shadow-sm">
                      {index + 1}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-1 group-hover:text-orange-600 transition-colors duration-200">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed">
                    {category.description}
                  </p>
                  
                  {/* View More Button */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <span className="text-sm text-orange-600 font-medium group-hover:text-orange-700 transition-colors duration-200">
                      Explore Collection
                    </span>
                    <svg 
                      className="w-5 h-5 text-orange-600 group-hover:translate-x-1 transition-transform duration-200" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>

                {/* Hover Effect Border */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-orange-200 rounded-xl transition-colors duration-300 pointer-events-none" />
              </motion.div>
            </Link>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16 md:mt-20"
        >
          <div className="max-w-md mx-auto">
            <p className="text-gray-600 text-sm md:text-base mb-6">
              Ready to explore our complete collection?
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center px-8 py-4 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-all duration-300 group shadow-lg hover:shadow-xl"
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
