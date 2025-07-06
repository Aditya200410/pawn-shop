import React from 'react';
import { motion } from 'framer-motion';

const Loader = ({ size = 'medium', text = 'Loading...', fullScreen = false, showLogo = false, withHeaderFooter = false }) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-16 h-16',
    large: 'w-24 h-24',
    xlarge: 'w-32 h-32'
  };

  const textSizes = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
    xlarge: 'text-xl'
  };

  const LoaderContent = () => (
    <div className="flex flex-col items-center justify-center space-y-4">
      {showLogo && (
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { 
              duration: 2, 
              repeat: Infinity, 
              ease: "linear" 
            },
            scale: { 
              duration: 1.5, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }
          }}
          className={`${sizeClasses[size]} relative`}
        >
          <img 
            src="/logo.png" 
            alt="Logo" 
            className="w-full h-full object-contain"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://placehold.co/200x200/e2e8f0/475569?text=Logo';
            }}
          />
          <motion.div
            className="absolute inset-0 border-4 border-[#8f3a61]-600 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          />
        </motion.div>
      )}
      {!showLogo && (
        <motion.div
          className={`${sizeClasses[size]} border-4 border-[#8f3a61]-600 border-t-transparent rounded-full animate-spin`}
        />
      )}
      {text && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`text-gray-600 font-medium ${textSizes[size]} text-center`}
        >
          {text}
        </motion.div>
      )}
      {/* Loading dots */}
      <motion.div 
        className="flex space-x-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-[#8f3a61]-600 rounded-full"
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
      </motion.div>
    </div>
  );

  if (fullScreen) {
    if (withHeaderFooter) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
          {/* Header placeholder */}
          <div className="h-16 bg-white border-b border-gray-100"></div>
          
          {/* Main content area with loader */}
          <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-8rem)]">
            <LoaderContent />
          </div>
          
          {/* Footer placeholder */}
          <div className="h-16 bg-gray-900"></div>
        </div>
      );
    }
    
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
        <LoaderContent />
      </div>
    );
  }

  return <LoaderContent />;
};

export default Loader; 