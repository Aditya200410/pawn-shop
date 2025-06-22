import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FacebookIcon, InstagramIcon, TwitterIcon, YoutubeIcon, Star } from 'lucide-react';

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
    <footer 
      className="bg-cover bg-center text-white relative"
      style={{ backgroundImage: 'url(/footer.png)' }}
    >
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {/* Brand Section */}
            <div className="md:col-span-2">
              <div className="mb-6">
                {/* Logo and Description Row */}
                <div className="flex flex-col md:flex-row items-start gap-4 mb-4">
                  <img
                    src="/logo.png"
                    alt="Riko Craft"
                    className="h-14 md:h-16 w-auto"
                  />
                  <div className="flex-1">
                    <p className="text-gray-100 leading-relaxed text-sm">
                      Riko Craft offers nature-powered handcrafted treasures crafted with pure artistry for timeless beauty in your home.
                    </p>
                  </div>
                </div>
                
                {/* Rating */}
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-100">4.5/5</span>
                  <span className="text-sm text-gray-200">Based on 374 reviews</span>
                </div>

                {/* Social Media Links - Mobile Only */}
                <div className="flex items-center space-x-4 md:hidden">
                  <a href="#" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-amber-600 transition-colors duration-300 group">
                    <FacebookIcon className="w-5 h-5 text-gray-100 group-hover:text-white" />
                  </a>
                  <a href="#" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-amber-600 transition-colors duration-300 group">
                    <InstagramIcon className="w-5 h-5 text-gray-100 group-hover:text-white" />
                  </a>
                  <a href="#" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-amber-600 transition-colors duration-300 group">
                    <TwitterIcon className="w-5 h-5 text-gray-100 group-hover:text-white" />
                  </a>
                  <a href="#" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-amber-600 transition-colors duration-300 group">
                    <YoutubeIcon className="w-5 h-5 text-gray-100 group-hover:text-white" />
                  </a>
                </div>
              </div>
            </div>

            {/* Popular Categories and Useful Links Row - Mobile */}
            <div className="grid grid-cols-2 gap-6 md:hidden">
              {/* Popular Categories */}
              <div>
                <h4 className="text-base font-semibold text-white mb-4">Popular Categories</h4>
                <ul className="space-y-3">
                  <li>
                    <Link to="/shop" className="text-gray-100 hover:text-amber-500 transition-colors duration-300 text-sm block py-1">
                      Wooden Craft
                    </Link>
                  </li>
                  <li>
                    <Link to="/shop" className="text-gray-100 hover:text-amber-500 transition-colors duration-300 text-sm block py-1">
                      Terracotta Items
                    </Link>
                  </li>
                  <li>
                    <Link to="/shop" className="text-gray-100 hover:text-amber-500 transition-colors duration-300 text-sm block py-1">
                      Dokra Art
                    </Link>
                  </li>
                  <li>
                    <Link to="/shop" className="text-gray-100 hover:text-amber-500 transition-colors duration-300 text-sm block py-1">
                      Handmade Jewellery
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Useful Links */}
              <div>
                <h4 className="text-base font-semibold text-white mb-4">Useful Links</h4>
                <ul className="space-y-3">
                  <li>
                    <Link to="/" className="text-gray-100 hover:text-amber-500 transition-colors duration-300 text-sm block py-1">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link to="/about" className="text-gray-100 hover:text-amber-500 transition-colors duration-300 text-sm block py-1">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link to="/blog" className="text-gray-100 hover:text-amber-500 transition-colors duration-300 text-sm block py-1">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact" className="text-gray-100 hover:text-amber-500 transition-colors duration-300 text-sm block py-1">
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link to="/faq" className="text-gray-100 hover:text-amber-500 transition-colors duration-300 text-sm block py-1">
                      FAQ
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Popular Categories - Desktop */}
            <div className="hidden md:block">
              <h4 className="text-base font-semibold text-white mb-4">Popular Categories</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/shop" className="text-gray-100 hover:text-amber-500 transition-colors duration-300 text-sm block py-1">
                    Wooden Craft
                  </Link>
                </li>
                <li>
                  <Link to="/shop" className="text-gray-100 hover:text-amber-500 transition-colors duration-300 text-sm block py-1">
                    Terracotta Items
                  </Link>
                </li>
                <li>
                  <Link to="/shop" className="text-gray-100 hover:text-amber-500 transition-colors duration-300 text-sm block py-1">
                    Dokra Art
                  </Link>
                </li>
                <li>
                  <Link to="/shop" className="text-gray-100 hover:text-amber-500 transition-colors duration-300 text-sm block py-1">
                    Handmade Jewellery
                  </Link>
                </li>
              </ul>
            </div>

            {/* Useful Links - Desktop */}
            <div className="hidden md:block">
              <h4 className="text-base font-semibold text-white mb-4">Useful Links</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/" className="text-gray-100 hover:text-amber-500 transition-colors duration-300 text-sm block py-1">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-gray-100 hover:text-amber-500 transition-colors duration-300 text-sm block py-1">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className="text-gray-100 hover:text-amber-500 transition-colors duration-300 text-sm block py-1">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-100 hover:text-amber-500 transition-colors duration-300 text-sm block py-1">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="text-gray-100 hover:text-amber-500 transition-colors duration-300 text-sm block py-1">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/20 mt-6 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-sm text-gray-200 text-center md:text-left">
                © 2025 All Rights Reserved by Riko Craft.
              </p>
              {/* Social Media Links - Desktop Only */}
              <div className="hidden md:flex items-center space-x-3 md:space-x-4">
                <a href="#" className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-amber-600 transition-colors duration-300 group">
                  <FacebookIcon className="w-4 h-4 text-gray-100 group-hover:text-white" />
                </a>
                <a href="#" className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-amber-600 transition-colors duration-300 group">
                  <InstagramIcon className="w-4 h-4 text-gray-100 group-hover:text-white" />
                </a>
                <a href="#" className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-amber-600 transition-colors duration-300 group">
                  <TwitterIcon className="w-4 h-4 text-gray-100 group-hover:text-white" />
                </a>
                <a href="#" className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-amber-600 transition-colors duration-300 group">
                  <YoutubeIcon className="w-4 h-4 text-gray-100 group-hover:text-white" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 