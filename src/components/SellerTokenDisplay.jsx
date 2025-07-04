import React from 'react';
import { useCart } from '../context/CartContext';
import { Sparkles } from 'lucide-react';

const SellerTokenDisplay = () => {
  const { sellerToken } = useCart();

  if (!sellerToken) return null;

  return (
    <div className="flex items-center space-x-2 px-3 py-1 bg-pink-50 border border-pink-200 rounded-lg">
      <Sparkles size={16} className="text-pink-500" />
      <span className="text-xs font-medium text-pink-700">Seller</span>
      <span className="text-xs font-mono text-pink-600 bg-pink-100 px-2 py-0.5 rounded">
        {sellerToken.substring(0, 6)}...
      </span>
    </div>
  );
};

export default SellerTokenDisplay; 