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
    description: 'Traditional Bankura horse, handcrafted by skilled artisans'
  },
  {
    id: 2,
    name: 'Terracotta Fighting Bull',
    category: 'Terracotta',
    price: 56.63,
    image: 'https://srejonee.com/wp-content/uploads/2025/05/MG_9785-300x300.jpg',
    description: 'Majestic fighting bull sculpture, a symbol of strength and tradition'
  },
  {
    id: 3,
    name: 'Terracotta Yellow Horse',
    category: 'Terracotta',
    price: 9.06,
    originalPrice: 10.00,
    image: 'https://srejonee.com/wp-content/uploads/2025/05/MG_9782-300x300.jpg',
    discount: 10,
    description: 'Vibrant yellow Bankura horse, perfect for modern interiors'
  },
  {
    id: 4,
    name: 'Terracotta Blue Horse',
    category: 'Terracotta',
    price: 6.04,
    image: 'https://srejonee.com/wp-content/uploads/2025/05/MG_9779-600x600.jpg',
    description: 'Elegant blue Bankura horse, adds a touch of sophistication'
  },
  {
    id: 5,
    name: 'Metal Wall Art',
    category: 'Metal',
    price: 29.99,
    image: 'https://srejonee.com/wp-content/uploads/2025/05/MG_9788-300x300.jpg',
    description: 'Intricate metal wall decoration, showcasing traditional patterns'
  },
  {
    id: 6,
    name: 'Wooden Sculpture',
    category: 'Wood',
    price: 45.00,
    originalPrice: 55.00,
    image: 'https://srejonee.com/wp-content/uploads/2025/05/MG_9785-300x300.jpg',
    discount: 15,
    description: 'Hand-carved wooden sculpture, a masterpiece of craftsmanship'
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
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-16">
          <h2 className="text-4xl font-light tracking-tight text-gray-900 mb-4">
            Weekly <span className="font-serif italic">Bestsellers</span>
          </h2>
          <div className="w-24 h-1 bg-amber-800"></div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              variants={itemVariants}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
            >
              <Link to={`/product/${product.id}`} className="block">
                <div className="relative overflow-hidden">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain group-focus:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 md:opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300" />
                    {product.discount && (
                      <div className="absolute top-4 left-4 bg-amber-800 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {product.discount}% OFF
                      </div>
                    )}
                  </div>
                  <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 md:opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300">
                    <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                   
                    </button>
                    <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                     
                    </button>
                    <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                      
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 opacity-100 md:opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-all duration-300 transform translate-y-0 md:translate-y-full group-hover:translate-y-0 group-focus:translate-y-0">
                    <button className="w-3/4 mx-auto bg-orange-600 text-white py-3 rounded-full font-semibold hover:bg-orange-700 transition-colors flex items-center justify-center gap-2">
                      <ShoppingCartIcon className="h-5 w-5" />
                      Add to Cart
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-amber-800 transition-colors">
                      {product.name}
                    </h3>
                    <div className="text-right">
                      <span className="text-lg font-bold text-amber-800">${product.price}</span>
                      {product.originalPrice && (
                        <span className="block text-sm text-gray-500 line-through">${product.originalPrice}</span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">{product.category}</p>
                  <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
} 