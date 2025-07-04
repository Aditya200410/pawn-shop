import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ShoppingBag, Plus, Minus, X, ArrowRight, Truck, Shield, RefreshCw, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import config from '../config/config.js';
import { toast } from 'react-hot-toast';
import AuthPrompt from './AuthPrompt';
import { useSellerNavigation } from '../hooks/useSellerNavigation';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice, loading, getItemImage, sellerToken, setSellerTokenFromURL } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { navigateToCheckout } = useSellerNavigation();

  // Handle seller token from URL
  React.useEffect(() => {
    const urlSellerToken = searchParams.get('seller');
    if (urlSellerToken) {
      setSellerTokenFromURL(urlSellerToken);
    }
  }, [searchParams, setSellerTokenFromURL]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  // Show authentication prompt if user is not signed in
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8 mt-16 md:mt-20">
        <AuthPrompt 
          title="Sign In to View Cart"
          message="Please sign in to view and manage your shopping cart. Your cart items will be saved and you can continue shopping from where you left off."
          action="cart"
        />
      </div>
    );
  }

  return (
    <motion.div
      className="container mx-auto px-2 py-4 mt-6 md:mt-8"
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
    >
      {/* Checkout Steps */}
      <motion.div
        className="flex items-center justify-center mb-4 md:mb-6 overflow-x-auto"
        variants={fadeInUp}
      >
        <div className="flex items-center min-w-max">
          {/* Step 1 */}
         {/* Stepper Section */}
<div className="flex flex-col md:flex-row items-start md:items-center justify-center gap-2 md:gap-0 mb-4 md:mb-6">
  {/* Step 1 */}
  <div className="flex items-center">
    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#8f3a61] text-white flex items-center justify-center text-sm md:text-lg font-medium">1</div>
    <div className="ml-2 md:ml-3 text-sm md:text-base text-pink-600 font-medium text-left">
      <span>Shopping Cart</span>
    </div>
  </div>

  <div className="hidden md:block w-16 md:w-24 h-0.5 bg-gray-300 mx-2 md:mx-4"></div>

  {/* Step 2 */}
  <div className="flex items-center">
    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-sm md:text-lg font-medium">2</div>
    <div className="ml-2 md:ml-3 text-sm md:text-base text-gray-600 text-left">
      <span>Checkout</span>
    </div>
  </div>

  <div className="hidden md:block w-16 md:w-24 h-0.5 bg-gray-300 mx-2 md:mx-4"></div>

  {/* Step 3 */}
  <div className="flex items-center">
    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-sm md:text-lg font-medium">3</div>
    <div className="ml-2 md:ml-3 text-sm md:text-base text-gray-600 text-left">
      <span>Order Complete</span>
    </div>
  </div>
</div>

        </div>
      </motion.div>

      {cartItems.length === 0 ? (
        <motion.div className="text-center py-8 md:py-10" variants={fadeInUp}>
          <ShoppingBag className="w-16 h-16 md:w-20 md:h-20 mx-auto text-gray-400 mb-4 md:mb-6" />
          <h2 className="text-2xl md:text-3xl font-semibold mb-2 md:mb-3">Your cart is empty</h2>
          <p className="text-gray-600 mb-4 md:mb-5 text-base md:text-lg">Looks like you haven't added any items yet.</p>
          <Link
            to="/shop"
            className="inline-block bg-[#8f3a61] text-white px-5 md:px-7 py-2.5 md:py-3.5 rounded-full hover:bg-[#8f3a61] transition-colors text-base md:text-lg font-medium"
          >
            Return to Shop
          </Link>
        </motion.div>
      ) : (
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {/* Cart Items */}
          <motion.div className="lg:col-span-2 bg-white rounded-2xl shadow-sm overflow-hidden" variants={fadeInUp}>
            <div className="p-4 md:p-6 border-b border-gray-100">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900">Shopping Cart ({cartItems.length} items)</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-sm font-medium text-gray-600">Product</th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-left text-sm font-medium text-gray-600 hidden md:table-cell">Category</th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-center text-sm font-medium text-gray-600">Quantity</th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-right text-sm font-medium text-gray-600">Price</th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-right text-sm font-medium text-gray-600">Total</th>
                    <th className="px-4 md:px-6 py-3 md:py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {cartItems.map((item) => (
                    <motion.tr
                      key={item.productId || item.product?._id || item.id}
                      className="hover:bg-gray-50/50 transition-colors"
                      variants={fadeInUp}
                    >
                      <td className="px-4 md:px-6 py-4 md:py-6">
                        <div className="flex items-center space-x-3 md:space-x-4">
                          <Link to={`/product/${item.productId || item.product?._id || item.id}`} className="block w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            <img 
                              src={config.fixImageUrl(getItemImage(item))} 
                              alt={item.product?.name || item.name} 
                              className="w-full h-full object-cover"
                              onError={e => {
                                e.target.onerror = null;
                                // Try fallback images
                                if (item.product?.images && item.product.images.length > 0) {
                                  const nextImage = item.product.images.find(img => img !== e.target.src);
                                  if (nextImage) {
                                    e.target.src = config.fixImageUrl(nextImage);
                                    return;
                                  }
                                }
                                // Final fallback
                                e.target.src = 'https://placehold.co/150x150/e2e8f0/475569?text=Product';
                              }}
                            />
                          </Link>
                          <div className="min-w-0 flex-1">
                            <Link to={`/product/${item.productId || item.product?._id || item.id}`} className="text-gray-900 hover:text-pink-600 font-medium text-sm md:text-base line-clamp-2">
                              {item.product?.name || item.name}
                            </Link>
                            <div className="text-sm text-gray-500 md:hidden mt-1">{item.product?.category || item.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4 md:py-6 text-gray-600 hidden md:table-cell">{item.product?.category || item.category}</td>
                      <td className="px-4 md:px-6 py-4 md:py-6 text-center">
                        <div className="flex items-center justify-center space-x-2 md:space-x-3">
                          <button 
                            onClick={() => updateQuantity(item.productId || item.product?._id || item.id, item.quantity - 1)} 
                            className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-300 hover:border-pink-600 hover:text-pink-600 transition disabled:opacity-50" 
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-medium">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.productId || item.product?._id || item.id, item.quantity + 1)} 
                            className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-300 hover:border-pink-600 hover:text-pink-600 transition"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4 md:py-6 text-right text-sm">₹{item.product?.price || item.price}</td>
                      <td className="px-4 md:px-6 py-4 md:py-6 text-right font-medium text-sm">₹{((item.product?.price || item.price) * item.quantity).toFixed(2)}</td>
                      <td className="px-4 md:px-6 py-4 md:py-6 text-right">
                        <button 
                          onClick={() => removeFromCart(item.productId || item.product?._id || item.id)} 
                          className="text-gray-400 hover:text-red-600 transition p-1.5"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Order Summary */}
          <motion.div className="bg-white rounded-2xl shadow-sm p-3 md:p-4 sticky top-20" variants={fadeInUp}>
            <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Order Summary</h3>

            <div className="space-y-2">
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Subtotal</span>
                <span>₹{getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between font-semibold text-base">
                  <span>Total</span>
                  <span>₹{getTotalPrice().toFixed(2)}</span>
                </div>
              </div>
            </div>

           
            <button
              onClick={navigateToCheckout}
              className="w-full bg-[#8f3a61] text-white py-2.5 rounded-xl mt-4 hover:bg-[#8f3a61] transition-colors flex items-center justify-center space-x-2 text-base font-medium"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            {/* Info */}
            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <div className="flex items-start gap-2"><Truck className="w-4 h-4" /> Free Shipping above ₹499</div>
              <div className="flex items-start gap-2"><Shield className="w-4 h-4" /> Secure Payment</div>
              <div className="flex items-start gap-2"><RefreshCw className="w-4 h-4" /> Easy Returns</div>
              
              {/* Timeframes Section */}
              <div className="mt-3 pt-3 border-t border-gray-200 space-y-1.5">
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 mt-0.5" />
                  <div>
                    <span className="font-medium">Delivery:</span> Products will be delivered within 5-7 days
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <RefreshCw className="w-4 h-4 mt-0.5" />
                  <div>
                    <span className="font-medium">Refunds:</span> Will be credited into original payment method within 5-7 business days
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Truck className="w-4 h-4 mt-0.5" />
                  <div>
                    <span className="font-medium">Replacements:</span> Will be delivered within 5-7 days
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Cart;
