import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import orderService from '../services/orderService';
import config from '../config/config.js';
import { X } from 'lucide-react';

export default function Checkout() {
  const { cartItems, clearCart, getTotalPrice, getItemImage } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');

  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India',
    },
    paymentMethod: 'cod', // Default to Cash on Delivery
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        customerName: user.name || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  useEffect(() => {
    // Get applied coupon from localStorage if exists
    const savedCoupon = localStorage.getItem('appliedCoupon');
    const savedDiscount = localStorage.getItem('discountAmount');
    if (savedCoupon && savedDiscount) {
      setAppliedCoupon(JSON.parse(savedCoupon));
      setDiscountAmount(parseFloat(savedDiscount));
    }
  }, []);

  useEffect(() => {
    if (cartItems.length === 0 && !isSubmitting) {
      toast.error('Your cart is empty. Redirecting...');
      navigate('/cart');
    }
  }, [cartItems, navigate, isSubmitting]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      address: { ...prev.address, [name]: value }
    }));
  };

  const validateForm = () => {
    if (!formData.customerName || !formData.email || !formData.phone || !formData.address.street || !formData.address.city || !formData.address.pincode) {
      setError('Please fill all required fields.');
      return false;
    }
    return true;
  };

  const getFinalPrice = () => {
    const subtotal = getTotalPrice();
    return subtotal - discountAmount;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setError(null);

    const orderData = {
      ...formData,
      items: cartItems.map(item => ({
        productId: item.product?._id || item.id,
        name: item.product?.name || item.name,
        price: item.product?.price || item.price,
        quantity: item.quantity,
        image: getItemImage(item),
      })),
      totalAmount: getFinalPrice(),
      subtotal: getTotalPrice(),
      discount: discountAmount,
      coupon: appliedCoupon ? appliedCoupon.code : null,
      paymentStatus: formData.paymentMethod === 'cod' ? 'Pending' : 'Paid',
    };

    try {
      const response = await orderService.createOrder(orderData);
      if (response.success && response.order?._id) {
        // Clear applied coupon from localStorage
        localStorage.removeItem('appliedCoupon');
        localStorage.removeItem('discountAmount');
        
        toast.success('Order placed successfully!');
        await clearCart();
        navigate(`/order-confirmation/${response.order._id}`);
      } else {
        throw new Error(response.message || 'Failed to place order.');
      }
    } catch (err) {
      console.error('Checkout failed:', err);
      setError(err.message || 'An error occurred during checkout.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCouponSubmit = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setCouponLoading(true);
    setCouponError('');

    try {
      const response = await fetch(`${config.apiUrl}/api/coupons/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: couponCode,
          cartTotal: getTotalPrice()
        }),
      });

      const data = await response.json();

      if (data.success) {
        setAppliedCoupon(data.data.coupon);
        setDiscountAmount(data.data.discountAmount);
        toast.success(data.data.message);
        
        // Save coupon to localStorage
        localStorage.setItem('appliedCoupon', JSON.stringify(data.data.coupon));
        localStorage.setItem('discountAmount', data.data.discountAmount);
        
        // Apply the coupon
        await fetch(`${config.apiUrl}/api/coupons/apply`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code: couponCode }),
        });
      } else {
        setCouponError(data.message);
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error applying coupon:', error);
      setCouponError('Error applying coupon. Please try again.');
      toast.error('Error applying coupon. Please try again.');
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setCouponCode('');
    setCouponError('');
    localStorage.removeItem('appliedCoupon');
    localStorage.removeItem('discountAmount');
  };

  return (
    <div className="min-h-screen px-4 py-8 mt-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Checkout Form */}
          <div className="md:col-span-1">
            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 border-b pb-2">Shipping Information</h2>
              {error && <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>}

              <div className="space-y-4">
                <div>
                  <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input 
                    type="text" 
                    name="customerName" 
                    id="customerName" 
                    value={formData.customerName} 
                    onChange={handleInputChange} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                    required 
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input 
                      type="email" 
                      name="email" 
                      id="email" 
                      value={formData.email} 
                      onChange={handleInputChange} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                      required 
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                    <input 
                      type="tel" 
                      name="phone" 
                      id="phone" 
                      value={formData.phone} 
                      onChange={handleInputChange} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                      required 
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
                  <input 
                    type="text" 
                    name="street" 
                    id="street" 
                    value={formData.address.street} 
                    onChange={handleAddressChange} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                    required 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                    <input 
                      type="text" 
                      name="city" 
                      id="city" 
                      value={formData.address.city} 
                      onChange={handleAddressChange} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                      required 
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                    <input 
                      type="text" 
                      name="state" 
                      id="state" 
                      value={formData.address.state} 
                      onChange={handleAddressChange} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                      required 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">PIN Code *</label>
                    <input 
                      type="text" 
                      name="pincode" 
                      id="pincode" 
                      value={formData.address.pincode} 
                      onChange={handleAddressChange} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                      required 
                    />
                  </div>
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <input 
                      type="text" 
                      name="country" 
                      id="country" 
                      value={formData.address.country} 
                      onChange={handleAddressChange} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed" 
                      disabled 
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4 mt-6">
                <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                <div className="flex items-center p-3 border border-gray-200 rounded-lg">
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    id="cod" 
                    value="cod" 
                    checked={formData.paymentMethod === 'cod'} 
                    onChange={handleInputChange} 
                    className="h-4 w-4 text-orange-600 border-gray-300 focus:ring-orange-500" 
                  />
                  <label htmlFor="cod" className="ml-3 block text-sm font-medium text-gray-700">
                    Cash on Delivery (COD)
                  </label>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting} 
                className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium text-base"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Placing Order...
                  </div>
                ) : (
                  `Place Order (₹${getFinalPrice().toFixed(2)})`
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 border-b pb-2">Order Summary</h2>
              
              {/* Coupon Section */}
              <div className="mb-4 pb-4 border-b border-gray-100">
                {!appliedCoupon ? (
                  <form onSubmit={handleCouponSubmit} className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Enter coupon code"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        disabled={couponLoading}
                      />
                      <button
                        type="submit"
                        disabled={couponLoading || !couponCode.trim()}
                        className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px]"
                      >
                        {couponLoading ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          'Apply'
                        )}
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-red-500 text-sm">{couponError}</p>
                    )}
                  </form>
                ) : (
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-green-800 font-medium">{appliedCoupon.code}</span>
                        <p className="text-green-600 text-sm">
                          {appliedCoupon.discountType === 'percentage' 
                            ? `${appliedCoupon.discountValue}% off`
                            : `₹${appliedCoupon.discountValue} off`}
                        </p>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-green-700 hover:text-green-800"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {cartItems.map(item => (
                  <div key={item.product?._id || item.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img 
                        src={config.fixImageUrl(getItemImage(item))} 
                        alt={item.product?.name || item.name} 
                        className="w-16 h-16 object-cover rounded-md mr-4"
                        onError={e => {
                          e.target.onerror = null;
                          e.target.src = 'https://placehold.co/150x150/e2e8f0/475569?text=Product';
                        }}
                      />
                      <div>
                        <p className="font-semibold">{item.product?.name || item.name}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-semibold">₹{((item.product?.price || item.price) * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{getTotalPrice().toFixed(2)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="pt-3 border-t">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{getFinalPrice().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 