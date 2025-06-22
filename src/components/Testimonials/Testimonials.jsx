import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Mr. Shankar Roy',
    location: 'California, USA',
    rating: 5,
    text: 'Gem of a place to procure handicrafts from Bengal. rickocraft did an awesome job of packaging the fragile 3 ft terracotta horse. It reached USA in perfect condition.',
    image: 'https://randomuser.me/api/portraits/men/75.jpg',
    category: 'Terracotta Art'
  },
  {
    id: 2,
    name: 'Anne Calladine',
    location: 'Paris, France',
    rating: 5,
    text: 'rickocraft is highly professional and fully dedicated to preserve Indian art. I ordered a terracotta bankura horse. I received it in perfect condition although it is particularly fragile.',
    image: 'https://randomuser.me/api/portraits/women/76.jpg',
    category: 'Handicrafts'
  },
  {
    id: 3,
    name: 'Mitalee Talukdar',
    location: 'Assam, India',
    rating: 5,
    text: 'Thanks a lot rickocraft Arts for providing us such a beautiful 4 and a half feet Terracotta horse. It was not only delivered in one piece but an executive came to drop it to our door step.',
    image: 'https://randomuser.me/api/portraits/women/77.jpg',
    category: 'Traditional Art'
  },
];

// Simplified animations for better performance
const slideVariants = {
  hidden: (direction) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
    transition: { duration: 0.4, ease: 'easeInOut' }
  }),
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: 'easeInOut' }
  },
  exit: (direction) => ({
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
    transition: { duration: 0.4, ease: 'easeInOut' }
  }),
};

export default function Testimonials() {
  const [[current, direction], setCurrent] = useState([0, 0]);

  const paginate = (newDirection) => {
    setCurrent([(current + newDirection + testimonials.length) % testimonials.length, newDirection]);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      paginate(1);
    }, 6000); // Auto-slide every 6 seconds
    return () => clearInterval(timer);
  }, [current]);

  const testimonial = testimonials[current];

  return (
    <section className="py-6 md:py-10 lg:py-12 relative overflow-hidden">
      {/* Simplified Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50/30 via-white to-rose-50/30"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6 md:mb-8 lg:mb-10"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-100 to-orange-100 px-4 py-2 rounded-full mb-3 md:mb-4"
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-medium text-amber-800">Customer Stories</span>
          </motion.div>
          
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-light tracking-tight text-gray-900 mb-3 md:mb-4">
            What Our <span className="font-serif italic bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Customers</span> Say
          </h2>
          <p className="text-sm md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover the authentic experiences of art lovers who have brought home pieces of our cultural heritage
          </p>
        </motion.div>

        {/* Improved container with better spacing for arrows */}
        <div className="relative max-w-4xl mx-auto h-[350px] md:h-[400px] lg:h-[450px] flex items-center justify-center px-12 md:px-16 lg:px-20">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              variants={slideVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="absolute w-full"
            >
              <div className="relative">
                {/* Main Card with improved padding for mobile */}
                <div className="bg-white/90 backdrop-blur-sm border border-white/40 rounded-2xl p-5 md:p-6 lg:p-8 shadow-lg">
                  {/* Quote Icon */}
                  <div className="absolute -top-2 -left-2 w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-md">
                    <Quote className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-3 right-3 md:top-4 md:right-4">
                    <span className="px-2 py-1 md:px-3 md:py-1 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 text-xs font-medium rounded-full">
                      {testimonial.category}
                    </span>
                  </div>
                  
                  {/* Testimonial Text with better mobile spacing */}
                  <blockquote className="text-gray-700 text-sm md:text-base lg:text-lg leading-relaxed mb-4 md:mb-6 mt-2 md:mt-3 font-light italic pr-2">
                    "{testimonial.text}"
                  </blockquote>

                  {/* Customer Info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="relative">
                        <img 
                          src={testimonial.image} 
                          alt={testimonial.name}
                          className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-xl object-cover border-2 border-white shadow-md"
                        />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-gradient-to-br from-green-400 to-green-500 rounded-full border-2 border-white flex items-center justify-center">
                          <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-white rounded-full"></div>
                        </div>
                      </div>
                      <div className="ml-3">
                        <h3 className="font-semibold text-gray-900 text-sm md:text-base">{testimonial.name}</h3>
                        <p className="text-gray-500 text-xs flex items-center gap-1">
                          <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                          {testimonial.location}
                        </p>
                      </div>
                    </div>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 md:w-4 md:h-4 text-amber-400 fill-amber-400" />
                      ))}
                      <span className="ml-2 text-xs text-gray-500 font-medium">{testimonial.rating}.0</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons - positioned outside content area */}
         
         
        </div>

        {/* Enhanced Dots */}
        <div className="flex justify-center items-center gap-2 md:gap-3 mt-6 md:mt-8">
          {testimonials.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrent([index, index > current ? 1 : -1])}
              className={`relative group ${
                current === index ? 'scale-110' : 'scale-100'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <div className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                current === index 
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 shadow-md' 
                  : 'bg-gray-300 group-hover:bg-gray-400'
              }`} />
              {current === index && (
                <motion.div
                  layoutId="activeDot"
                  className="absolute inset-0 w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500"
                  initial={false}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
} 