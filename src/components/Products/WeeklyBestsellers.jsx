import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { HeartIcon, ShoppingCartIcon, EyeIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const bestsellers = [
  {
    id: 1,
    name: 'Terracotta Bankura Horse',
    category: 'Terracotta',
    price: 4.91,
    originalPrice: 6.00,
    image: 'https://srejonee.com/wp-content/uploads/2025/05/MG_9788-300x300.jpg',
    discount: 20,
  },
  {
    id: 2,
    name: 'Terracotta Fighting Bull',
    category: 'Terracotta',
    price: 56.63,
    image: 'https://srejonee.com/wp-content/uploads/2025/05/MG_9785-300x300.jpg',
  },
  {
    id: 3,
    name: 'Terracotta Yellow Horse',
    category: 'Terracotta',
    price: 9.06,
    originalPrice: 10.00,
    image: 'https://srejonee.com/wp-content/uploads/2025/05/MG_9782-300x300.jpg',
    discount: 10,
  },
  {
    id: 4,
    name: 'Terracotta Blue Horse',
    category: 'Terracotta',
    price: 6.04,
    image: 'https://srejonee.com/wp-content/uploads/2025/05/MG_9779-600x600.jpg',
  },
  {
    id: 5,
    name: 'Metal Wall Art',
    category: 'Metal',
    price: 29.99,
    image: 'https://srejonee.com/wp-content/uploads/2025/05/MG_9788-300x300.jpg',
  },
  {
    id: 6,
    name: 'Wooden Sculpture',
    category: 'Wood',
    price: 45.00,
    originalPrice: 55.00,
    image: 'https://srejonee.com/wp-content/uploads/2025/05/MG_9785-300x300.jpg',
    discount: 15,
  },
  {
    id: 7,
    name: 'Bamboo Basket',
    category: 'Bamboo',
    price: 19.99,
    image: 'https://srejonee.com/wp-content/uploads/2025/05/MG_9782-300x300.jpg',
  },
  {
    id: 8,
    name: 'Metal Decorative Piece',
    category: 'Metal',
    price: 34.99,
    originalPrice: 39.99,
    image: 'https://srejonee.com/wp-content/uploads/2025/05/MG_9779-600x600.jpg',
    discount: 12,
  },
];

// Extract unique categories from products
const categories = ['All', ...new Set(bestsellers.map(product => product.category))];

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

export default function WeeklyBestsellers() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(false);

  // Memoize filtered products to prevent unnecessary recalculations
  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'All') {
      return bestsellers;
    }
    return bestsellers.filter(product => product.category === selectedCategory);
  }, [selectedCategory]);

  const handleCategoryChange = (category) => {
    setIsLoading(true);
    setSelectedCategory(category);
    // Simulate loading state for better UX
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-gray-900"
          >
            Weekly bestsellers
          </motion.h2>
          <div className="flex flex-wrap justify-center gap-2 mt-4 md:mt-0">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                disabled={isLoading}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                  selectedCategory === category
                    ? 'bg-amber-800 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-800"></div>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  variants={itemVariants}
                  className="group bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300"
                >
                  <Link to={`/product/${product.id}`} className="block">
                    <div className="relative overflow-hidden rounded-t-lg">
                      {product.discount && (
                        <div className="absolute top-2 left-2 bg-amber-800 text-white px-2 py-1 rounded text-sm font-medium">
                          -{product.discount}%
                        </div>
                      )}
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white bg-opacity-90 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <div className="flex justify-center space-x-4">
                          <button className="p-2 text-gray-600 hover:text-amber-800 transition-colors">
                            <HeartIcon className="h-5 w-5" />
                          </button>
                          <button className="p-2 text-gray-600 hover:text-amber-800 transition-colors">
                            <ShoppingCartIcon className="h-5 w-5" />
                          </button>
                          <button className="p-2 text-gray-600 hover:text-amber-800 transition-colors">
                            <EyeIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-gray-500 mb-1">{product.category}</p>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">{product.name}</h3>
                      <div className="flex items-center">
                        {product.originalPrice ? (
                          <>
                            <span className="text-lg font-semibold text-amber-800">${product.price.toFixed(2)}</span>
                            <span className="ml-2 text-sm text-gray-500 line-through">${product.originalPrice.toFixed(2)}</span>
                          </>
                        ) : (
                          <span className="text-lg font-semibold text-amber-800">${product.price.toFixed(2)}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">No products found in this category.</p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
} 