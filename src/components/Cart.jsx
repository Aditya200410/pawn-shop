import React from 'react';
import { XMarkIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cartItems, removeFromCart } = useCart();
  const navigate = useNavigate();

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price, 0);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      return;
    }
    
    // Navigate to checkout with cart data
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
          <p className="text-gray-400 mb-8">Looks like you haven't added any neon signs to your cart yet.</p>
          <Link
            to="/customizeneon"
            className="inline-block bg-neon-pink text-white px-8 py-3 rounded-lg font-semibold hover:bg-pink-600 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-dark-gray rounded-lg p-4 flex items-center gap-4">
                  <div className="w-24 h-24 bg-gray-800 rounded-lg overflow-hidden">
                    <img src={item.preview} alt={item.text} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.text}</h3>
                    <p className="text-gray-400 text-sm mt-1">
                      {item.color} • {item.size} • {item.font}
                    </p>
                    {item.type && (
                      <p className="text-gray-400 text-sm">Type: {item.type}</p>
                    )}
                    {item.shape && (
                      <p className="text-gray-400 text-sm">Shape: {item.shape}</p>
                    )}
                    {item.usage && (
                      <p className="text-gray-400 text-sm">Usage: {item.usage}</p>
                    )}
                    {item.addOns && item.addOns.length > 0 && (
                      <p className="text-gray-400 text-sm">
                        Add-ons: {item.addOns.join(', ')}
                      </p>
                    )}
                    {item.dimmer && (
                      <p className="text-gray-400 text-sm">Dimmer: Included</p>
                    )}
                    <p className="text-neon-pink font-semibold mt-2">₹{item.price}</p>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-gray-400 hover:text-neon-pink transition-colors"
                  >
                    <TrashIcon className="w-6 h-6" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-dark-gray rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal</span>
                  <span>₹{calculateTotal()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t border-gray-700 pt-3 flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold">₹{calculateTotal()}</span>
                </div>
              </div>

              <button 
                onClick={handleCheckout}
                className="w-full bg-neon-pink text-white py-3 rounded-lg font-semibold hover:bg-pink-600 transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 