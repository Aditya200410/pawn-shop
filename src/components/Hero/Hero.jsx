import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import config from '../../config/config';

const Hero = () => {
  const [carouselData, setCarouselData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetchCarouselData();
  }, []);

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

  const handleMediaError = (e) => {
    console.error('Media loading error:', e);
    e.target.style.display = 'none';
    const fallbackText = document.createElement('div');
    fallbackText.className = 'absolute inset-0 flex items-center justify-center text-red-500 text-lg bg-white bg-opacity-90 rounded-lg shadow-lg';
    fallbackText.textContent = 'Media unavailable';
    e.target.parentNode.appendChild(fallbackText);
  };

  const CustomArrow = ({ direction, onClick }) => (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`absolute top-1/2 -translate-y-1/2 ${direction === 'prev' ? 'left-6 lg:left-10' : 'right-6 lg:right-10'} 
        w-14 h-14 lg:w-16 lg:h-16 flex items-center justify-center rounded-full 
        bg-black/30 backdrop-blur-xl border border-white/20 
        hover:bg-black/40 hover:border-white/30 transition-all duration-300 z-20
        group shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:shadow-[0_0_30px_rgba(0,0,0,0.3)]`}
      aria-label={`${direction} slide`}
    >
      <motion.div
        className="text-white/90 group-hover:text-white drop-shadow-lg"
        initial={{ x: 0 }}
        animate={{ x: direction === 'prev' ? [-4, 0, -4] : [4, 0, 4] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        {direction === 'prev' ? (
          <ChevronLeft className="w-8 h-8 lg:w-10 lg:h-10 stroke-[1.5]" />
        ) : (
          <ChevronRight className="w-8 h-8 lg:w-10 lg:h-10 stroke-[1.5]" />
        )}
      </motion.div>
    </motion.button>
  );

  if (loading || error || !carouselData?.length) {
    return (
      <div className="w-full h-[85vh] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        {loading ? (
          <div className="w-12 h-12 border-4 border-blue-100 border-l-blue-500 rounded-full animate-spin" />
        ) : (
          <p className="text-gray-600 text-lg text-center p-8">{error || 'No carousel items available'}</p>
        )}
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden group">
      <Carousel
        autoPlay
        infiniteLoop
        showStatus={false}
        showThumbs={false}
        interval={6000}
        transitionTime={1000}
        stopOnHover={true}
        dynamicHeight={false}
        className="w-full"
        renderArrowPrev={(onClickHandler, hasPrev) =>
          hasPrev && <CustomArrow direction="prev" onClick={onClickHandler} />
        }
        renderArrowNext={(onClickHandler, hasNext) =>
          hasNext && <CustomArrow direction="next" onClick={onClickHandler} />
        }
        onChange={(index) => setCurrentSlide(index)}
        selectedItem={currentSlide}
        showIndicators={false}
      >
        {carouselData.map((item, index) => (
          <motion.div
            key={item._id}
            className="relative w-full h-[85vh] overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.div
              className="absolute inset-0 w-full h-full"
              initial={{ scale: 1.2 }}
              animate={{ 
                scale: currentSlide === index ? 1 : 1.2,
                transition: { duration: 6, ease: "easeOut" }
              }}
            >
              {item.image.endsWith('.mp4') ? (
                <video
                  className="absolute inset-0 w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                  onError={handleMediaError}
                >
                  <source src={item.image} type="video/mp4" />
                </video>
              ) : (
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={handleMediaError}
                />
              )}
            </motion.div>
            <div className="absolute inset-0 bg-black/40" />
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center px-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ 
                opacity: currentSlide === index ? 1 : 0,
                y: currentSlide === index ? 0 : 30
              }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <div className="max-w-[1200px] text-center">
                <motion.h2
                  className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 
                    text-white tracking-tight leading-tight
                    font-serif max-w-[900px] mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                >
                  {item.title}
                </motion.h2>
                {item.subtitle && (
                  <motion.h3
                    className="text-xl md:text-2xl lg:text-3xl font-medium mb-8
                      text-white/90 tracking-wide font-serif"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.9 }}
                  >
                    {item.subtitle}
                  </motion.h3>
                )}
                {item.description && (
                  <motion.p
                    className="text-lg md:text-xl mb-10 text-white/80
                      leading-relaxed max-w-[800px] mx-auto font-light"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.1 }}
                  >
                    {item.description}
                  </motion.p>
                )}
                <motion.a
                  href={item.buttonLink}
                  className="inline-block px-12 py-5 text-lg font-semibold
                    text-white bg-black/20 backdrop-blur-sm
                    rounded-full border-2 border-white/30
                    hover:bg-white hover:text-black
                    transition-all duration-300 ease-out
                    hover:scale-105 transform"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.3 }}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.buttonText}
                </motion.a>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </Carousel>
    </div>
  );
};

export default Hero; 