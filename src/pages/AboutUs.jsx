import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Award, Users, Heart, Star } from 'lucide-react';

const AboutUs = () => {
  const stats = [
    { icon: Users, number: "5000+", label: "Happy Customers" },
    { icon: Award, number: "15+", label: "Years Experience" },
    { icon: Heart, number: "1000+", label: "Products Sold" },
    { icon: Star, number: "4.8", label: "Customer Rating" }
  ];

  const values = [
    {
      title: "Craftsmanship Excellence",
      description: "We take pride in delivering handcrafted products that showcase the finest traditional techniques combined with modern aesthetics.",
      icon: "🎨"
    },
    {
      title: "Authentic Heritage",
      description: "Every piece tells a story of India's rich cultural heritage, preserving traditional art forms for future generations.",
      icon: "🏛️"
    },
    {
      title: "Quality Assurance",
      description: "Rigorous quality checks ensure that every product meets our high standards before reaching your doorstep.",
      icon: "✨"
    },
    {
      title: "Customer First",
      description: "Your satisfaction is our priority. We're committed to providing exceptional service and support.",
      icon: "🤝"
    }
  ];

  const team = [
    {
      name: "Rajesh Kumar",
      role: "Founder & Master Craftsman",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
      description: "With over 20 years of experience in traditional Indian crafts."
    },
    {
      name: "Priya Sharma",
      role: "Creative Director",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face",
      description: "Bringing modern design sensibilities to traditional crafts."
    },
    {
      name: "Amit Patel",
      role: "Operations Head",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
      description: "Ensuring smooth operations and quality control."
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
              Our Story
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 md:mb-8 leading-relaxed">
              Preserving India's rich cultural heritage through exquisite handcrafted products, 
              bringing traditional artistry to modern homes worldwide.
            </p>
            <div className="w-16 md:w-24 h-1 bg-amber-600 mx-auto rounded-full"></div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="bg-amber-100 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <stat.icon className="w-6 h-6 md:w-8 md:h-8 text-amber-600" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">{stat.number}</div>
                <div className="text-sm md:text-base text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
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
                A Legacy of Craftsmanship
              </h2>
              <p className="text-base md:text-lg text-gray-600 mb-4 md:mb-6 leading-relaxed">
                Founded in 2008, Riko Craft began as a small family workshop dedicated to preserving 
                India's traditional art forms. What started with a handful of skilled artisans has 
                grown into a thriving community of craftsmen and women.
              </p>
              <p className="text-base md:text-lg text-gray-600 mb-4 md:mb-6 leading-relaxed">
                Today, we work with over 200 master craftsmen across India, each bringing their 
                unique skills and regional traditions to create products that are both timeless 
                and contemporary.
              </p>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                Our mission is to bridge the gap between traditional craftsmanship and modern 
                living, ensuring that these beautiful art forms continue to enrich homes and 
                lives for generations to come.
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
                  <div className="text-4xl md:text-6xl mb-3 md:mb-4">🏺</div>
                  <div className="text-lg md:text-2xl font-semibold">Traditional Artistry</div>
                  <div className="text-sm md:text-lg opacity-90">Modern Living</div>
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
              The principles that guide our work and shape our relationship with customers and artisans.
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

      {/* Team Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 md:mb-6">Meet Our Team</h2>
            <p className="text-base md:text-xl text-gray-600 max-w-3xl mx-auto">
              The passionate individuals behind Riko Craft, dedicated to bringing you the finest 
              handcrafted products from across India.
            </p>
          </motion.div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="relative mb-4 md:mb-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 md:w-48 md:h-48 rounded-full mx-auto object-cover shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                  />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-t from-amber-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-1 md:mb-2">{member.name}</h3>
                <p className="text-amber-600 font-medium mb-2 md:mb-3 text-sm md:text-base">{member.role}</p>
                <p className="text-sm md:text-base text-gray-600">{member.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8 md:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 md:mb-6">Visit Our Workshop</h2>
            <p className="text-base md:text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the magic of traditional craftsmanship firsthand at our workshop.
            </p>
          </motion.div>
          
          <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="bg-gray-200 rounded-2xl overflow-hidden shadow-lg h-64 md:h-96"
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.2219901290355!2d-74.00369368400567!3d40.71312937933185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a23e28c1191%3A0x49f75d3281df052a!2s150%20Park%20Row%2C%20New%20York%2C%20NY%2010007%2C%20USA!5e0!3m2!1sen!2sin!4v1645000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </motion.div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-4 md:space-y-6"
            >
              <div className="bg-amber-50 p-4 md:p-6 rounded-2xl">
                <div className="flex items-start space-x-3 md:space-x-4">
                  <MapPin className="w-5 h-5 md:w-6 md:h-6 text-amber-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1 md:mb-2 text-sm md:text-base">Address</h3>
                    <p className="text-gray-600 text-sm md:text-base">
                      150 Park Row, New York,<br />
                      NY 10007, USA
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-amber-50 p-4 md:p-6 rounded-2xl">
                <div className="flex items-start space-x-3 md:space-x-4">
                  <Phone className="w-5 h-5 md:w-6 md:h-6 text-amber-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1 md:mb-2 text-sm md:text-base">Phone</h3>
                    <p className="text-gray-600 text-sm md:text-base">+1 (555) 123-4567</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-amber-50 p-4 md:p-6 rounded-2xl">
                <div className="flex items-start space-x-3 md:space-x-4">
                  <Mail className="w-5 h-5 md:w-6 md:h-6 text-amber-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1 md:mb-2 text-sm md:text-base">Email</h3>
                    <p className="text-gray-600 text-sm md:text-base">info@rikocraft.com</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-amber-50 p-4 md:p-6 rounded-2xl">
                <div className="flex items-start space-x-3 md:space-x-4">
                  <Clock className="w-5 h-5 md:w-6 md:h-6 text-amber-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1 md:mb-2 text-sm md:text-base">Working Hours</h3>
                    <p className="text-gray-600 text-sm md:text-base">
                      Mon - Fri: 9:00 AM - 6:00 PM<br />
                      Sat: 10:00 AM - 4:00 PM<br />
                      Sun: Closed
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
              Experience Traditional Craftsmanship
            </h2>
            <p className="text-base md:text-xl text-amber-100 mb-6 md:mb-8 max-w-3xl mx-auto">
              Discover our collection of handcrafted products that bring the beauty of 
              traditional Indian artistry to your modern home.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-amber-600 px-6 md:px-8 py-3 rounded-full font-semibold hover:bg-amber-50 transition-colors duration-300 text-sm md:text-base">
                Explore Products
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