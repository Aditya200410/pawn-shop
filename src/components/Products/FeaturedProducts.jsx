import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HeartIcon, ShoppingCartIcon, EyeIcon } from '@heroicons/react/24/outline';

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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('https://pawnbackend-xmqa.onrender.com/api/featured-products');
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

  if (loading) {
    return <div className="py-24 text-center">Loading featured products...</div>;
  }
  if (error) {
    return <div className="py-24 text-center text-red-600">{error}</div>;
  }

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="mb-16">
          <h2 className="text-4xl font-light tracking-tight text-gray-900 mb-4">
            Featured <span className="font-serif italic">Products</span>
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
          {products.map((product) => (
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
                      className="w-full h-full object-contain  group-focus:scale-110 transition-transform duration-700"
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
                    <button className="w-3/4 mx-auto bg-orange-600 text-white py-3 rounded-full font-semibold hover:bg-orange-700 transition-colors flex items-center justify-center gap-2">
                      <ShoppingCartIcon className="h-5 w-5" />
                      Add to Cart
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-800 transition-colors">
                      {product.name}
                    </h3>
                    <span className="text-lg font-bold text-orange-800">${product.price}</span>
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