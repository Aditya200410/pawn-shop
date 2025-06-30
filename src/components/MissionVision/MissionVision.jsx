import { motion } from 'framer-motion';
import { Target, Eye, Heart, Users } from 'lucide-react';

const cards = [
  {
    icon: Target,
    title: 'Our Mission',
    description: 'To provide exceptional handcrafted treasures while maintaining the highest standards of integrity, transparency, and customer satisfaction.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT51SJwNmz3Qdv2aqN7I2v5YdKydZDTQWcQWw&s'
  },
  {
    icon: Eye,
    title: 'Our Vision',
    description: 'To revolutionize the craft industry by combining traditional values with modern innovation, creating a seamless experience that sets new standards.',
    image: 'data:image/jpeg;base64,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'
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
    <section className="py-6 md:py-10 lg:py-12 bg-gradient-to-br from-amber-50/50 via-white to-amber-50/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-12 lg:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-tight text-gray-900 mb-3 md:mb-4">
            Our <span className="font-serif italic">Story</span>
          </h2>
          <div className="w-16 md:w-20 h-0.5 bg-gradient-to-r from-amber-600 to-pink-600 mx-auto mb-4 md:mb-6"></div>
          <p className="text-sm md:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover what drives us and shapes our commitment to excellence in every interaction
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 md:gap-6 lg:gap-8">
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="group relative bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 border border-white/20"
            >
              <div className="aspect-[4/3] md:aspect-[5/3] overflow-hidden">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              
              <div className="p-3 md:p-6 lg:p-8">
                <div className="flex items-center gap-2 md:gap-4 mb-2 md:mb-4 lg:mb-5">
                  <div className="p-2 md:p-3 bg-gradient-to-br from-amber-100 to-pink-100 rounded-lg md:rounded-xl shadow-sm">
                    <card.icon className="h-4 w-4 md:h-6 md:w-6 text-amber-700" />
                  </div>
                  <h3 className="text-sm md:text-xl lg:text-2xl font-semibold text-gray-900">{card.title}</h3>
                </div>
                <p className="text-xs md:text-base text-gray-600 leading-relaxed">{card.description}</p>
              </div>

              {/* Premium hover effect */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-amber-200 rounded-xl md:rounded-2xl transition-colors duration-500 pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 