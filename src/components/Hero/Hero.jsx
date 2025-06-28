import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import config from '../../config/config';

const Hero = () => {
  const [carouselData, setCarouselData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetchCarouselData();
  }, []);

  useEffect(() => {
    if (carouselData.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % carouselData.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [carouselData]);

  const fetchCarouselData = async () => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/hero-carousel/active`);
      if (!response.ok) throw new Error('Failed to fetch carousel data');
      const data = await response.json();
      setCarouselData(data);
    } catch (err) {
      console.error('Error fetching carousel data:', err);
      setError('Failed to load carousel content');
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselData.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselData.length) % carouselData.length);
  };

  const handleMediaError = (e) => {
    console.error('Media loading error:', e);
    e.target.style.display = 'none';
    const fallbackText = document.createElement('div');
    fallbackText.className = 'absolute inset-0 flex items-center justify-center text-red-500 text-lg bg-white bg-opacity-90 rounded-lg shadow-lg';
    fallbackText.textContent = 'Media unavailable';
    e.target.parentNode.appendChild(fallbackText);
  };

  if (loading || error || !carouselData?.length) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        {loading ? (
          <div className="w-12 h-12 border-4 border-blue-100 border-l-blue-500 rounded-full animate-spin" />
        ) : (
          <p className="text-gray-600 text-lg text-center p-8">{error || 'No carousel items available'}</p>
        )}
      </div>
    );
  }

  return (
    <div className="relative h-[600px] overflow-hidden z-[1]">
      {/* Navigation Buttons */}
      <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4 z-[1]">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={prevSlide}
          className="p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors shadow-lg"
        >
          <svg
            className="w-6 h-6 text-gray-700"
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
          className="p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors shadow-lg"
        >
          <svg
            className="w-6 h-6 text-gray-700"
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
          <div className="absolute inset-0">
            {carouselData[currentSlide].image.endsWith('.mp4') ? (
              <video
                className="absolute inset-0 w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
                onError={handleMediaError}
              >
                <source src={carouselData[currentSlide].image} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img
                src={carouselData[currentSlide].image}
                alt={carouselData[currentSlide].title}
                className="absolute inset-0 w-full h-full object-cover"
                onError={handleMediaError}
              />
            )}
            <div className="absolute inset-0 bg-black/30" />
          </div>
          
          <div className="relative h-full flex items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl md:ml-0 mx-auto md:mx-0 text-center md:text-left">
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
                  className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
                >
                  {carouselData[currentSlide].title}
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
                  className="text-lg md:text-xl text-white/90 mb-8"
                >
                  {carouselData[currentSlide].description}
                </motion.p>
                <motion.a
                  href={carouselData[currentSlide].buttonLink}
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ 
                    delay: 0.6, 
                    duration: 0.8, 
                    ease: [0.22, 1, 0.36, 1],
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center bg-amber-800 text-white px-7 py-3 rounded-full font-semibold hover:bg-amber-900 transition-colors text-lg md:text-xl lg:text-2xl shadow-lg"
                  style={{ gap: '0.75rem' }}
                >
                  <span className="mr-2 md:mr-4">{carouselData[currentSlide].buttonText}</span>
                  <motion.span
                    whileHover={{ x: 8, scale: 1.15 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="flex items-center ml-2 md:ml-4"
                  >
                    <svg
                      className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-white"
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
                  </motion.span>
                </motion.a>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-[1]">
        {carouselData.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              currentSlide === index ? 'w-8 bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero; 