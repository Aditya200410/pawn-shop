import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Bars3Icon, 
  XMarkIcon, 
  ShoppingCartIcon, 
  MagnifyingGlassIcon,
  ChevronDownIcon,
  EnvelopeIcon,
  PhoneIcon,
  HomeIcon,
  ShoppingBagIcon,
  UserIcon,
  HeartIcon,
  QuestionMarkCircleIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import { 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedinIn, 
  FaYoutube,
  FaWhatsapp
} from 'react-icons/fa';

const navigation = [
  { 
    name: 'Home',
    href: '/',
    icon: HomeIcon
  },
  { 
    name: 'Shop',
    href: '/shop',
    icon: ShoppingBagIcon
  },
 
  { 
    name: 'Account',
    href: '/account',
    icon: UserIcon
  },
  { 
    name: 'Wishlist',
    href: '/wishlist',
    icon: HeartIcon,
    badge: '0'
  }
];

const categories = [
  { 
    name: 'Apparels', 
    href: '#',
    submenu: [
      {
        name: 'Accessories',
        items: ['Jewelry', 'Stole & Scarf']
      },
      {
        name: 'Men',
        items: ['Jackets', 'Kurtas']
      },
      {
        name: 'Women',
        items: ['Jackets', 'Full Length Dress', 'Short Length Dress', 'Sarees', 'Suit Pieces', 'Wrapper/Pants']
      }
    ]
  },
  { 
    name: 'Patachitra', 
    href: '#',
    submenu: [
      {
        name: 'Wall Hangings',
        items: []
      },
      {
        name: 'Other Articles',
        items: []
      }
    ]
  },
  { 
    name: 'Metal', 
    href: '#',
    submenu: [
      {
        name: 'Home Decor',
        items: []
      },
      {
        name: 'Kitchenware',
        items: []
      }
    ]
  },
  { 
    name: 'Grass & Bamboo', 
    href: '#',
    submenu: [
      {
        name: 'Bags',
        items: []
      },
      {
        name: 'Dining Accessories',
        items: []
      },
      {
        name: 'Lamp Shades',
        items: []
      },
      {
        name: 'Office Stationery',
        items: []
      },
      {
        name: 'Rugs and Mats',
        items: []
      }
    ]
  },
  { 
    name: 'Wood', 
    href: '#',
    submenu: [
      {
        name: 'Home Decor',
        items: []
      },
      {
        name: 'Jewellery Box',
        items: []
      },
      {
        name: 'Mirror',
        items: []
      },
      {
        name: 'Table Accents',
        items: []
      }
    ]
  },
  { 
    name: 'Terracotta & Clay', 
    href: '#',
    submenu: [
      {
        name: 'Kitchenware',
        items: []
      },
      {
        name: 'Home Decor',
        items: []
      },
      {
        name: 'Lamps',
        items: []
      },
      {
        name: 'Showpiece',
        items: []
      },
      {
        name: 'Miniature Dolls',
        items: []
      }
    ]
  },
  { 
    name: 'Wall Tiles', 
    href: '#',
    submenu: [
      {
        name: 'Mural',
        items: []
      },
      {
        name: 'Wall Art',
        items: []
      }
    ]
  },
  { 
    name: 'Others', 
    href: '#',
    submenu: []
  },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  return (
    <>
      {/* Spacer div for mobile fixed header */}
      <div className="h-[88px] lg:hidden"></div>

      <header className="bg-white">
        {/* Top bar - hidden on mobile */}
        <div className="hidden md:block bg-gray-100 py-2">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:justify-between items-center gap-2 md:gap-4">
              {/* Contact Info */}
              <div className="hidden md:flex items-center gap-6">
                <a 
                  href="mailto:info@srejonee.com" 
                  className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2"
                >
                  <EnvelopeIcon className="h-4 w-4" />
                  info@srejonee.com
                </a>
                <a 
                  href="tel:+917439906048" 
                  className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2"
                >
                  <PhoneIcon className="h-4 w-4" />
                  +91 74399 06048
                </a>
              </div>

              {/* Quick Links and Social Media */}
              <div className="flex items-center gap-6">
                {/* Quick Links */}
                <nav className="hidden md:flex items-center divide-x divide-gray-300">
                  <a href="/story" className="text-sm text-gray-600 hover:text-gray-900 px-4">Our Story</a>
                  <a href="/faq" className="text-sm text-gray-600 hover:text-gray-900 px-4">FAQ</a>
                  <a href="/blog" className="text-sm text-gray-600 hover:text-gray-900 px-4">Blog</a>
                  <a href="/contact" className="text-sm text-gray-600 hover:text-gray-900 px-4">Contact us</a>
                </nav>
                
                {/* Social Media Icons */}
                <div className="hidden md:flex items-center gap-4">
                  <a 
                    href="https://facebook.com/srejonee" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#8B4513] hover:text-[#6B3410] transition-colors"
                  >
                    <FaFacebookF className="w-4 h-4" />
                  </a>
                  <a 
                    href="https://twitter.com/srejonee" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#8B4513] hover:text-[#6B3410] transition-colors"
                  >
                    <FaTwitter className="w-4 h-4" />
                  </a>
                  <a 
                    href="https://instagram.com/srejonee" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#8B4513] hover:text-[#6B3410] transition-colors"
                  >
                    <FaInstagram className="w-4 h-4" />
                  </a>
                  <a 
                    href="https://linkedin.com/company/srejonee" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#8B4513] hover:text-[#6B3410] transition-colors"
                  >
                    <FaLinkedinIn className="w-4 h-4" />
                  </a>
                  <a 
                    href="https://youtube.com/srejonee" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#8B4513] hover:text-[#6B3410] transition-colors"
                  >
                    <FaYoutube className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-2">
            {/* Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="p-2"
            >
              <Bars3Icon className="h-6 w-6 text-gray-600" />
            </button>

            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <img
                className="h-12 w-auto"
                src="/logo.png"
                alt="Srejonee"
              />
            </Link>

            {/* Right Icons */}
            <div className="flex items-center gap-3">
              {/* Location */}
              <a 
                href="https://maps.google.com/?q=623+Active+Business+Park+54/10+D+C+Dey+Road+Tangra,+Kolkata"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-[#8B4513]"
              >
                <MapPinIcon className="h-5 w-5" />
              </a>

              {/* WhatsApp */}
              <a 
                href="https://wa.me/917439906048"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-[#25D366]"
              >
                <FaWhatsapp className="h-5 w-5" />
              </a>

              {/* Call */}
              <a 
                href="tel:+917439906048"
                className="text-gray-600 hover:text-[#8B4513]"
              >
                <PhoneIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Search Box */}
          <div className="px-4 py-2 border-t border-gray-100">
            <div className="relative">
              <input
                type="text"
                placeholder="Products search"
                className="w-full pl-4 pr-10 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8B4513] focus:border-transparent text-sm"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="container mx-auto px-4 py-2"
          >
            <nav className="flex items-center justify-between gap-4">
              {/* Logo */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex-shrink-0"
              >
                <Link to="/">
                  <img
                    className="h-16 max-w-[180px] w-auto"
                    src="/logo.png"
                    alt="Srejonee"
                  />
                </Link>
              </motion.div>

              {/* Search Box */}
             {/* Search */}
        <div className="hidden md:flex items-center w-full max-w-md mx-6">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search products"
              className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-[#8B4513] focus:outline-none"
            />
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

              {/* Desktop navigation */}
              <div className="flex items-center gap-x-8">
                {navigation.map((item) => (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    whileHover={{ scale: 1.05 }}
                    className="text-gray-600 hover:text-gray-900 flex items-center gap-1 relative"
                    title={item.name}
                  >
                    <item.icon className="h-5 w-5" />
                  </motion.a>
                ))}

                {/* Help Center Button */}
                <Link to="/contact">
                <motion.button 
                  whileHover={{ scale: 1.05 , backgroundColor: '#6B3410' }}
                  className="flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-gray-700 bg-[#8B4513] text-white rounded-full shadow-sm"
               
               >
                  <QuestionMarkCircleIcon className="h-4 w-4" />
                  Help Center
                </motion.button>
                </Link>
              </div>
            </nav>
          </motion.div>

          {/* Categories bar with dropdowns */}
          <div className=" border-gray-200">
            <div className="container max-w-7xl px-4">
              <div className="flex justify-between py-2">
                {categories.map((category) => (
                  <div
                    key={category.name}
                    className="relative group"
                    onMouseEnter={() => setActiveDropdown(category.name)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <motion.a
                      href={category.href}
                      whileHover={{ scale: 1.05 }}
                      className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
                    >
                      {category.name}
                      {category.submenu && category.submenu.length > 0 && (
                        <ChevronDownIcon className="h-4 w-4" />
                      )}
                    </motion.a>
                    
                    {/* Dropdown Menu */}
                    {category.submenu && category.submenu.length > 0 && activeDropdown === category.name && (
                      <div className="absolute left-0 mt-2 w-60 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                        {category.submenu.map((submenu) => (
                          <div key={submenu.name} className="p-4">
                            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-1">
                              {submenu.name}
                              {submenu.items && submenu.items.length > 0 && (
                                <ChevronDownIcon className="h-4 w-4" />
                              )}
                            </h3>
                            {submenu.items && submenu.items.length > 0 && (
                              <ul className="space-y-2">
                                {submenu.items.map((item) => (
                                  <li key={item}>
                                    <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                                      {item}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu Sidebar */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div className="fixed inset-0 bg-black/30" onClick={() => setMobileMenuOpen(false)} />
            <motion.div
              className="fixed inset-y-0 left-0 z-50 w-full overflow-y-auto bg-white px-4 py-4 sm:max-w-sm"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
            >
              <div className="flex items-center justify-between mb-4">
                <img
                  className="h-8"
                  src="/logo.png"
                  alt="Srejonee"
                />
                <button
                  type="button"
                  className="p-2 text-gray-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Categories Menu */}
              <div className="divide-y divide-gray-200">
                {categories.map((category) => (
                  <div key={category.name} className="py-3">
                    <a
                      href={category.href}
                      className="flex items-center justify-between text-base font-medium text-gray-900"
                    >
                      {category.name}
                      {category.submenu && category.submenu.length > 0 && (
                        <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                      )}
                    </a>
                    {category.submenu && category.submenu.length > 0 && (
                      <div className="mt-2 pl-4 space-y-2">
                        {category.submenu.map((submenu) => (
                          <div key={submenu.name} className="py-2">
                            <p className="text-sm font-medium text-gray-900">{submenu.name}</p>
                            {submenu.items && submenu.items.length > 0 && (
                              <ul className="mt-1 space-y-1">
                                {submenu.items.map((item) => (
                                  <li key={item}>
                                    <a href="#" className="block py-1 text-sm text-gray-600 hover:text-gray-900">
                                      {item}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Mobile Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden z-40">
          <nav className="flex justify-around items-center h-12">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="flex flex-col items-center justify-center text-gray-600 hover:text-[#8B4513] transition-colors py-1"
              >
                <item.icon className="h-5 w-5" />
                <span className="text-[10px] mt-0.5">{item.name}</span>
              </a>
            ))}
            <button
              className="flex flex-col items-center justify-center text-gray-600 hover:text-[#8B4513] transition-colors py-1 relative"
            >
              <ShoppingCartIcon className="h-5 w-5" />
              <span className="text-[10px] mt-0.5">Cart</span>
            </button>
          </nav>
        </div>
      </header>
    </>
  );
} 