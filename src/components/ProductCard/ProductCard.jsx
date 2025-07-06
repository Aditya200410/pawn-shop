import { Link } from 'react-router-dom';
import { ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useState, useEffect } from 'react';
import config from '../../config/config.js';
import { toast } from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart, cartItems } = useCart();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const isOutOfStock = product.stock === 0 || product.outOfStock === true || product.inStock === false;
  const cartQuantity = cartItems?.find(item => (item.product?._id || item.product?.id || item.id) === (product._id || product.id))?.quantity || 0;
  const isCartLimit = cartQuantity >= (product.stock || 0);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) {
      toast.error('Product is out of stock');
      return;
    }
    if (isCartLimit) {
      toast.error('Cannot add more than available stock');
      return;
    }
    try {
      const productId = product._id || product.id;
      if (!productId) {
        console.error('Product ID is missing');
        toast.error('Failed to add item to cart');
        return;
      }
      await addToCart(productId);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  const hasOptions = product.attributes && product.attributes.length > 0;

  const validImages = (product.images && Array.isArray(product.images))
    ? product.images.filter(img => {
        if (!img || typeof img !== 'string') return false;
        const ext = img.toLowerCase().split('.').pop();
        return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
      })
    : [];
  
  const mainImage = validImages.length > 0 ? config.fixImageUrl(validImages[currentImageIndex]) : config.fixImageUrl(product.image);

  const handlePreviousImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex(prev => prev === 0 ? validImages.length - 1 : prev - 1);
  };

  const handleNextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex(prev => prev === validImages.length - 1 ? 0 : prev + 1);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (validImages.length <= 1) return;
      
      if (e.key === 'ArrowLeft') {
        setCurrentImageIndex(prev => prev === 0 ? validImages.length - 1 : prev - 1);
      } else if (e.key === 'ArrowRight') {
        setCurrentImageIndex(prev => prev === validImages.length - 1 ? 0 : prev + 1);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [validImages.length]);

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1">
      <Link to={`/product/${product._id || product.id}`} className="block">
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-gray-50">
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-full object-cover object-center transition-transform duration-300 ease-in-out group-hover:scale-105"
            onError={e => {
              e.target.onerror = null;
              e.target.src = 'https://placehold.co/400x500/e2e8f0/475569?text=Image';
            }}
          />
          
          {/* Navigation Arrows - Only show if there are multiple images */}
          {validImages.length > 1 && (
            <>
              {/* More Images Indicator */}
              <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {validImages.length} photos
              </div>
              
              <button
                onClick={handlePreviousImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white text-[#8f3a61] rounded-full flex items-center justify-center shadow-md backdrop-blur-sm transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110"
                aria-label="Previous image"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white text-[#8f3a61] rounded-full flex items-center justify-center shadow-md backdrop-blur-sm transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110"
                aria-label="Next image"
              >
                <ChevronRight size={16} />
              </button>
              
              {/* Image Counter */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                {currentImageIndex + 1} / {validImages.length}
              </div>
              
              {/* Thumbnail Dots */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1 mt-8">
                {validImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setCurrentImageIndex(index);
                    }}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      index === currentImageIndex 
                        ? 'bg-white scale-125' 
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
          
          {isOutOfStock && (
            <div className="absolute top-3 right-3 bg-white/80 text-red-600 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm backdrop-blur-md">
              Out of Stock
            </div>
          )}
          {product.regularPrice && product.regularPrice > product.price && (
            <div className="absolute top-3 left-3 bg-[#8f3a61] text-white px-2.5 py-1.5 rounded-md text-xs font-semibold">
              -{Math.round(((product.regularPrice - product.price) / product.regularPrice) * 100)}%
            </div>
          )}
        </div>

        <div className="p-4 space-y-3 text-center">
          <h3 className="text-lg font-semibold text-gray-800 truncate group-hover:text-pink-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500">{product.category}</p>
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-xl font-bold text-[#8f3a61]">
              ₹{Math.round(product.price)}
            </span>
            {product.regularPrice && product.regularPrice > product.price && (
              <span className="text-base text-gray-400 line-through">
                ₹{Math.round(product.regularPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>

      <div className="px-4 pb-4">
        {hasOptions ? (
          <Link
            to={`/product/${product._id || product.id}`}
            className="w-full bg-[#8f3a61] text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-[#8f3a61]/90 transition-all duration-300 ease-in-out"
          >
            Select options
          </Link>
        ) : (
          <button
            onClick={handleAddToCart}
            className={`w-full font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 ease-in-out ${
              isOutOfStock || isCartLimit
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-[#8f3a61] text-white hover:bg-[#8f3a61]/90'
            }`}
            disabled={isOutOfStock || isCartLimit}
          >
            <ShoppingBag className="w-4 h-4" />
            {isOutOfStock ? 'Out of Stock' : isCartLimit ? 'Max Stock' : 'Add to cart'}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard; 