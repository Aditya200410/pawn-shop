import { motion } from 'framer-motion';

const categories = [
  {
    id: 1,
    name: 'Apparels & Accessories',
    description: 'We offer finest embroideried Kantha in dresses, beding or quilt.',
    image: '/categories/apparels.jpg',
  },
  {
    id: 2,
    name: 'Metal Work',
    description: "Bengal's Dokra is a GI Tagged famous ancient Art Form",
    image: '/categories/metal.jpg',
  },
  {
    id: 3,
    name: 'Wood & Paper Pulp',
    description: 'Beautiful wooden dolls and wood carvings are intrinsic to Bengal',
    image: '/categories/wood.jpg',
  },
  {
    id: 4,
    name: 'Patachitra',
    description: 'Ancient Audio-visual art from of Bengal with bio colours',
    image: '/categories/patachitra.jpg',
  },
  {
    id: 5,
    name: 'Terracotta & Clay',
    description: 'Bengal mastered in baking clay into long-lasting terracotta for centuries.',
    image: '/categories/terracotta.jpg',
  },
  {
    id: 6,
    name: 'Miniature Dolls',
    description: 'Bengal produced finest woven-grass articles for generations',
    image: '/categories/dolls.jpg',
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
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-center mb-12"
        >
          Popular Categories
        </motion.h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {categories.map((category) => (
            <motion.div
              key={category.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-lg overflow-hidden shadow-md"
            >
              <div className="relative h-48">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                <p className="text-gray-600">{category.description}</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="mt-4 text-primary font-semibold inline-flex items-center"
                >
                  Explore More
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
} 