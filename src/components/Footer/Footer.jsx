import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FacebookIcon, InstagramIcon, TwitterIcon, YoutubeIcon, Star, Mail, MapPin, Phone } from 'lucide-react';
import { categories } from '../../data/categories';

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
      className="relative text-white w-full z-[10000] transition-all duration-500 shadow-2xl backdrop-blur-md"
      style={{
        backgroundImage:
          "linear-gradient(135deg, rgba(119, 42, 75, 0.95) 0%, rgba(143, 58, 97, 0.95) 50%, rgba(119, 42, 75, 0.95) 100%), url(/footer.png)",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="absolute inset-0 bg-black/20 pointer-events-none rounded-t-3xl" />
      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="container mx-auto px-6 py-6 md:py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
            {/* Brand Section */}
            <div className="md:col-span-2">
              <div className="mb-8">
                {/* Logo and Description Row */}
                <div className="flex flex-col md:flex-row items-start gap-6 mb-6">
                  <img
                    src="/logo.png"
                    alt="Riko Craft"
                    className="h-16 md:h-20 w-auto drop-shadow-lg rounded-2xl bg-white/10 p-2"
                  />
                  <div className="flex-1">
                    <p className="text-gray-100 leading-relaxed text-base font-medium">
                      Riko Craft offers nature-powered handcrafted treasures crafted with pure artistry for timeless beauty in your home.
                    </p>
                  </div>
                </div>
                {/* Rating */}
                <div className="flex items-center space-x-3 mb-6">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-base text-gray-100 font-semibold">4.5/5</span>
                  <span className="text-base text-gray-200">Based on 374 reviews</span>
                </div>
                {/* Contact Details */}
                <div className="mb-6">
                  <h4 className="text-lg font-bold text-white mb-4 tracking-wide">Contact Details</h4>
                  <div className="space-y-3">
                    
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-pink-400 flex-shrink-0" />
                      <div className="text-base text-gray-100">
                        <a href="mailto:care@rikocraft.com" className="hover:text-pink-400 transition-colors duration-200 font-medium">
                          care@rikocraft.com
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-pink-400 flex-shrink-0" />
                      <div className="text-base text-gray-100 font-medium">
                        Jamshedpur, Jharkhand - 831004
                      </div>
                    </div>
                  </div>
                </div>
                {/* Social Media Links - Mobile Only */}
                <div className="flex items-center space-x-4 md:hidden mt-6">
                  <a href="#" className="w-11 h-11 bg-white/20 rounded-full flex items-center justify-center hover:bg-pink-600 transition-all duration-200 group shadow-lg">
                    <FacebookIcon className="w-6 h-6 text-gray-100 group-hover:text-white" />
                  </a>
                  <a href="#" className="w-11 h-11 bg-white/20 rounded-full flex items-center justify-center hover:bg-pink-600 transition-all duration-200 group shadow-lg">
                    <InstagramIcon className="w-6 h-6 text-gray-100 group-hover:text-white" />
                  </a>
                </div>
              </div>
            </div>
            {/* Popular Categories and Useful Links - Mobile View Side-by-Side */}
            <div className="md:hidden grid grid-cols-2 gap-6">
              {/* Popular Categories */}
              <div>
                <h4 className="text-lg font-bold text-white mb-4 tracking-wide">Popular Categories</h4>
                <ul className="space-y-3">
                  {categories.slice(0, 4).map((category) => (
                    <li key={category.name}>
                      <Link 
                        to={`/shop?category=${encodeURIComponent(category.name)}`}
                        className="text-gray-100 hover:text-pink-400 transition-colors duration-200 text-base block py-1 font-medium"
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Useful Links */}
              <div>
                <h4 className="text-lg font-bold text-white mb-4 tracking-wide">Useful Links</h4>
                <ul className="space-y-3">
                  <li>
                    <Link to="/" className="text-gray-100 hover:text-pink-400 transition-colors duration-200 text-base block py-1 font-medium">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link to="/about" className="text-gray-100 hover:text-pink-400 transition-colors duration-200 text-base block py-1 font-medium">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link to="/seller" className="text-gray-100 hover:text-pink-400 transition-colors duration-200 text-base block py-1 font-medium">
                      Seller Program
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact" className="text-gray-100 hover:text-pink-400 transition-colors duration-200 text-base block py-1 font-medium">
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link to="/faq" className="text-gray-100 hover:text-pink-400 transition-colors duration-200 text-base block py-1 font-medium">
                      FAQ
                    </Link>
                  </li>
                  <li>
                    <Link to="/policies" className="text-gray-100 hover:text-pink-400 transition-colors duration-200 text-base block py-1 font-medium">
                      Policies
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            {/* Popular Categories - Desktop */}
            <div className="hidden md:block">
              <h4 className="text-lg font-bold text-white mb-4 tracking-wide">Popular Categories</h4>
              <ul className="space-y-3">
                {categories.map((category) => (
                  <li key={category.name}>
                    <Link 
                      to={`/shop?category=${encodeURIComponent(category.name)}`}
                      className="text-gray-100 hover:text-pink-400 transition-colors duration-200 text-base block py-1 font-medium"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            {/* Useful Links - Desktop */}
            <div className="hidden md:block">
              <h4 className="text-lg font-bold text-white mb-4 tracking-wide">Useful Links</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/" className="text-gray-100 hover:text-pink-400 transition-colors duration-200 text-base block py-1 font-medium">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-gray-100 hover:text-pink-400 transition-colors duration-200 text-base block py-1 font-medium">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className="text-gray-100 hover:text-pink-400 transition-colors duration-200 text-base block py-1 font-medium">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-100 hover:text-pink-400 transition-colors duration-200 text-base block py-1 font-medium">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="text-gray-100 hover:text-pink-400 transition-colors duration-200 text-base block py-1 font-medium">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link to="/policies" className="text-gray-100 hover:text-pink-400 transition-colors duration-200 text-base block py-1 font-medium">
                    Policies
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          {/* Bottom Bar */}
          <div className="border-t border-white mt-4 pt-3 pb-2">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
              <p className="text-sm text-gray-200 text-center md:text-left font-medium">
                © 2025 All Rights Reserved by Riko Craft.
              </p>
              {/* Social Media Links - Desktop Only */}
              <div className="hidden md:flex items-center space-x-3">
                <a href="#" className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-pink-600 transition-all duration-200 group shadow-lg">
                  <FacebookIcon className="w-5 h-5 text-gray-100 group-hover:text-white" />
                </a>
                <a href="https://www.instagram.com/riko.craft?igsh=YWlsZmRnNmk5eXp2" className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-pink-600 transition-all duration-200 group shadow-lg">
                  <InstagramIcon className="w-5 h-5 text-gray-100 group-hover:text-white" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
