import { motion } from 'framer-motion';

const popularProducts = [
  'Apparels and Accessories',
  'Patachitra',
  'Terracotta & Clay',
  'Metal & Buffalo Horn',
  'Grass & Bamboo',
  'Wood',
];

const quickLinks = [
  'Our Story',
  'FAQ',
  'Blog',
  'Contact us',
];

const footerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <motion.div
        variants={footerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="container mx-auto px-4 py-16"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <motion.div variants={itemVariants} className="space-y-6">
            <img
              src="/logo-white.png"
              alt="Srejonee"
              className="h-12"
            />
            <p className="text-gray-400">
              We take pride in reintroducing the huge treasure trove of Bengal Handicraft to Indians
              in every corner of the country and the larger audience worldwide.
            </p>
          </motion.div>

          {/* Popular Products */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h3 className="text-lg font-semibold">Our Popular Products</h3>
            <ul className="space-y-3">
              {popularProducts.map((product) => (
                <li key={product}>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    {product}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h3 className="text-lg font-semibold">Quick Contact</h3>
            <div className="space-y-4">
              <p className="text-gray-400">
                <strong className="text-white">M/S Srejonee Art & Creations</strong>
                <br />
                623 Active Business Park
                <br />
                54/10 D C Dey Road Tangra,
                <br />
                Kolkata – 700015
                <br />
                West Bengal, India
              </p>
              <p className="text-gray-400">
                <strong className="text-white">Email:</strong>
                <br />
                <a href="mailto:info@srejonee.com" className="hover:text-white transition-colors">
                  info@srejonee.com
                </a>
              </p>
              <p className="text-gray-400">
                <strong className="text-white">Mobile no.:</strong>
                <br />
                <a href="tel:+917439906048" className="hover:text-white transition-colors">
                  +91 74399 06048
                </a>
              </p>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          variants={itemVariants}
          className="border-t border-gray-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center"
        >
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Srejonee Art & Creations | All rights reserved
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              Terms & Conditions
            </a>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
} 