import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const categories = [
  {
    id: 1,
    name: 'Apparels & Accessories',
    description: 'We offer finest embroideried Kantha in dresses, beding or quilt.',
    image: 'https://srejonee.com/wp-content/uploads/2022/08/Metal-work-small-image.jpg',
  },
  {
    id: 2,
    name: 'Metal Work',
    description: "Bengal's Dokra is a GI Tagged famous ancient Art Form",
    image: 'https://srejonee.com/wp-content/uploads/2022/08/Terracotta-Clay-small-image.jpg',
  },
  {
    id: 3,
    name: 'Wood & Paper Pulp',
    description: 'Beautiful wooden dolls and wood carvings are intrinsic to Bengal',
    image: 'https://srejonee.com/wp-content/uploads/2024/07/DSC9933-e1719832715970.jpg',
  },
  {
    id: 4,
    name: 'Patachitra',
    description: 'Ancient Audio-visual art from of Bengal with bio colours',
    image: 'https://srejonee.com/wp-content/uploads/2024/07/DSC9933-e1719832715970.jpg',
  },
  {
    id: 5,
    name: 'Terracotta & Clay',
    description: 'Bengal mastered in baking clay into long-lasting terracotta for centuries.',
    image: 'https://srejonee.com/wp-content/uploads/2022/08/Terracotta-Clay-small-image.jpg',
  },
  {
    id: 6,
    name: 'Miniature Dolls',
    description: 'Bengal produced finest woven-grass articles for generations',
    image: 'https://srejonee.com/wp-content/uploads/2022/08/Apparels-accessories-small-img.jpg',
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
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-2">Shop by Category</h2>
          <p className="text-gray-600">Discover our curated collection of premium items</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
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
                  scale: 1.03,
                  transition: { duration: 0.2 }
                }}
                className="group relative rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-300 h-[300px]"
              >
                <div className="relative w-full h-full">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10" />
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-4 z-20 text-white">
                    <h3 className="text-lg font-semibold mb-1 line-clamp-1">{category.name}</h3>
                    <p className="text-sm text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-2">
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
