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

const slideVariants = {
  hidden: (direction) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 0.8,
    rotateY: direction > 0 ? 15 : -15,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
  }),
  visible: {
    x: 0,
    opacity: 1,
    scale: 1,
    rotateY: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
  },
  exit: (direction) => ({
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 0.8,
    rotateY: direction < 0 ? 15 : -15,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
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
    <section className="py-8 md:py-12 lg:py-16 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50/30 via-white to-rose-50/30"></div>
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-amber-200/20 to-orange-200/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-rose-200/20 to-pink-200/20 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-6 md:mb-8 lg:mb-10"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
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

        <div className="relative max-w-4xl mx-auto h-[300px] md:h-[350px] lg:h-[400px] flex items-center justify-center">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              variants={slideVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="absolute w-full perspective-1000"
            >
              <div className="relative">
                {/* Main Card */}
                <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl p-4 md:p-6 lg:p-8 shadow-2xl shadow-amber-500/10">
                  {/* Quote Icon */}
                  <div className="absolute -top-3 -left-3 w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Quote className="w-5 h-5 text-white" />
                  </div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 text-xs font-medium rounded-full">
                      {testimonial.category}
                    </span>
                  </div>
                  
                  {/* Testimonial Text */}
                  <blockquote className="text-gray-700 text-sm md:text-base lg:text-lg leading-relaxed mb-4 md:mb-6 mt-3 font-light italic">
                    "{testimonial.text}"
                  </blockquote>

                  {/* Customer Info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="relative">
                        <img 
                          src={testimonial.image} 
                          alt={testimonial.name}
                          className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-2xl object-cover border-4 border-white shadow-lg"
                        />
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-br from-green-400 to-green-500 rounded-full border-2 border-white flex items-center justify-center">
                          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
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

                {/* Decorative Elements */}
                <div className="absolute -bottom-3 -right-3 w-20 h-20 bg-gradient-to-br from-amber-200/30 to-orange-200/30 rounded-2xl blur-xl"></div>
                <div className="absolute -top-3 -left-3 w-12 h-12 bg-gradient-to-br from-rose-200/30 to-pink-200/30 rounded-xl blur-lg"></div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <motion.button 
            whileHover={{ scale: 1.1, x: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => paginate(-1)} 
            className="absolute top-1/2 -translate-y-1/2 -left-4 z-10 p-3 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/30 hover:bg-white group"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700 group-hover:text-amber-600 transition-colors" />
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.1, x: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => paginate(1)} 
            className="absolute top-1/2 -translate-y-1/2 -right-4 z-10 p-3 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/30 hover:bg-white group"
          >
            <ArrowRight className="w-5 h-5 text-gray-700 group-hover:text-amber-600 transition-colors" />
          </motion.button>
        </div>

        {/* Enhanced Dots */}
        <div className="flex justify-center items-center gap-3 mt-6 md:mt-8">
          {testimonials.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrent([index, index > current ? 1 : -1])}
              className={`relative group ${
                current === index ? 'scale-110' : 'scale-100'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                current === index 
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg' 
                  : 'bg-gray-300 group-hover:bg-gray-400'
              }`} />
              {current === index && (
                <motion.div
                  layoutId="activeDot"
                  className="absolute inset-0 w-3 h-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
} 