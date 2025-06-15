import { motion } from 'framer-motion';
import { Target, Eye, Heart, Users } from 'lucide-react';

const cards = [
  {
    icon: Target,
    title: 'Our Mission',
    description: 'To provide exceptional pawn services while maintaining the highest standards of integrity, transparency, and customer satisfaction. We strive to be the trusted destination for all your pawn needs.',
    image: 'https://srejonee.com/wp-content/uploads/2022/08/untold-stories-behind-every-handicraft.jpg'
  },
  {
    icon: Eye,
    title: 'Our Vision',
    description: 'To revolutionize the pawn industry by combining traditional values with modern innovation, creating a seamless experience that sets new standards in customer service and trust.',
    image: 'https://srejonee.com/wp-content/uploads/2022/08/Handicraft-heritage-of-Bengal.jpg'
  },
  {
    icon: Heart,
    title: 'Our Values',
    description: 'Integrity, transparency, and customer-centricity form the core of our business. We believe in building lasting relationships through honest practices and exceptional service.',
    image: 'https://srejonee.com/wp-content/uploads/2022/08/untold-stories-behind-every-handicraft.jpg'
  },
  {
    icon: Users,
    title: 'Our Promise',
    description: 'We promise to treat every customer with respect, provide fair valuations, and ensure a secure and confidential experience throughout their journey with us.',
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
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-light tracking-tight text-gray-900 mb-4">
            Our <span className="font-serif italic">Story</span>
          </h2>
          <div className="w-24 h-1 bg-amber-800 mx-auto mb-8"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover what drives us and shapes our commitment to excellence in every interaction
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className=" cursor-pointer absolute inset-0 bg-gradient-to-t from-black/30 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              
              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-amber-50 rounded-xl">
                    <card.icon className="h-6 w-6 text-amber-800" />
                  </div>
                  <h3 className="text-2xl font-light text-gray-900">{card.title}</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">{card.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 