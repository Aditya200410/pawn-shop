import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const slides = [
  {
    id: 1,
    image: 'https://t4.ftcdn.net/jpg/05/27/71/81/360_F_527718147_x7XDK929xZnZqjgh0oPYz7xK0EvtnlIF.jpg',
    title: ' Support the rural artisans of India',
    description: 'keeping alive 1000-year-old heritage art is not just our work, its our duty, let Rikocraft take the journey from village to city, delivering heritage to your home.',
    cta: 'Shop Collection'
  },
  {
    id: 2,
    image: 'https://mudkart.com/cdn/shop/files/1920X800_BANNER-05_1_7cf92773-da17-48be-8a66-f5fea894f5df.jpg?v=1721114175&width=3840',
    title: 'Artisanal Excellence',
    description: 'From terracotta to metalwork, experience the finest craftsmanship passed down through generations.',
    cta: 'View Gallery'
  },
  {
    id: 3,
    image: 'https://theheritageartifacts.com/cdn/shop/collections/ebb34276e046f0459f7e237be00d42dc.jpg?v=1678684828',
    title: 'Heritage Meets Modern',
    description: 'Where traditional Bengali artistry meets contemporary design, creating timeless pieces for your home.',
    cta: 'Learn More'
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[500px] md:h-[600px] overflow-hidden z-[1]">
      {/* Navigation Buttons */}
      <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2 md:px-4 z-[1]">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        onClick={prevSlide}
          className="p-1.5 md:p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors shadow-lg"
      >
        <svg
            className="w-5 h-5 md:w-6 md:h-6 text-gray-700"
          fill="none"
            stroke="currentColor"
          viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        onClick={nextSlide}
          className="p-1.5 md:p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors shadow-lg"
      >
        <svg
            className="w-5 h-5 md:w-6 md:h-6 text-gray-700"
          fill="none"
            stroke="currentColor"
          viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
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

      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 z-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
          >
            <div className="absolute inset-0 bg-black/30" />
          </div>
          
          <div className="relative h-full flex items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl mx-auto text-center">
              <motion.h1
                  initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                  transition={{ 
                    delay: 0.2, 
                    duration: 0.8, 
                    ease: [0.22, 1, 0.36, 1],
                    type: "spring",
                    stiffness: 100
                  }}
                  className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-3 md:mb-4 px-4"
              >
                {slides[currentSlide].title}
              </motion.h1>
              <motion.p
                  initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                  transition={{ 
                    delay: 0.4, 
                    duration: 0.8, 
                    ease: [0.22, 1, 0.36, 1],
                    type: "spring",
                    stiffness: 100
                  }}
                  className="text-sm sm:text-base md:text-xl text-white/90 mb-6 md:mb-8 px-4"
              >
                {slides[currentSlide].description}
              </motion.p>
              <motion.button
                  initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                  transition={{ 
                    delay: 0.6, 
                    duration: 0.8, 
                    ease: [0.22, 1, 0.36, 1],
                    type: "spring",
                    stiffness: 100
                  }}
                whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-amber-800 text-white px-6 md:px-8 py-2.5 md:py-3 rounded-full font-semibold hover:bg-amber-900 transition-colors text-sm md:text-base"
              >
                  {slides[currentSlide].cta}
              </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Slide indicators */}
      <div className="absolute bottom-4 md:bottom-8 left-0 right-0 flex justify-center gap-2 z-[1]">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-1.5 md:h-2 w-1.5 md:w-2 rounded-full transition-all duration-300 ${
              currentSlide === index ? 'w-6 md:w-8 bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
} 