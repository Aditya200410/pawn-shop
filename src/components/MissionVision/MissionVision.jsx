import { motion } from 'framer-motion';
import { Target, Eye, Heart, Users } from 'lucide-react';

const cards = [
  {
    icon: Target,
    title: 'Our Mission',
    description: 'To provide exceptional handcrafted treasures while maintaining the highest standards of integrity, transparency, and customer satisfaction.',
    image: 'https://srejonee.com/wp-content/uploads/2022/08/untold-stories-behind-every-handicraft.jpg'
  },
  {
    icon: Eye,
    title: 'Our Vision',
    description: 'To revolutionize the craft industry by combining traditional values with modern innovation, creating a seamless experience that sets new standards.',
    image: 'https://srejonee.com/wp-content/uploads/2022/08/Handicraft-heritage-of-Bengal.jpg'
  },
  {
    icon: Heart,
    title: 'Our Values',
    description: 'Integrity, transparency, and customer-centricity form the core of our business. We believe in building lasting relationships through honest practices.',
    image: 'https://srejonee.com/wp-content/uploads/2022/08/untold-stories-behind-every-handicraft.jpg'
  },
  {
    icon: Users,
    title: 'Our Promise',
    description: 'We promise to treat every customer with respect, provide exceptional quality, and ensure a secure experience throughout their journey with us.',
    image: 'https://srejonee.com/wp-content/uploads/2022/08/untold-stories-behind-every-handicraft.jpg'
  }
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
};

export default function MissionVision() {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-amber-50/50 via-white to-amber-50/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-tight text-gray-900 mb-3 md:mb-4">
            Our <span className="font-serif italic">Story</span>
          </h2>
          <div className="w-16 md:w-20 h-0.5 bg-gradient-to-r from-amber-600 to-orange-600 mx-auto mb-4 md:mb-6"></div>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover what drives us and shapes our commitment to excellence in every interaction
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="group relative bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 border border-white/20"
            >
              <div className="aspect-[5/3] overflow-hidden">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-5">
                  <div className="p-2.5 md:p-3 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl shadow-sm">
                    <card.icon className="h-5 w-5 md:h-6 md:w-6 text-amber-700" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-semibold text-gray-900">{card.title}</h3>
                </div>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">{card.description}</p>
              </div>

              {/* Premium hover effect */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-amber-200 rounded-2xl transition-colors duration-500 pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 