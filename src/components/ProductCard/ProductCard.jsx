import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
  };

  return (
    <div className="group relative bg-white rounded-lg shadow-sm overflow-hidden z-10">
      {/* Product Image */}
      <Link to={`/product/${product.id}`} className="block">
        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            onError={e => {
              e.target.onerror = null;
              e.target.src = 'https://placehold.co/400x400/e2e8f0/475569?text=Product+Image';
            }}
          />
        </div>
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-1">{product.name}</h3>
          <p className="text-sm text-gray-500 mb-2">{product.category}</p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-gray-900">₹{product.price.toFixed(2)}</span>
            <div className="flex items-center space-x-2 z-20">
              <button
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  // Add wishlist functionality here
                }}
              >
                <Heart className="w-5 h-5" />
              </button>
              <button
                className="p-2 text-gray-400 hover:text-orange-600 transition-colors"
                onClick={handleAddToCart}
              >
                <ShoppingBag className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard; 