import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HeartIcon, ShoppingCartIcon, EyeIcon } from '@heroicons/react/24/outline';
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
        setLoading(true);
        setError(null);
        const res = await fetch(config.API_URLS.FEATURED_PRODUCTS);
        if (!res.ok) throw new Error('Failed to fetch featured products');
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setError(err.message || 'Error fetching featured products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Limit products on mobile devices
  const displayedProducts = isMobile ? products.slice(0, 6) : products;

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
              Featured <span className="font-serif italic">Products</span>
            </h2>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
              Discover our handpicked collection of exceptional handcrafted pieces, each telling a unique story of artistry and tradition
            </p>
            <div className="w-20 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600 mx-auto"></div>
          </div>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className={`grid gap-6 md:gap-8 max-w-7xl mx-auto ${
            isMobile 
              ? 'grid-cols-2 sm:grid-cols-2' 
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
          }`}
        >
          {displayedProducts.map((product) => (
            <motion.div
              key={product.id}
              variants={itemVariants}
              className={`group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 ${
                isMobile ? 'max-w-[180px] mx-auto' : ''
              }`}
            >
              <Link to={`/product/${product.id}`} className="block">
                <div className="relative overflow-hidden">
                  <div className={`overflow-hidden ${
                    isMobile ? 'aspect-square' : 'aspect-[4/3]'
                  }`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  
                  {/* Mobile: Show quick action buttons */}
                  {isMobile && (
                    <div className="absolute top-3 left-3">
                      <button className="p-1.5 bg-white/95 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-sm">
                        <HeartIcon className="h-3 w-3 text-gray-600" />
                      </button>
                    </div>
                  )}
                  
                  {/* Desktop: Show action buttons */}
                  {!isMobile && (
                    <>
                      <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button className="p-2 bg-white/95 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-sm">
                          <HeartIcon className="h-4 w-4 text-gray-600" />
                        </button>
                        <button className="p-2 bg-white/95 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-sm">
                          <EyeIcon className="h-4 w-4 text-gray-600" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
                
                <div className={`${isMobile ? 'p-4' : 'p-6'}`}>
                  <div className={`${isMobile ? 'mb-2' : 'mb-3'}`}>
                    <p className={`text-gray-500 ${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>
                      {product.category}
                    </p>
                  </div>
                  
                  <h3 className={`font-semibold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2 ${
                    isMobile ? 'text-sm mb-3' : 'text-lg mb-3'
                  }`}>
                    {product.name}
                  </h3>
                  
                  {!isMobile && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed">{product.description}</p>
                  )}
                  
                  <div className={`flex items-center justify-between pt-3 border-t border-gray-100 ${
                    isMobile ? 'flex-col items-start gap-2' : ''
                  }`}>
                    <span className={`font-bold text-orange-600 ${
                      isMobile ? 'text-sm' : 'text-lg'
                    }`}>
                      ₹{product.price?.toFixed(2)}
                    </span>
                    
                    {/* Add to Cart Button - Always Visible */}
                    <button className={`bg-orange-600 text-white font-medium hover:bg-orange-700 transition-colors shadow-sm ${
                      isMobile 
                        ? 'w-full py-2 rounded-lg text-xs' 
                        : 'px-4 py-2 rounded-lg text-sm'
                    }`}>
                      <div className="flex items-center justify-center gap-2">
                        <ShoppingCartIcon className={isMobile ? "h-3 w-3" : "h-4 w-4"} />
                        Add to Cart
                      </div>
                    </button>
                  </div>
                </div>

                {/* Hover Effect Border */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-orange-200 rounded-xl transition-colors duration-300 pointer-events-none" />
              </Link>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Show "View More" button on mobile if there are more products */}
        {isMobile && products.length > 6 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <div className="max-w-md mx-auto">
              <p className="text-gray-600 text-sm mb-4">
                Discover more featured products in our collection
              </p>
              <Link 
                to="/shop" 
                className="inline-flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-all duration-300 text-sm shadow-lg hover:shadow-xl"
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