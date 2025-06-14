import React from 'react';
import { motion } from 'framer-motion';
import { HeartIcon, ShoppingCartIcon, EyeIcon } from '@heroicons/react/24/outline';

const mostLovedProducts = [
  {
    id: 1,
    name: 'Curve Chair',
    category: 'Chairs',
    price: 320.00,
    description: 'Soft curves and tapering slender lines are inspired by modern design. The result is a classic yet contemporary chair, ideally combined with the table by the same name.',
    image: 'https://srejonee.com/wp-content/uploads/2025/05/MG_9788-300x300.jpg',
  },
  {
    id: 2,
    name: 'Palissade Sofa',
    category: 'Sofas',
    price: 1890.00,
    description: 'The slender organic forms are fluid and graceful. Noguchi emphasises the lightness of the elements with thin yet comfortable upholstery and a choice of cover fabrics in natural colours.',
    image: 'https://srejonee.com/wp-content/uploads/2025/05/MG_9785-300x300.jpg',
  },
  {
    id: 3,
    name: 'Aruda Table',
    category: 'Tables',
    price: 699.00,
    description: 'A new classic for the contemporary dining room, the Mondrian table reinterprets the light and elegant design of the sofa and coffee table collection of the same name.',
    image: 'https://srejonee.com/wp-content/uploads/2025/05/MG_9782-300x300.jpg',
  },
];

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

export default function MostLoved() {
  return (
    <section className="py-16 bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-gray-900 mb-4"
          >
            Most Loved Products
          </motion.h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our most cherished pieces that have captured the hearts of our customers
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {mostLovedProducts.map((product) => (
            <motion.div
              key={product.id}
              variants={itemVariants}
              className="group bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
            >
              <div className="relative overflow-hidden rounded-t-lg">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-white bg-opacity-90 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <div className="flex justify-center space-x-4">
                    <button className="p-2 text-gray-600 hover:text-pink-500 transition-colors">
                      <HeartIcon className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-pink-500 transition-colors">
                      <ShoppingCartIcon className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-pink-500 transition-colors">
                      <EyeIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-500 mb-1">{product.category}</p>
                <h3 className="text-xl font-medium text-gray-900 mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-semibold text-pink-500">₹{product.price.toFixed(2)}</span>
                  <button className="px-4 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors">
                    Add to cart
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
} 