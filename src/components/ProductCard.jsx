import { useState } from 'react';
import { ShoppingBag } from 'lucide-react';

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
      className="group relative bg-white/30 backdrop-blur-md border border-white/20 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-4 flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <div className="relative overflow-hidden rounded-2xl aspect-square mb-4">
        {!imageError ? (
          <img
            src={image}
            alt={name}
            className={`w-full h-full object-cover transition-all duration-700 ease-in-out rounded-2xl 
              grayscale group-hover:grayscale-0 group-hover:scale-105`}
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-2xl">
            <span className="text-gray-400 text-sm">Image not available</span>
          </div>
        )}

        {/* Out of Stock Badge */}
        {outOfStock && (
          <div className="absolute top-3 right-3 bg-white/80 text-red-600 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm backdrop-blur-md">
            Out of Stock
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex flex-col flex-grow">
        <h3 className="text-gray-900 font-semibold text-lg mb-2 line-clamp-2">{name}</h3>

        {/* Price Section */}
        <div className="mb-5">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gray-900">₹{price.toFixed(2)}</span>
            <span className="text-sm line-through text-gray-500">₹{discountedPrice}</span>
          </div>
          <span className="text-green-600 text-sm font-medium">
            Save ₹{(discountedPrice - price).toFixed(2)}
          </span>
        </div>

        {/* Add to Cart Button */}
        <button
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-base transition-all duration-300
            ${
              outOfStock
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-black text-white hover:bg-neutral-800 hover:shadow-md'
            }`}
          disabled={outOfStock}
        >
          <ShoppingBag className="w-5 h-5" />
          {outOfStock ? 'Sold Out' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
