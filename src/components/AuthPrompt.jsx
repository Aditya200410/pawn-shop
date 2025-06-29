import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, ShoppingBag, CreditCard, ArrowRight } from 'lucide-react';

const AuthPrompt = ({ 
  title = "Sign In Required", 
  message = "Please sign in to continue", 
  action = "cart",
  showSignup = true 
}) => {
  const getIcon = () => {
    switch (action) {
      case 'cart':
        return <ShoppingBag className="w-8 h-8" />;
      case 'checkout':
        return <CreditCard className="w-8 h-8" />;
      default:
        return <Lock className="w-8 h-8" />;
    }
  };

  const getActionText = () => {
    switch (action) {
      case 'cart':
        return 'Add to Cart';
      case 'checkout':
        return 'Proceed to Checkout';
      default:
        return 'Continue';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-[400px] flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-8"
    >
      <div className="text-center max-w-md">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-20 h-20 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          {getIcon()}
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-orange-900 mb-3"
        >
          {title}
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-orange-700 mb-8 leading-relaxed"
        >
          {message}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          <Link
            to="/login"
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
          >
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          {showSignup && (
            <div className="text-center">
              <p className="text-orange-600 text-sm mb-2">Don't have an account?</p>
              <Link
                to="/signup"
                className="text-orange-600 hover:text-orange-700 font-medium text-sm underline"
              >
                Create an account
              </Link>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 p-4 bg-orange-50 rounded-xl border border-orange-200"
        >
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs font-bold">!</span>
            </div>
            <div className="text-left">
              <p className="text-orange-800 text-sm font-medium mb-1">Why sign in?</p>
              <ul className="text-orange-700 text-xs space-y-1">
                <li>• Save your cart for later</li>
                <li>• Track your orders</li>
                <li>• Faster checkout process</li>
                <li>• Access to exclusive offers</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AuthPrompt; 