import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bars3Icon, XMarkIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Our Story', href: '#' },
  { name: 'FAQ', href: '#' },
  { name: 'Blog', href: '#' },
  { name: 'Contact us', href: '#' },
];

const categories = [
  { name: 'Apparels', href: '#' },
  { name: 'Patachitra', href: '#' },
  { name: 'Metal', href: '#' },
  { name: 'Grass & Bamboo', href: '#' },
  { name: 'Wood', href: '#' },
  { name: 'Terracotta & Clay', href: '#' },
  { name: 'Wall Tiles', href: '#' },
  { name: 'Others', href: '#' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex-shrink-0"
          >
            <img
              className="h-12"
              src="/logo.png"
              alt="Srejonee"
            />
          </motion.div>

          {/* Desktop navigation */}
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <motion.a
                key={item.name}
                href={item.href}
                whileHover={{ scale: 1.05 }}
                className="text-sm font-semibold leading-6 text-gray-900 hover:text-primary"
              >
                {item.name}
              </motion.a>
            ))}
          </div>

          {/* Cart and mobile menu */}
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="relative p-2"
            >
              <ShoppingCartIcon className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </motion.button>

            <button
              type="button"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
          </div>
        </nav>

        {/* Categories bar */}
        <div className="hidden lg:block mt-4 border-t border-b border-gray-200">
          <div className="flex justify-between py-3">
            {categories.map((category) => (
              <motion.a
                key={category.name}
                href={category.href}
                whileHover={{ scale: 1.05 }}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                {category.name}
              </motion.a>
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
                src="/logo.png"
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
                    <a
                      key={category.name}
                      href={category.href}
                      className="block px-3 py-2 text-base leading-7 text-gray-900 hover:bg-gray-50"
                    >
                      {category.name}
                    </a>
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