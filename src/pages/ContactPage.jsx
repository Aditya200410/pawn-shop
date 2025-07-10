import { motion } from "framer-motion";
import { useState } from "react";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageSquare, 
  Users, 
  Award, 
  Heart,
  Star,
  Truck,
  Shield,
  RefreshCw,
  Building,
  Globe,
  Package
} from "lucide-react";

export default function ContactPage() {
  const [activeTab, setActiveTab] = useState('contact');

  const tabs = [
    { id: 'contact', label: 'Contact Info', icon: MessageSquare },
    { id: 'about', label: 'About Riko Craft', icon: Building },
  
    { id: 'support', label: 'Customer Support', icon: Users }
  ];

  const companyStats = [
    { icon: Users, number: "500+", label: "Happy Customers" },
    { icon: Award, number: "2+", label: "Years Experience" },
    { icon: Heart, number: "200+", label: "Products Sold" },
    { icon: Star, number: "4.9", label: "Customer Rating" }
  ];

  const services = [
    {
      title: "Handcrafted Products",
      description: "Authentic Indian handicrafts including terracotta, dokra brass, wooden crafts, and handmade jewellery.",
      icon: Package
    },
    {
      title: "International Shipping",
      description: "We ship our products worldwide to Europe, USA, Canada, Middle East, Australia and more.",
      icon: Globe
    },
    {
      title: "Quality Assurance",
      description: "Each piece is carefully curated and quality checked to ensure it meets our high standards.",
      icon: Shield
    },
    {
      title: "Artisan Support",
      description: "We work directly with local artisans in Jharkhand, providing fair compensation and preserving traditional art forms.",
      icon: Heart
    }
  ];

  const supportInfo = [
    {
      title: "Delivery Time",
      description: "Products will be delivered within 5-7 days",
      icon: Truck
    },
    {
      title: "Refund Policy",
      description: "Refunds will be credited into original payment method within 5-7 business days",
      icon: RefreshCw
    },
    {
      title: "Replacement",
      description: "Replacements will be delivered within 5-7 days",
      icon: Package
    },
    {
      title: "Secure Payment",
      description: "Your payment is secured with SSL encryption",
      icon: Shield
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="bg-[#8f3a61] text-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Riko Enterprises
            </h1>
            <p className="text-xl md:text-2xl text-pink-100 max-w-3xl mx-auto">
              Connecting you with the finest Indian handicrafts and authentic cultural heritage
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
      

        {/* Tabs Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden"
        >
          {/* Tab Navigation */}
          <div className=" bg-[#8f3a61] p-2 text-white">
            <div className="flex flex-wrap gap-2 justify-center">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all duration-300 text-sm sm:text-base ${
                    activeTab === tab.id
                      ? 'bg-white text-pink-600 shadow-lg'
                      : 'text-white hover:text-pink-600 hover:bg-white/50'
                  }`}
                >
                  <tab.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-4 sm:p-8">
            {/* Contact Info Tab */}
            {activeTab === 'contact' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6 sm:space-y-8"
              >
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Get In Touch</h2>
                  <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                    We'd love to hear from you! Whether you have questions about our products, 
                    need assistance with an order, or want to learn more about our artisan community, 
                    we're here to help.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                  <div className="space-y-4 sm:space-y-6">
                    <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-6 bg-[#8f3a61]-50 rounded-2xl">
                      <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-pink-600 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Our Location</h3>
                        <p className="text-gray-600 text-sm sm:text-base">Jamshedpur, Jharkhand - 831004</p>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">Heart of India's craft heritage</p>
                      </div>
                    </div>

                    
                  </div>

                  <div className="space-y-4 sm:space-y-6">
                    <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-6 bg-[#8f3a61]-50 rounded-2xl">
                      <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-pink-600 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Email Address</h3>
                        <a href="mailto:care@Rikocraft.com" className="text-pink-600 hover:text-pink-700 font-medium text-sm sm:text-base">
                          care@Rikocraft.com
                        </a>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">We respond within 24 hours</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* About Riko Craft Tab */}
            {activeTab === 'about' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6 sm:space-y-8"
              >
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">About Riko Craft</h2>
                  <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-6">
                    Riko Craft is a registered proprietorship start-up company in India, dedicated to 
                    preserving and promoting the rich cultural heritage of Indian handicrafts.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                  <div className="space-y-4 sm:space-y-6">
                    <div className="p-4 sm:p-6 bg-[#8f3a61]-50 rounded-2xl">
                      <h3 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">Our Mission</h3>
                      <p className="text-gray-600 text-sm sm:text-base">
                        To connect global customers with authentic Indian handicrafts while empowering 
                        local artisans and preserving traditional art forms for future generations.
                      </p>
                    </div>

                    <div className="p-4 sm:p-6 bg-[#8f3a61]-50 rounded-2xl">
                      <h3 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">Our Heritage</h3>
                      <p className="text-gray-600 text-sm sm:text-base">
                        Based in Jamshedpur, Jharkhand, we source directly from local artisans, 
                        ensuring each piece authentically represents our rich cultural heritage.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 sm:space-y-6">
                    <div className="p-4 sm:p-6 bg-[#8f3a61]-50 rounded-2xl">
                      <h3 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">Artisan Empowerment</h3>
                      <p className="text-gray-600 text-sm sm:text-base">
                        We work closely with local craftsmen, providing them fair compensation 
                        and helping preserve traditional art forms that have been passed down for generations.
                      </p>
                    </div>

                    <div className="p-4 sm:p-6 bg-[#8f3a61]-50 rounded-2xl">
                      <h3 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">Quality Commitment</h3>
                      <p className="text-gray-600 text-sm sm:text-base">
                        Each piece is carefully curated and quality checked to ensure it meets 
                        our high standards of craftsmanship and authenticity.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Services Tab */}
            {activeTab === 'services' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6 sm:space-y-8"
              >
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
                  <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                    We offer a comprehensive range of services to bring the finest Indian handicrafts 
                    to your doorstep, wherever you are in the world.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {services.map((service, index) => (
                    <div key={index} className="p-4 sm:p-6 bg-[#8f3a61]-50 rounded-2xl border border-pink-100">
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#8f3a61]-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <service.icon className="w-5 h-5 sm:w-6 sm:h-6 text-pink-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">{service.title}</h3>
                          <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{service.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Customer Support Tab */}
            {activeTab === 'support' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6 sm:space-y-8"
              >
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Customer Support</h2>
                  <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                    We're committed to providing exceptional customer service and support 
                    throughout your shopping journey with us.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {supportInfo.map((info, index) => (
                    <div key={index} className="p-4 sm:p-6 bg-[#8f3a61]-50 rounded-2xl border border-pink-100">
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#8f3a61]-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <info.icon className="w-5 h-5 sm:w-6 sm:h-6 text-pink-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">{info.title}</h3>
                          <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{info.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-[#8f3a61]-50 rounded-2xl">
                  <h3 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">Need Immediate Help?</h3>
                  <p className="text-gray-600 mb-4 text-sm sm:text-base">
                    Our customer support team is available to assist you with any questions or concerns.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <a 
                      href="tel:+918340624635"
                      className="inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-[#8f3a61]-600 text-white rounded-xl font-medium hover:bg-[#8f3a61]-700 transition-colors text-sm sm:text-base"
                    >
                      <Phone className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Call Us Now
                    </a>
                    <a 
                      href="mailto:care@Rikocraft.com"
                      className="inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 border border-pink-600 text-pink-600 rounded-xl font-medium hover:bg-[#8f3a61]-600 hover:text-white transition-colors text-sm sm:text-base"
                    >
                      <Mail className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Send Email
                    </a>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
