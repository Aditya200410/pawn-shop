import { Link } from 'react-router-dom';
import { ShoppingBag, Star, Eye } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useState, useEffect } from 'react';
import config from '../../config/config.js';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
  };

  // Use the first valid image from images array if available, otherwise fallback to product.image
  const validImages = (product.images && Array.isArray(product.images))
    ? product.images.filter(img => {
        if (!img || typeof img !== 'string') return false;
        const ext = img.toLowerCase().split('.').pop();
        return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
      })
    : [];
  const mainImage = validImages.length > 0
    ? config.fixImageUrl(validImages[0])
    : config.fixImageUrl(product.image);

  return (
    <div className="group relative bg-white rounded-2xl  hover: transition-all d
    uration-400 ease-in-out overflow-hidden border border-gray-100 hover:border-amber-200 hover:-translate-y-1.5">
      {/* Product Image Container */}
      <Link to={`/product/${product.id}`} className="block relative">
        <div className="aspect-square w-full overflow-hidden bg-gray-50">
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-full object-cover object-center transition-transform duration-400 ease-in-out group-hover:scale-110"
            onError={e => {
              e.target.onerror = null;
              e.target.src = 'https://placehold.co/400x400/e2e8f0/475569?text=Product+Image';
            }}
          />

          {/* Subtle gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover: duration-400 ease-in-out" />

          {/* Badge for new/sale items */}
          {product.isNew && (
            <div className={`absolute top-3 left-3 bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-medium transform transition-all duration-300 ease-in-out group-hover:scale-105 group-hover:bg-amber-600 ${
              isMobile ? 'text-xs px-1.5 py-0.5' : ''
            }`}>
              New
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className={`${isMobile ? 'p-3' : 'p-4'} space-y-2`}>
          {/* Category */}
          <div className="flex items-center justify-between">
            <span className={`font-medium text-amber-600 uppercase tracking-wide transition-colors duration-300 ease-in-out group-hover:text-amber-700 ${
              isMobile ? 'text-xs' : 'text-xs'
            }`}>
              {product.category}
            </span>
            {/* Rating */}
            <div className="flex items-center gap-1">
              <Star className={`${isMobile ? 'w-2.5 h-2.5' : 'w-3 h-3'} fill-yellow-400 text-yellow-400`} />
              <span className={`text-gray-600 transition-colors duration-300 ease-in-out group-hover:text-gray-800 ${isMobile ? 'text-xs' : 'text-xs'}`}>{Number(product.rating).toFixed(1)}</span>
            </div>
          </div>

          {/* Product Name */}
          <h3 className={`font-semibold text-gray-900 leading-tight line-clamp-2 transition-colors duration-300 ease-in-out group-hover:text-amber-600 ${
            isMobile ? 'text-sm' : 'text-sm'
          }`}>
            {product.name}
          </h3>

          {/* Price */}
          <div className="space-y-1">
            <span className={`font-bold text-gray-900 transition-colors duration-300 ease-in-out group-hover:text-amber-600 ${isMobile ? 'text-sm' : 'text-lg'}`}>₹{product.price.toFixed(2)}</span>
            {product.regularPrice && product.regularPrice > product.price && (
              <div className="flex items-center gap-2">
                <span className={`text-gray-400 line-through ${isMobile ? 'text-xs' : 'text-sm'}`}>₹{product.regularPrice.toFixed(2)}</span>
                <span className={`bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium transform transition-transform duration-300 ease-in-out group-hover:scale-105 ${
                  isMobile ? 'text-xs px-1 py-0.5' : 'text-xs'
                }`}>
                  {Math.round(((product.regularPrice - product.price) / product.regularPrice) * 100)}% OFF
                </span>
              </div>
            )}
          </div>
        </div>
      </Link>

      {/* Add to Cart Button - Always Visible */}
      <div className={`${isMobile ? 'p-3 pt-0' : 'p-4 pt-0'}`}>
        <button
          onClick={handleAddToCart}
          className={`w-full bg-amber-600 text-white font-medium transition-all duration-300 ease-in-out shadow-sm rounded-xl flex items-center justify-center gap-2 hover:bg-amber-700  hover:-translate-y-0.5 ${
            isMobile 
              ? 'py-2 text-xs' 
              : 'py-3 text-sm'
          }`}
        >
          <ShoppingBag className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} transition-transform duration-300 ease-in-out group-hover:scale-110`} />
          Add to Cart
        </button>
      </div>

      {/* Subtle border animation */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-amber-200 rounded-2xl transition-colors duration-400 ease-in-out pointer-events-none" />
    </div>
  );
};

export default ProductCard; 