import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { HeartIcon, ShoppingCartIcon, EyeIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

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
  const [mostLovedProducts, setMostLovedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLoved = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('/api/loved');
        if (!res.ok) throw new Error('Failed to fetch most loved products');
        const data = await res.json();
        setMostLovedProducts(data);
      } catch (err) {
        setError(err.message || 'Error fetching most loved products');
      } finally {
        setLoading(false);
      }
    };
    fetchLoved();
  }, []);

  if (loading) {
    return <div className="py-24 text-center">Loading most loved products...</div>;
  }
  if (error) {
    return <div className="py-24 text-center text-red-600">{error}</div>;
  }

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
                    <span className="text-lg sm:text-xl font-semibold text-orange-600">₹{product.price?.toFixed(2)}</span>
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