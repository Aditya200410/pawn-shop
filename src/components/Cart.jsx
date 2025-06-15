import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Plus, Minus, X, ArrowRight, Truck, Shield, RefreshCw } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice } = useCart();
  const navigate = useNavigate();

  return (
    <div className="container mt-10 mx-auto px-4 py-8">
      {/* Checkout Steps */}
      <div className="flex items-center justify-center mb-12">
        <div className="flex items-center">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-orange-600 text-white flex items-center justify-center text-lg font-medium">1</div>
            <div className="ml-3 text-orange-600 font-medium">Shopping cart</div>
          </div>
          <div className="w-24 h-0.5 bg-gray-300 mx-4"></div>
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-lg font-medium">2</div>
            <div className="ml-3 text-gray-600">Checkout</div>
          </div>
          <div className="w-24 h-0.5 bg-gray-300 mx-4"></div>
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-lg font-medium">3</div>
            <div className="ml-3 text-gray-600">Order complete</div>
          </div>
        </div>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-16">
          <ShoppingBag className="w-20 h-20 mx-auto text-gray-400 mb-6" />
          <h2 className="text-3xl font-semibold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8 text-lg">Looks like you haven't added any items to your cart yet.</p>
          <Link
            to="/shop"
            className="inline-block bg-orange-600 text-white px-8 py-4 rounded-full hover:bg-orange-700 transition-colors text-lg font-medium"
          >
            Return to Shop
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-2xl font-semibold text-gray-900">Shopping Cart ({cartItems.length} items)</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Product</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 hidden md:table-cell">Category</th>
                      <th className="px-6 py-4 text-center text-sm font-medium text-gray-600">Quantity</th>
                      <th className="px-6 py-4 text-right text-sm font-medium text-gray-600">Price</th>
                      <th className="px-6 py-4 text-right text-sm font-medium text-gray-600">Total</th>
                      <th className="px-6 py-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {cartItems.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-6">
                          <div className="flex items-center space-x-4">
                            <Link to={`/product/${item.id}`} className="block w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </Link>
                            <div>
                              <Link to={`/product/${item.id}`} className="text-gray-900 hover:text-orange-600 font-medium">
                                {item.name}
                              </Link>
                              <div className="text-sm text-gray-500 md:hidden mt-1">{item.category}</div>
                              {item.specifications && (
                                <div className="mt-2 space-y-1">
                                  {Object.entries(item.specifications).slice(0, 2).map(([key, value]) => (
                                    <p key={key} className="text-xs text-gray-500">
                                      {key}: {value}
                                    </p>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-6 text-gray-600 hidden md:table-cell">{item.category}</td>
                        <td className="px-6 py-6">
                          <div className="flex items-center justify-center space-x-3">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:border-orange-600 hover:text-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:border-orange-600 hover:text-orange-600 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-6 text-right text-gray-600">₹{item.price.toFixed(2)}</td>
                        <td className="px-6 py-6 text-right font-medium">₹{(item.price * item.quantity).toFixed(2)}</td>
                        <td className="px-6 py-6 text-right">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-gray-400 hover:text-red-600 transition-colors p-2"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
              <h3 className="text-xl font-semibold mb-6">Order Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>₹{getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-orange-600 text-white py-4 rounded-xl mt-6 hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2 text-lg font-medium"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              {/* Additional Info */}
              <div className="mt-8 space-y-4">
                <div className="flex items-start space-x-3">
                  <Truck className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">Free Shipping</h4>
                    <p className="text-sm text-gray-500">Free shipping on all orders</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">Secure Payment</h4>
                    <p className="text-sm text-gray-500">Your payment is secure</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <RefreshCw className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">Easy Returns</h4>
                    <p className="text-sm text-gray-500">30 days return policy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;