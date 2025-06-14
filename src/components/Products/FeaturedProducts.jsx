import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HeartIcon, ShoppingCartIcon, EyeIcon } from '@heroicons/react/24/outline';

const products = [
  {
    id: 1,
    name: 'Terracotta Bankura Horse 6″',
    price: 4.91,
    image: 'https://srejonee.com/wp-content/uploads/2025/05/MG_9788-300x300.jpg',
  },
  {
    id: 2,
    name: 'Terracotta Fighting Bull Large',
    price: 56.63,
    image: 'https://srejonee.com/wp-content/uploads/2025/05/MG_9785-300x300.jpg',
  },
  {
    id: 3,
    name: 'Terracotta Yellow Bankura Horse 8″',
    price: 9.06,
    image: 'https://srejonee.com/wp-content/uploads/2025/05/MG_9782-300x300.jpg',
  },
  {
    id: 4,
    name: 'Terracotta Blue Bankura Horse 6″',
    price: 6.04,
    image: 'https://srejonee.com/wp-content/uploads/2025/05/MG_9779-600x600.jpg',
  },
  {
    id: 5,
    name: 'Terracotta Pink Bankura Horse 6″',
    price: 6.04,
    image: 'https://srejonee.com/wp-content/uploads/2025/05/MG_9791-300x300.jpg',
  },
  {
    id: 6,
    name: 'Terracotta Green Bankura Horse 6″',
    price: 6.04,
    image: 'https://srejonee.com/wp-content/uploads/2025/05/37-600x720-1-600x600.jpg',
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

export default function FeaturedProducts() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-center mb-12"
        >
          Featured Products
        </motion.h2>

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
              className="group bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <Link to={`/product/${product.id}`} className="block">
                <div className="relative overflow-hidden rounded-lg">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-contain transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300" />
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
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-lg font-semibold text-amber-800">₹{product.price.toFixed(2)}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
} 