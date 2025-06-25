import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { heroCarouselAPI } from '../../services/api';
import config from '../../config/config';
import Loader from '../Loader/Loader';

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mediaErrors, setMediaErrors] = useState({});

  const getMediaUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    if (path.startsWith('/')) return `${config.API_BASE_URL}${path}`;
    return `${config.API_BASE_URL}/pawnbackend/data/${path}`;
  };

  const isVideo = (path) => {
    return path?.toLowerCase().endsWith('.mp4');
  };

  const handleMediaError = (slideId) => {
    console.error(`Failed to load media for slide ${slideId}`);
    setMediaErrors(prev => ({ ...prev, [slideId]: true }));
  };

  useEffect(() => {
    const fetchCarouselData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await heroCarouselAPI.getActiveItems();
        if (!response.data || response.data.length === 0) {
          setError('No active carousel items found.');
          return;
        }
        
        const processedSlides = response.data.map(item => {
          const mediaUrl = getMediaUrl(item.image);
          console.log('Processing slide media:', { id: item.id, mediaUrl });
          return {
            id: item._id || item.id,
            image: mediaUrl,
            isVideo: isVideo(item.image),
            title: item.title,
            subtitle: item.subtitle,
            description: item.description,
            buttonText: item.buttonText || 'Shop Now',
            buttonLink: item.buttonLink || '/shop'
          };
        });
        
        setSlides(processedSlides);
      } catch (error) {
        console.error('Error fetching carousel data:', error);
        setError('Failed to load carousel items. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCarouselData();
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  if (loading) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center bg-gray-100">
        <Loader />
      </div>
    );
  }

  if (error || slides.length === 0) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-gray-600 mb-4">{error || 'No carousel items available.'}</p>
          <Link to="/shop" className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors">
            Browse Shop
          </Link>
        </div>
      </div>
    );
  }

  const MediaComponent = ({ slide }) => {
    if (slide.isVideo) {
      return (
        <video
          key={slide.image}
          src={slide.image}
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          onError={() => handleMediaError(slide.id)}
          style={{ display: mediaErrors[slide.id] ? 'none' : 'block' }}
        />
      );
    }
    return (
      <img
        src={slide.image}
        alt={slide.title}
        className="w-full h-full object-cover"
        onError={() => handleMediaError(slide.id)}
        style={{ display: mediaErrors[slide.id] ? 'none' : 'block' }}
      />
    );
  };

  return (
    <div className="relative w-full h-[600px] overflow-hidden group">
      {/* Navigation Arrows */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.1 }}
        onClick={handlePrevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors backdrop-blur-sm opacity-0 group-hover:opacity-100 shadow-lg"
        aria-label="Previous slide"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 md:h-8 md:w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </motion.button>
      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.1 }}
        onClick={handleNextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors backdrop-blur-sm opacity-0 group-hover:opacity-100 shadow-lg"
        aria-label="Next slide"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 md:h-8 md:w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </motion.button>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <div className="relative w-full h-full">
            <MediaComponent slide={slides[currentSlide]} />
            {mediaErrors[slides[currentSlide].id] && (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500">Media not available</p>
              </div>
            )}
            <div className="absolute inset-0 bg-black bg-opacity-40" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white px-4">
                <motion.h1
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl md:text-5xl font-bold mb-4"
                >
                  {slides[currentSlide].title}
                </motion.h1>
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-xl md:text-2xl mb-4"
                >
                  {slides[currentSlide].subtitle}
                </motion.p>
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-lg mb-8 max-w-2xl mx-auto"
                >
                  {slides[currentSlide].description}
                </motion.p>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Link
                    to={slides[currentSlide].buttonLink}
                    className="bg-amber-600 text-white px-8 py-3 rounded-lg hover:bg-amber-700 transition-colors text-lg"
                  >
                    {slides[currentSlide].buttonText}
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      
      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? 'bg-amber-600' : 'bg-white bg-opacity-50 hover:bg-opacity-75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
} 