import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export default function BecomeSeller() {
  const navigate = useNavigate();

  const handleStartSelling = () => {
    navigate('/seller/auth');
  };

  return (
    <div className="bg-gray-50 text-black-800 ">
      {/* Hero Section */}
      <section
  className="relative min-h-[80vh] flex flex-col items-center justify-center text-center px-4 py-20 bg-cover bg-center bg-no-repeat"
  style={{ backgroundImage: "url('/seller.png')" }}
>
  {/* Overlay */}
  <div className="absolute inset-0 bg-black bg-opacity-60 z-0" />

  {/* Text Content */}
  <motion.div
    initial="hidden"
    animate="visible"
    variants={fadeInUp}
    transition={{ duration: 0.7 }}
    className="relative z-10 text-white"
  >
    <h1 className="text-5xl font-bold mb-4 drop-shadow-md">
      Become a Trusted Seller at Rikocraft
    </h1>
    <motion.p
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      transition={{ delay: 0.3 }}
      className="text-lg max-w-2xl mx-auto text-white drop-shadow"
    >
      Earn more by showcasing your products to thousands of daily customers. Start your journey in just a few clicks.
    </motion.p>
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleStartSelling}
      className="mt-8 px-8 py-3 text-white bg-green-600 rounded-full font-semibold hover:bg-green-700 transition shadow-lg"
    >
      Start Selling Now
    </motion.button>
  </motion.div>
</section>


      {/* Why Sell With Us */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">Why Sell With Rikocraft?</h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          {[
            ['🛒', 'Free Listings', 'List your products without any upfront cost.'],
            ['🚀', 'High Visibility', 'Reach customers across India with our platform.'],
            ['💸', 'Fast Payments', 'Get paid securely and quickly.'],
          ].map(([icon, title, desc]) => (
            <motion.div
              key={title}
              className="bg-white rounded-xl shadow p-6"
              whileHover={{ scale: 1.03 }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
            >
              <div className="text-4xl mb-4">{icon}</div>
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-gray-600">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-white py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="max-w-4xl mx-auto grid md:grid-cols-4 gap-6 text-center">
          {[
            ['📝', 'Sign Up', 'Create a seller account'],
            ['📤', 'Upload Items', 'List your products with images & details'],
            ['📦', 'Sell & Ship', 'Accept orders & ship to customers'],
            ['💰', 'Get Paid', 'Receive payments directly to your account'],
          ].map(([icon, title, desc], i) => (
            <motion.div
              key={i}
              className="p-6 bg-gray-50 rounded-xl shadow"
              whileHover={{ y: -5 }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ delay: i * 0.2 }}
            >
              <div className="text-3xl mb-4">{icon}</div>
              <h4 className="font-semibold text-lg">{title}</h4>
              <p className="text-gray-600">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-yellow-50 py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Seller Testimonials</h2>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
          {[
            ['Aditya M.', '“Ricko craft gave me an easy way to earn from unused items. Payments are fast and the support is awesome!”'],
            ['Ritika G.', '“As a small seller, I was worried about visibility. But Ricko craft made it so easy to grow.”'],
          ].map(([name, feedback], i) => (
            <motion.div
              key={i}
              className="bg-white p-6 rounded-xl shadow"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: i * 0.3 }}
            >
              <p className="text-gray-700 italic">“{feedback}”</p>
              <div className="mt-4 font-semibold text-gray-800">– {name}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {[
            ['Is there a fee to join?', 'No, signing up and listing products is completely free.'],
            ['How do I get paid?', 'We transfer payments directly to your bank account after order fulfillment.'],
            ['What can I sell?', 'You can sell used electronics, accessories, tools, books, and more.'],
          ].map(([q, a], i) => (
            <motion.div
              key={i}
              className="bg-white p-5 rounded-lg shadow"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ delay: i * 0.2 }}
            >
              <h4 className="font-semibold text-lg">{q}</h4>
              <p className="text-gray-600 mt-2">{a}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-amber-600 text-white text-center px-4">
        <h2 className="text-4xl font-bold mb-4">Ready to Start Selling?</h2>
        <p className="text-lg mb-6">Sign up now and list your first item in under 5 minutes.</p>
        <button 
          onClick={handleStartSelling}
          className="bg-white text-green-700 font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition"
        >
          Join Now
        </button>
      </section>
    </div>
  );
}
