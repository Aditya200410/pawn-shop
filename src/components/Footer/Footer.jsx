import { motion } from 'framer-motion';
import { 
  ShieldCheckIcon, 
  TruckIcon, 
  PhoneIcon, 
  LockClosedIcon 
} from '@heroicons/react/24/outline';
import { FacebookIcon, InstagramIcon, TwitterIcon, YoutubeIcon } from 'lucide-react';

const features = [
  {
    icon: ShieldCheckIcon,
    title: 'Ethically Sourced Handicrafts',
    description: 'Ethically Sourced Handicrafts'
  },
  {
    icon: TruckIcon,
    title: 'Fast & Safe Delivery',
    description: 'Fast and Safe delivery for all orders'
  },
  {
    icon: PhoneIcon,
    title: 'Dedicated Customer Support',
    description: 'Friendly 24/7 customer support'
  },
  {
    icon: LockClosedIcon,
    title: 'Secure Online Payment',
    description: 'We possess SSL/ Secure certificate'
  }
];

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
    <footer className="bg-black text-gray-700">
      <div className="container mx-auto px-4 py-16">
        {/* Logo and Description Section */}
        <div className="max-w-2xl mb-16">
          <div className="h-20 w-auto mb-6">
            <img
              src="/logo.JPG"
              alt="Loog"
              className="h-full w-auto object-contain"
            />
          </div>
          <p className="text-base text-white font-light leading-relaxed">
            We believe that your home deserves the best. That's why we offer an exclusive collection of premium items crafted with care. Our pieces are designed to not only enhance your living spaces but also stand the test of time, providing lasting beauty and durability.
          </p>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-medium text-white mb-6">Useful Links</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-white hover:text-white transition-colors">Home</a></li>
              <li><a href="#" className="text-white hover:text-white transition-colors">Shop</a></li>
              <li><a href="#" className="text-white hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="text-white hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="text-white hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-medium text-white mb-6">Categories</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-white hover:text-white transition-colors">Accessories</a></li>
              <li><a href="#" className="text-white hover:text-white transition-colors">Armchairs</a></li>
              <li><a href="#" className="text-white hover:text-white transition-colors">Beds</a></li>
              <li><a href="#" className="text-white hover:text-white transition-colors">Chairs</a></li>
              <li><a href="#" className="text-white hover:text-white transition-colors">Decor</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-medium text-white mb-6">Contact Us</h4>
            <ul className="space-y-3">
              <li className="text-white">Phone: +91 1234567890</li>
              <li className="text-white">Email: info@logo.com</li>
              <li className="text-white">Store Address: India</li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-lg font-medium text-white mb-6">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-white transition-colors">
                <FacebookIcon className="h-6 w-6" />
              </a>
              <a href="#" className="text-white hover:text-white transition-colors">
                <InstagramIcon className="h-6 w-6" />
              </a>
              <a href="#" className="text-white hover:text-white transition-colors">
                <TwitterIcon className="h-6 w-6" />
              </a>
              <a href="#" className="text-white hover:text-white transition-colors">
                <YoutubeIcon className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 mt-16 pt-8 text-sm text-center text-white">
          <p>© {new Date().getFullYear()} Riko Crafts, built with ❤️. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 