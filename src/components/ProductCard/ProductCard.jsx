import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useState, useEffect } from 'react';
import config from '../../config/config.js';
import { toast } from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  
  const isOutOfStock = product.outOfStock === true || product.inStock === false;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) {
      toast.error('Product is out of stock');
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
  
  const mainImage = validImages.length > 0 ? config.fixImageUrl(validImages[0]) : config.fixImageUrl(product.image);

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
          <h3 className="text-lg font-semibold text-gray-800 truncate group-hover:text-orange-600 transition-colors">
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
              isOutOfStock
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-[#8f3a61] text-white hover:bg-[#8f3a61]/90'
            }`}
            disabled={isOutOfStock}
          >
            <ShoppingBag className="w-4 h-4" />
            {isOutOfStock ? 'Out of Stock' : 'Add to cart'}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard; 