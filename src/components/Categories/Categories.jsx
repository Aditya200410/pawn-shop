import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const categories = [
  {
    id: 1,
    name: 'Terracotta',
    description: 'Traditional clay art',
    image: 'https://srejonee.com/wp-content/uploads/2022/08/Handicraft-heritage-of-Bengal.jpg',
  },
  {
    id: 2,
    name: 'Metal Work',
    description: 'Artistic metal crafts',
    image: 'https://srejonee.com/wp-content/uploads/2022/08/untold-stories-behind-every-handicraft.jpg',
  },
  {
    id: 3,
    name: 'Wood Carving',
    description: 'Intricate wooden designs',
    image: 'https://srejonee.com/wp-content/uploads/2022/08/Handicraft-heritage-of-Bengal.jpg',
  },
  {
    id: 4,
    name: 'Bamboo',
    description: 'Eco-friendly bamboo crafts',
    image: 'https://srejonee.com/wp-content/uploads/2022/08/untold-stories-behind-every-handicraft.jpg',
  },
  {
    id: 5,
    name: 'Textiles',
    description: 'Traditional fabrics',
    image: 'https://srejonee.com/wp-content/uploads/2022/08/Handicraft-heritage-of-Bengal.jpg',
  },
  {
    id: 6,
    name: 'Jewelry',
    description: 'Handcrafted ornaments',
    image: 'https://srejonee.com/wp-content/uploads/2022/08/untold-stories-behind-every-handicraft.jpg',
  },
  {
    id: 7,
    name: 'Paintings',
    description: 'Traditional art forms',
    image: 'https://srejonee.com/wp-content/uploads/2022/08/Handicraft-heritage-of-Bengal.jpg',
  },
  {
    id: 8,
    name: 'Pottery',
    description: 'Clay pottery items',
    image: 'https://srejonee.com/wp-content/uploads/2022/08/untold-stories-behind-every-handicraft.jpg',
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

export default function Categories() {
  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="mb-12">
          <h2 className="text-4xl font-light tracking-tight text-gray-900 mb-4">
            Shop by <span className="font-serif italic">Category</span>
          </h2>
          <div className="w-24 h-1 bg-amber-800"></div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto"
        >
          {categories.map((category) => (
            <Link
              key={category.id}
              to="/shop"
              state={{ selectedCategory: { main: category.name } }}
            >
              <motion.div
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
                className="group relative aspect-square rounded-full overflow-hidden bg-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="absolute inset-0">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10" />
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-end p-6 z-20 text-white text-center">
                    <h3 className="text-xl font-semibold mb-1">{category.name}</h3>
                    <p className="text-sm text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {category.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
} 