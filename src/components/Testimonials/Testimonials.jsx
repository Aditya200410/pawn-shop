import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";


const testimonials = [
  {
    id: 1,
    name: 'Sanjay Ghosh',
    location: 'USA',
    text: 'Gem of a place to procure handicrafts from Bengal. rikocraft did an awesome job of packaging the fragile 3 ft terracotta horse. It reached USA in perfect condition.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Saikat Chakraborty',
    location: 'Kolkata',
    text: 'rikocraft is highly professional and fully dedicated to preserve Indian art. I ordered a terracotta bankura horse. I received it in perfect condition although it is particularly fragile.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Suman Chakraborty',
    location: 'Kolkata',
    text: 'Thanks a lot rikocraft Arts for providing us such a beautiful 4 and a half feet Terracotta horse. It was not only delivered in one piece but an executive came to drop it to our door step.',
    rating: 5,
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

const Testimonials = () => {
  return (
    <section className="testimonials-section py-16 w-full relative">
      <div className="w-full px-4">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
        <Carousel
          showArrows={true}
          infiniteLoop={true}
          showThumbs={false}
          showStatus={false}
          autoPlay={true}
          interval={5000}
          className="testimonial-carousel w-full"
          renderArrowPrev={(onClickHandler, hasPrev, label) =>
            hasPrev && (
              <button
                type="button"
                onClick={onClickHandler}
                title={label}
                className="hidden md:block absolute left-8 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 md:p-4 hover:bg-amber-100 transition-all border border-gray-200"
              >
                <ArrowLeft className="w-7 h-7 md:w-9 md:h-9 text-amber-800 transition-transform duration-200 group-hover:scale-110" />
              </button>
            )
          }
          renderArrowNext={(onClickHandler, hasNext, label) =>
            hasNext && (
              <button
                type="button"
                onClick={onClickHandler}
                title={label}
                className="hidden md:block absolute right-8 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 md:p-4 hover:bg-amber-100 transition-all border border-gray-200"
              >
                <ArrowRight className="w-7 h-7 md:w-9 md:h-9 text-amber-800 transition-transform duration-200 group-hover:scale-110" />
              </button>
            )
          }
        >
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="max-w-xl mx-auto testimonial-item bg-white p-8 rounded-lg shadow-lg mb-8">
              <div className="flex items-center justify-center mb-4">
                {[...Array(testimonial.rating)].map((_, index) => (
                  <svg
                    key={index}
                    className="w-6 h-6 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                    />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 mb-6 italic">{testimonial.text}</p>
              <div className="text-center">
                <h4 className="font-semibold text-lg">{testimonial.name}</h4>
                <p className="text-gray-500">{testimonial.location}</p>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </section>
  );
};

export default Testimonials; 