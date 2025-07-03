import React from 'react';

const LoadingSpinner = ({ 
  size = 'md', 
  text = 'Loading...', 
  
  showText = true 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  return (
    <div className={`flex items-center justify-center bg-[#8f3a61]`}>
      <div className="text-center">
        <div className={`bg-[#8f3a61] animate-spin rounded-full border-b-2 border-pink-600 mx-auto ${sizeClasses[size]}`}></div>
        {showText && (
          <p className="text-gray-600 text-sm mt-2">{text}</p>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner; 