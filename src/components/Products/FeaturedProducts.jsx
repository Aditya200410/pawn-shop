import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HeartIcon, ShoppingCartIcon, EyeIcon } from '@heroicons/react/24/outline';

const products = [
  {
    id: 1,
    name: 'Terracotta Bankura Horse 6″',
    price: 4.91,
    image: 'https://srejonee.com/wp-content/uploads/2025/05/MG_9788-300x300.jpg',
    category: 'Terracotta',
    description: 'Handcrafted traditional Bankura horse, a symbol of Bengali heritage'
  },
  {
    id: 2,
    name: 'Terracotta Fighting Bull Large',
    price: 56.63,
    image: 'https://srejonee.com/wp-content/uploads/2025/05/MG_9785-300x300.jpg',
    category: 'Terracotta',
    description: 'Majestic fighting bull sculpture, showcasing traditional craftsmanship'
  },
  {
    id: 3,
    name: 'Terracotta Yellow Bankura Horse 8″',
    price: 9.06,
    image: 'https://srejonee.com/wp-content/uploads/2025/05/MG_9782-300x300.jpg',
    category: 'Terracotta',
    description: 'Vibrant yellow Bankura horse, perfect for home decoration'
  },
  {
    id: 4,
    name: 'Terracotta Blue Bankura Horse 6″',
    price: 6.04,
    image: 'https://srejonee.com/wp-content/uploads/2025/05/MG_9779-600x600.jpg',
    category: 'Terracotta',
    description: 'Elegant blue Bankura horse, a unique addition to your collection'
  },
  {
    id: 5,
    name: 'Terracotta Pink Bankura Horse 6″',
    price: 6.04,
    image: 'https://srejonee.com/wp-content/uploads/2025/05/MG_9791-300x300.jpg',
    category: 'Terracotta',
    description: 'Charming pink Bankura horse, adds a pop of color to any space'
  },
  {
    id: 6,
    name: 'Terracotta Green Bankura Horse 6″',
    price: 6.04,
    image: 'https://srejonee.com/wp-content/uploads/2025/05/37-600x720-1-600x600.jpg',
    category: 'Terracotta',
    description: 'Fresh green Bankura horse, brings nature-inspired elegance'
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