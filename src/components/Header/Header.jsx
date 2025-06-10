import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bars3Icon, 
  XMarkIcon, 
  ShoppingCartIcon, 
  MagnifyingGlassIcon,
  ChevronDownIcon 
} from '@heroicons/react/24/outline';

const navigation = [
  { 
    name: 'Our Story', 
    href: '#',
  },
  { 
    name: 'FAQ', 
    href: '#',
  },
  { 
    name: 'Blog', 
    href: '#',
  },
  { 
    name: 'Contact us', 
    href: '#',
  },
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
    <header className="bg-white">
      {/* Top bar */}
      <div className="bg-gray-100 py-2">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex gap-4">
            <a href="mailto:info@srejonee.com" className="text-sm text-gray-600 hover:text-gray-900">
              info@srejonee.com
            </a>
            <a href="tel:+917439906048" className="text-sm text-gray-600 hover:text-gray-900">
              +91 74399 06048
            </a>
          </div>
        </div>
      </div>

      {/* Main header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4 py-4"
      >
        <nav className="flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex-shrink-0"
          >
            <img
              className="h-24 w-auto"
              src="/logo.JPG"
              alt="Srejonee"
            />
          </motion.div>

          {/* Search Box */}
          <div className="relative w-full max-w-md mx-auto lg:mx-0">
            <input
              type="text"
              placeholder="Products search"
              className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </button>
          </div>

          {/* Desktop navigation and cart */}
          <div className="hidden lg:flex lg:items-center lg:gap-x-8">
            {navigation.map((item) => (
              <motion.a
                key={item.name}
                href={item.href}
                whileHover={{ scale: 1.05 }}
                className="text-sm font-semibold leading-6 text-gray-900 hover:text-primary flex items-center gap-1"
              >
                {item.name}
                {item.submenu && (
                  <ChevronDownIcon className="h-4 w-4" />
                )}
              </motion.a>
            ))}

            {/* Cart */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="relative p-2"
            >
              <ShoppingCartIcon className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </motion.button>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        </nav>

        {/* Categories bar with dropdowns */}
        <div className="hidden lg:block mt-4 border-t border-b border-gray-200">
          <div className="flex justify-between py-3">
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
      </motion.div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: '100%' }}
          className="fixed inset-0 z-50 lg:hidden"
        >
          <div className="fixed inset-0 bg-black/30" onClick={() => setMobileMenuOpen(false)} />
          <motion.div
            className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
          >
            <div className="flex items-center justify-between">
              <img
                className="h-8"
                src="/logo.JPG"
                alt="Srejonee"
              />
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="block px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
                <div className="py-6">
                  {categories.map((category) => (
                    <div key={category.name}>
                      <a
                        href={category.href}
                        className="block px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      >
                        {category.name}
                      </a>
                      {category.submenu && category.submenu.length > 0 && (
                        <div className="pl-6">
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
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </header>
  );
} 