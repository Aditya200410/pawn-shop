import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";


const testimonials = [
  {
    id: 1,
    name: 'Priya Sharma',
    location: 'Mumbai, Maharashtra',
    text: 'I ordered a beautiful Dokra brass Ganesh ji for my new home. The craftsmanship is absolutely stunning! My mother-in-law was so impressed that she immediately ordered one for her prayer room too. The packaging was excellent and it arrived safely from Jharkhand to Mumbai.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Rajesh Kumar',
    location: 'Delhi, NCR',
    text: 'As a collector of traditional Indian art, I was amazed by the quality of the terracotta horse pair I received. The attention to detail is remarkable. The team even called me to confirm the delivery time. Such personalized service is rare these days!',
    rating: 5,
  },
  {
    id: 3,
    name: 'Anjali Patel',
    location: 'Ahmedabad, Gujarat',
    text: 'My daughter\'s wedding is next month and I wanted something special for the mandap decoration. The wooden Durga maa I ordered is perfect! The artisans have captured every detail beautifully. All my relatives are asking where I got it from.',
    rating: 5,
  },
  {
    id: 4,
    name: 'Suresh Menon',
    location: 'Bangalore, Karnataka',
    text: 'I was skeptical about ordering fragile terracotta items online, but Riko Craft proved me wrong. The 4-foot horse arrived in perfect condition. The customer service team was very helpful throughout. Will definitely order more!',
    rating: 5,
  },
  {
    id: 5,
    name: 'Meera Reddy',
    location: 'Hyderabad, Telangana',
    text: 'The handmade jewellery collection is simply gorgeous! I bought a set for my sister\'s birthday and she loved it. The quality is much better than what I\'ve seen in local markets. The delivery was prompt and the packaging was eco-friendly.',
    rating: 5,
  },
  {
    id: 6,
    name: 'Amit Singh',
    location: 'Pune, Maharashtra',
    text: 'I ordered a wooden decorative key holder for my office. The design is so unique and the wood quality is excellent. My colleagues keep asking about it. The best part is that it supports local artisans. Proud to be part of preserving our heritage!',
    rating: 5,
  },
  {
    id: 7,
    name: 'Kavita Iyer',
    location: 'Chennai, Tamil Nadu',
    text: 'The terracotta tribal masks I ordered for my home decor are absolutely stunning! They add such character to my living room. The delivery executive was very professional and helped me unwrap them carefully. Highly recommend!',
    rating: 5,
  },
  {
    id: 8,
    name: 'Vikram Malhotra',
    location: 'Chandigarh, Punjab',
    text: 'I was looking for authentic Indian handicrafts for my new restaurant. The wooden boat and elephant pieces I ordered are perfect! They create such a warm, traditional atmosphere. My customers keep complimenting the decor.',
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