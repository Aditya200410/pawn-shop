import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Award, Users, Heart, Star } from 'lucide-react';

const AboutUs = () => {
  const stats = [
    { icon: Users, number: "500+", label: "Happy Customers" },
    { icon: Award, number: "2+", label: "Years Experience" },
    { icon: Heart, number: "200+", label: "Products Sold" },
    { icon: Star, number: "4.9", label: "Customer Rating" }
  ];

  const values = [
    {
      title: "Authentic Heritage",
      description: "We source directly from local artisans in Jharkhand and surrounding regions, ensuring each piece authentically represents our rich cultural heritage.",
      icon: "🏺"
    },
    {
      title: "Artisan Empowerment",
      description: "We work closely with local craftsmen, providing them fair compensation and helping preserve traditional art forms.",
      icon: "🤝"
    },
    {
      title: "Quality Assurance",
      description: "Each piece is carefully curated and quality checked to ensure it meets our high standards of craftsmanship.",
      icon: "✨"
    },
    {
      title: "Sustainable Practices",
      description: "We're committed to eco-friendly packaging and supporting sustainable craft practices in our community.",
      icon: "🌱"
    }
  ];

  return (
    <div className="w-full bg-gradient-to-br from-amber-50 via-white to-amber-50">
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-600/10 to-orange-600/10"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 md:mb-6">
              Crafting Heritage, Creating Future
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 md:mb-8 leading-relaxed">
              A young startup from Jharkhand dedicated to bringing the exquisite handcrafted treasures 
              of Eastern India to homes worldwide, while empowering local artisans.
            </p>
            <div className="w-16 md:w-24 h-1 bg-amber-600 mx-auto rounded-full"></div>
          </motion.div>
        </div>
      </section>

     

      {/* Story Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="order-2 md:order-1"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 md:mb-6">
                Our Journey Begins
              </h2>
              <p className="text-base md:text-lg text-gray-600 mb-4 md:mb-6 leading-relaxed">
                   Riko Craft enterprises emerged from a passion to showcase the incredible 
                artistic heritage of Jharkhand and Eastern India. What began as a small initiative 
                to support local artisans has blossomed into a growing platform for traditional crafts.
              </p>
              <p className="text-base md:text-lg text-gray-600 mb-4 md:mb-6 leading-relaxed">
                We collaborate with skilled artisans from various districts of Jharkhand, 
                each bringing their unique regional techniques and traditional knowledge to 
                create pieces that tell stories of our rich cultural heritage.
              </p>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                Our vision is to become the bridge between talented local artisans and 
                art enthusiasts worldwide, ensuring fair trade practices while preserving 
                and promoting our traditional art forms.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative order-1 md:order-2"
            >
              <div className="bg-amber-600 w-full h-64 md:h-96 rounded-2xl shadow-2xl"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-amber-600/80 to-orange-600/80 rounded-2xl flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-4xl md:text-6xl mb-3 md:mb-4">🎨</div>
                  <div className="text-lg md:text-2xl font-semibold">Eastern Heritage</div>
                  <div className="text-sm md:text-lg opacity-90">Modern Appeal</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 md:mb-6">Our Values</h2>
            <p className="text-base md:text-xl text-gray-600 max-w-3xl mx-auto">
              The core principles that drive our mission to preserve and promote India's artistic heritage.
            </p>
          </motion.div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center p-4 md:p-6 rounded-2xl hover:bg-amber-50 transition-colors duration-300"
              >
                <div className="text-3xl md:text-4xl mb-3 md:mb-4">{value.icon}</div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 md:mb-3">{value.title}</h3>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8 md:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 md:mb-6">Connect With Us</h2>
            <p className="text-base md:text-xl text-gray-600 max-w-3xl mx-auto">
              We'd love to hear from you and discuss how we can bring the beauty of traditional crafts to your space.
            </p>
          </motion.div>
          
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-4 md:space-y-6"
            >
              <div className="bg-amber-50 p-4 md:p-6 rounded-2xl">
                <div className="flex items-start space-x-3 md:space-x-4">
                  <MapPin className="w-5 h-5 md:w-6 md:h-6 text-amber-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1 md:mb-2 text-sm md:text-base">Address</h3>
                    <p className="text-gray-600 text-sm md:text-base">
                      Jamshedpur, Jharkhand-831004
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-amber-50 p-4 md:p-6 rounded-2xl">
                <div className="flex items-start space-x-3 md:space-x-4">
                  <Phone className="w-5 h-5 md:w-6 md:h-6 text-amber-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1 md:mb-2 text-sm md:text-base">Phone</h3>
                    <p className="text-gray-600 text-sm md:text-base">+918340624635</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-amber-50 p-4 md:p-6 rounded-2xl">
                <div className="flex items-start space-x-3 md:space-x-4">
                  <Mail className="w-5 h-5 md:w-6 md:h-6 text-amber-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1 md:mb-2 text-sm md:text-base">Email</h3>
                    <p className="text-gray-600 text-sm md:text-base">Info@Rikocraft.com</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-amber-50 p-4 md:p-6 rounded-2xl">
                <div className="flex items-start space-x-3 md:space-x-4">
                  <Clock className="w-5 h-5 md:w-6 md:h-6 text-amber-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1 md:mb-2 text-sm md:text-base">Working Hours</h3>
                    <p className="text-gray-600 text-sm md:text-base">
                      Mon - Sat: 10:00 AM - 7:00 PM<br />
                      Sun: By Appointment Only
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 bg-gradient-to-r from-amber-600 to-orange-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 md:mb-6">
              Discover  Finest Crafts
            </h2>
            <p className="text-base md:text-xl text-amber-100 mb-6 md:mb-8 max-w-3xl mx-auto">
              Explore our curated collection of handcrafted treasures that bring the rich 
              artistic heritage of India to your home.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-amber-600 px-6 md:px-8 py-3 rounded-full font-semibold hover:bg-amber-50 transition-colors duration-300 text-sm md:text-base">
                View Collection
              </button>
              <button className="border-2 border-white text-white px-6 md:px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-amber-600 transition-colors duration-300 text-sm md:text-base">
                Contact Us
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs; 