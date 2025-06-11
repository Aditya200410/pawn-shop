import { useState } from 'react';

const ProductCard = ({ product }) => {
  const { name, price, image, outOfStock } = product;
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const discountedPrice = (price * 1.2).toFixed(2);

  return (
    <div 
      className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="aspect-square overflow-hidden rounded-t-2xl relative">
        {!imageError ? (
          <img
            src={image}
            alt={name}
            className={`w-full h-full object-cover transition-transform duration-700 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Quick Add Overlay */}
        

       

        {/* Status Badge */}
        {outOfStock && (
          <div className="absolute top-4 right-4">
            <div className="bg-white/95 backdrop-blur-sm text-red-600 px-4 py-2 rounded-xl font-medium text-sm shadow-lg">
              Out of Stock
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow p-5">
        {/* Title */}
        <h3 className="text-lg font-medium text-gray-900 line-clamp-2 mb-4">
          {name}
        </h3>

        {/* Price and Action */}
        <div className="mt-auto">
          {/* Price */}
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">
                ${price.toFixed(2)}
              </span>
              <span className="text-sm text-gray-500 line-through">
                ${discountedPrice}
              </span>
            </div>
            <div className="text-sm text-green-600 font-medium mt-1">
              Save ${(discountedPrice - price).toFixed(2)}
            </div>
          </div>

          {/* Add to Cart Button - Full Width */}
          <button
            className={`
              w-full inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-medium
              transition-all duration-300
              ${outOfStock 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-primary text-white hover:bg-primary-dark hover:shadow-lg active:translate-y-0.5'
              }
            `}
            disabled={outOfStock}
          >
            {outOfStock ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Sold Out</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 