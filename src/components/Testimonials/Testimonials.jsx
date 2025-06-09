import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const testimonials = [
  {
    id: 1,
    name: 'Mr. Shankar Roy',
    location: 'California',
    rating: 5,
    text: 'Gem of a place to procure handicrafts from Bengal. Srejonee did an awesome job of packaging the fragile 3 ft terracotta horse. It reached USA in perfect condition.',
  },
  {
    id: 2,
    name: 'Anne Calladine',
    location: 'France',
    rating: 5,
    text: 'Srejonee is highly professional and fully dedicated to preserve Indian art. I ordered a terracotta bankura horse. I received it in perfect condition although it is particularly fragile.',
  },
  {
    id: 3,
    name: 'Mitalee Talukdar',
    location: 'Assam',
    rating: 5,
    text: 'Thanks a lot Srejoni Arts for providing us such a beautiful 4 and a half feet Terracotta horse. It was not only delivered in one piece but an executive came to drop it to our door step.',
  },
];

export default function Testimonials() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-center mb-12"
        >
          Testimonials
        </motion.h2>

        <div className="relative max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-lg p-8"
            >
              <div className="flex items-center mb-4">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <blockquote className="text-gray-700 text-lg italic mb-6">
                "{testimonials[currentTestimonial].text}"
              </blockquote>

              <div className="flex items-center">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {testimonials[currentTestimonial].name}
                  </h3>
                  <p className="text-gray-600">{testimonials[currentTestimonial].location}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation dots */}
          <div className="flex justify-center mt-8 gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`h-2 w-2 rounded-full transition-all ${
                  currentTestimonial === index ? 'w-8 bg-primary' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 