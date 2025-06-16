import React from 'react';
import { motion } from 'framer-motion';
import { HeartIcon, ShoppingCartIcon, EyeIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

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
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="mb-16">
          <h2 className="text-4xl font-light tracking-tight text-gray-900 mb-4">
            Most <span className="font-serif italic">Loved</span>
          </h2>
          <div className="w-24 h-1 bg-amber-800"></div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
        >
          {mostLovedProducts.map((product) => (
            <motion.div
              key={product.id}
              variants={itemVariants}
              className="group bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
            >
              <Link to={`/product/${product.id}`} className="block">
                <div className="relative overflow-hidden rounded-t-lg">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain group-focus:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 md:opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300" />
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
                    
                  </div>
                </div>
                <div className="p-4 sm:p-6">
                  <p className="text-sm text-gray-500 mb-1">{product.category}</p>
                  <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 line-clamp-2">{product.description}</p>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                    <span className="text-lg sm:text-xl font-semibold text-orange-600">₹{product.price.toFixed(2)}</span>
                    <button className="w-full sm:w-auto px-4 py-2 bg-orange-600 text-white rounded-full hover:bg-orange-700 transition-colors text-sm sm:text-base">
                      Add to cart
                    </button>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
} 