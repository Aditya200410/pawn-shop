import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { 
  ArrowLeft, 
  CreditCard, 
  Lock, 
  MapPin, 
  Phone, 
  User, 
  Mail, 
  Building, 
  Truck, 
  Shield,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Gift,
  Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import orderService from '../services/orderService';
import paymentService from '../services/paymentService';
import { toast } from 'react-hot-toast';
import config from '../config/config.js';
import apiService from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import Loader from '../components/Loader';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice, clearCart, getItemImage, sellerToken, setSellerTokenFromURL, clearSellerToken } = useCart();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  
  // Get seller token from URL parameters and set it in context
  const urlSellerToken = searchParams.get('seller');
  
  // Set seller token from URL if present
  useEffect(() => {
    if (urlSellerToken) {
      setSellerTokenFromURL(urlSellerToken);
    }
  }, [urlSellerToken, setSellerTokenFromURL]);
  
  const [activeStep, setActiveStep] = useState('shipping');
  const [formData, setFormData] = useState({
    // Shipping Information
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    zipCode: user?.zipCode || '',
    country: user?.country || 'India',
    
    // Billing Information
    billingSameAsShipping: true,
    billingFirstName: '',
    billingLastName: '',
    billingEmail: '',
    billingPhone: '',
    billingAddress: '',
    billingCity: '',
    billingState: '',
    billingZipCode: '',
    billingCountry: 'India',
    
    // Payment Information
    paymentMethod: 'cod'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  // Pre-fill form with user data if logged in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName || user.name?.split(' ')[0] || '',
        lastName: user.lastName || user.name?.split(' ').slice(1).join(' ') || '',
        email: user.email || '',
        phone: user.phone || '',
      }));
    }
  }, [user]);

  // Copy shipping address to billing when checkbox is checked
  useEffect(() => {
    if (formData.billingSameAsShipping) {
      setFormData(prev => ({
        ...prev,
        billingFirstName: prev.firstName,
        billingLastName: prev.lastName,
        billingEmail: prev.email,
        billingPhone: prev.phone,
        billingAddress: prev.address,
        billingCity: prev.city,
        billingState: prev.state,
        billingZipCode: prev.zipCode,
        billingCountry: prev.country,
      }));
    }
  }, [formData.billingSameAsShipping, formData.firstName, formData.lastName, formData.email, formData.phone, formData.address, formData.city, formData.state, formData.zipCode, formData.country]);

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const validateForm = () => {
    const errors = {};
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode'];
    
    requiredFields.forEach(field => {
      if (!formData[field] || formData[field].trim() === '') {
        errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.email = 'Invalid email format';
    }

    // Phone validation
    const phoneRegex = /^[\d\s-+()]{10,}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      errors.phone = 'Invalid phone number';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Basic validation
    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      setLoading(false);
      return;
    }

    // Validate form fields
    if (!validateForm()) {
      setError("Please fill in all required fields correctly.");
      setLoading(false);
      return;
    }

    const orderData = {
      customerName: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      pincode: formData.zipCode,
      country: formData.country,
      items: cartItems.map(item => ({
        productId: item.product?._id || item.id,
        name: item.product?.name || item.name,
        quantity: item.quantity,
        price: item.product?.price || item.price,
        image: getItemImage(item)
      })),
      totalAmount: getTotalPrice(),
      paymentMethod: formData.paymentMethod,
      paymentStatus: formData.paymentMethod === 'cod' ? 'pending' : 'processing',
      sellerToken: sellerToken, // Include seller token if present
      couponCode: appliedCoupon ? appliedCoupon.code : undefined // Pass coupon code to backend
    };
    
    try {
      const response = await orderService.createOrder(orderData);

      if (response.success) {
        toast.success('Order placed successfully!');
        if (sellerToken) {
          toast.success('Seller commission has been tracked!');
        }
        clearCart(); // Clear cart on successful order
        clearSellerToken();
        navigate('/account?tab=orders');
      } else {
        setError(response.message || "Failed to create order. Please try again.");
        toast.error(response.message || "Failed to create order.");
      }
    } catch (err) {
      console.error('Order creation error:', err);
      setError("Failed to create order. Please try again.");
      toast.error("Failed to create order.");
    } finally {
      setLoading(false);
    }
  };

  const handleRazorpayPayment = async () => {
    setPaymentProcessing(true);
    setError(null);

    try {
      // Validate form first
      if (!validateForm()) {
        setError("Please fill in all required fields correctly.");
        setPaymentProcessing(false);
        return;
      }

      const orderData = {
        amount: getTotalPrice(),
        orderId: `order_${Date.now()}`
      };

      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address
      };

      // Initiate Razorpay payment
      const paymentResult = await paymentService.initiatePayment(orderData, userData);

      if (paymentResult.success) {
        // Create order in backend
        const orderData = {
          customerName: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.zipCode,
          country: formData.country,
          items: cartItems.map(item => ({
            productId: item.product?._id || item.id,
            name: item.product?.name || item.name,
            quantity: item.quantity,
            price: item.product?.price || item.price,
            image: getItemImage(item)
          })),
          totalAmount: getTotalPrice(),
          paymentMethod: 'razorpay',
          paymentStatus: 'Paid',
          paymentId: paymentResult.payment_id,
          razorpayOrderId: paymentResult.order_id,
          couponCode: appliedCoupon ? appliedCoupon.code : undefined // Pass coupon code to backend
        };

        const orderResponse = await orderService.createOrder(orderData);

        if (orderResponse.success) {
          toast.success('Payment successful! Order placed successfully!');
          clearCart();
          clearSellerToken();
          navigate('/account?tab=orders');
        } else {
          setError("Payment successful but order creation failed. Please contact support.");
          toast.error("Payment successful but order creation failed.");
        }
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError(error.message || "Payment failed. Please try again.");
      toast.error(error.message || "Payment failed.");
    } finally {
      setPaymentProcessing(false);
    }
  };

  const handleCouponSubmit = async (e) => {
    e.preventDefault(); // Prevent form submission
    e.stopPropagation(); // Stop event bubbling
    if (!couponCode.trim()) return;

    setCouponLoading(true);
    setCouponError('');

    try {
      // Use the direct API endpoint
      const validateResponse = await fetch(`${config.API_BASE_URL}/api/coupons/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('token') ? {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          } : {})
        },
        body: JSON.stringify({
          code: couponCode,
          cartTotal: getTotalPrice()
        })
      });

      const data = await validateResponse.json();

      if (data.success) {
        const { coupon, discountAmount, finalPrice, message } = data.data;
        
        // Apply the coupon
        const applyResponse = await fetch(`${config.API_BASE_URL}/api/coupons/apply`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(localStorage.getItem('token') ? {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            } : {})
          },
          body: JSON.stringify({ code: coupon.code })
        });

        const applyData = await applyResponse.json();

        if (applyData.success) {
          setAppliedCoupon({
            code: coupon.code,
            discountAmount,
            finalPrice,
            discountPercentage: coupon.discountValue
          });
          setCouponCode('');
          toast.success(message);
        } else {
          setCouponError('Failed to apply coupon. Please try again.');
          toast.error('Failed to apply coupon.');
        }
      } else {
        setCouponError(data.message || 'Invalid coupon code');
        toast.error(data.message || 'Invalid coupon code');
      }
    } catch (error) {
      console.error('Coupon error:', error);
      const errorMessage = 'Failed to process coupon. Please try again.';
      setCouponError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = (e) => {
    e.preventDefault(); // Prevent any form submission
    e.stopPropagation(); // Stop event bubbling
    setAppliedCoupon(null);
    setCouponError('');
    toast.success('Coupon removed successfully');
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-500 via-white to-orange-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-24 h-24 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Truck size={48} className="text-orange-400" />
          </div>
          <h2 className="text-2xl font-bold text-orange-900 mb-4">Your cart is empty</h2>
          <p className="text-orange-700 mb-8">Please add items to your cart before proceeding to checkout.</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/shop')}
            className="bg-gradient-to-r from-orange-500 to-orange-400 text-white px-8 py-4 rounded-xl font-medium hover:from-orange-600 hover:to-orange-500 transition-all duration-200"
          >
            Continue Shopping
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const subtotal = getTotalPrice();
  const discount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const finalTotal = appliedCoupon ? appliedCoupon.finalPrice : subtotal;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-orange-100">
        <div className="container mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/cart')}
                className="flex items-center space-x-2 text-orange-700 hover:text-orange-900 transition-colors"
              >
                <ArrowLeft size={20} />
                <span>Back to Cart</span>
              </motion.button>
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-orange-900">Secure Checkout</h1>
              <p className="text-orange-600 text-sm">Complete your purchase safely</p>
            </div>
            <div className="flex items-center space-x-2 text-green-600">
              <Shield size={20} />
              <span className="text-sm font-medium">Secure Payment</span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Checkout Form */}
          <div className="w-full lg:w-2/3">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-xl border border-orange-100 overflow-hidden"
            >
              <div className="p-8">
                <div className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-orange-50 border border-orange-200 rounded-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <Sparkles size={20} className="text-orange-500" />
                    <p className="text-sm font-medium text-orange-800">
                      Premium Shopping Experience
                    </p>
                  </div>
                  <p className="text-sm text-orange-700">
                    <span className="text-red-500 font-semibold">*</span> indicates required fields. 
                    Your information is protected with bank-level security.
                  </p>
                </div>

                <form onSubmit={handleSubmit}>
                  {/* Shipping Information */}
                  <div className="mb-8">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-400 rounded-full flex items-center justify-center">
                        <MapPin size={20} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-orange-900">Shipping Information</h3>
                        <p className="text-orange-600 text-sm">Where should we deliver your order?</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-orange-900 mb-2">
                          First Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                            fieldErrors.firstName ? 'border-red-300 bg-red-50' : 'border-orange-200 bg-orange-50/30'
                          }`}
                          required
                        />
                        {fieldErrors.firstName && (
                          <p className="text-red-500 text-sm mt-1 flex items-center">
                            <AlertCircle size={14} className="mr-1" />
                            {fieldErrors.firstName}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-orange-900 mb-2">
                          Last Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                            fieldErrors.lastName ? 'border-red-300 bg-red-50' : 'border-orange-200 bg-orange-50/30'
                          }`}
                          required
                        />
                        {fieldErrors.lastName && (
                          <p className="text-red-500 text-sm mt-1 flex items-center">
                            <AlertCircle size={14} className="mr-1" />
                            {fieldErrors.lastName}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-orange-900 mb-2">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                            fieldErrors.email ? 'border-red-300 bg-red-50' : 'border-orange-200 bg-orange-50/30'
                          }`}
                          required
                        />
                        {fieldErrors.email && (
                          <p className="text-red-500 text-sm mt-1 flex items-center">
                            <AlertCircle size={14} className="mr-1" />
                            {fieldErrors.email}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-orange-900 mb-2">
                          Phone <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                            fieldErrors.phone ? 'border-red-300 bg-red-50' : 'border-orange-200 bg-orange-50/30'
                          }`}
                          required
                        />
                        {fieldErrors.phone && (
                          <p className="text-red-500 text-sm mt-1 flex items-center">
                            <AlertCircle size={14} className="mr-1" />
                            {fieldErrors.phone}
                          </p>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-orange-900 mb-2">
                          Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                            fieldErrors.address ? 'border-red-300 bg-red-50' : 'border-orange-200 bg-orange-50/30'
                          }`}
                          required
                        />
                        {fieldErrors.address && (
                          <p className="text-red-500 text-sm mt-1 flex items-center">
                            <AlertCircle size={14} className="mr-1" />
                            {fieldErrors.address}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-orange-900 mb-2">
                          City <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                            fieldErrors.city ? 'border-red-300 bg-red-50' : 'border-orange-200 bg-orange-50/30'
                          }`}
                          required
                        />
                        {fieldErrors.city && (
                          <p className="text-red-500 text-sm mt-1 flex items-center">
                            <AlertCircle size={14} className="mr-1" />
                            {fieldErrors.city}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-orange-900 mb-2">
                          State <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                            fieldErrors.state ? 'border-red-300 bg-red-50' : 'border-orange-200 bg-orange-50/30'
                          }`}
                          required
                        />
                        {fieldErrors.state && (
                          <p className="text-red-500 text-sm mt-1 flex items-center">
                            <AlertCircle size={14} className="mr-1" />
                            {fieldErrors.state}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-orange-900 mb-2">
                          ZIP Code <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                            fieldErrors.zipCode ? 'border-red-300 bg-red-50' : 'border-orange-200 bg-orange-50/30'
                          }`}
                          required
                        />
                        {fieldErrors.zipCode && (
                          <p className="text-red-500 text-sm mt-1 flex items-center">
                            <AlertCircle size={14} className="mr-1" />
                            {fieldErrors.zipCode}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="mb-8">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-400 rounded-full flex items-center justify-center">
                        <CreditCard size={20} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-orange-900">Payment Method</h3>
                        <p className="text-orange-600 text-sm">Choose your preferred payment option</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <motion.label
                        whileHover={{ scale: 1.02 }}
                        className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                          formData.paymentMethod === 'razorpay'
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-orange-200 hover:border-orange-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="razorpay"
                          checked={formData.paymentMethod === 'razorpay'}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <div className="flex items-center space-x-4">
                          <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-400 rounded-full flex items-center justify-center">
                            {formData.paymentMethod === 'razorpay' && (
                              <CheckCircle size={16} className="text-white" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold text-orange-900">Secure Online Payment</span>
                              <div className="flex items-center space-x-1">
                                <Shield size={14} className="text-green-500" />
                                <span className="text-xs text-green-600">Secure</span>
                              </div>
                            </div>
                            <p className="text-sm text-orange-600">
                              Pay with UPI, Cards, Net Banking, or Wallets
                            </p>
                          </div>
                        </div>
                      </motion.label>

                      <motion.label
                        whileHover={{ scale: 1.02 }}
                        className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                          formData.paymentMethod === 'cod'
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-orange-200 hover:border-orange-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cod"
                          checked={formData.paymentMethod === 'cod'}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <div className="flex items-center space-x-4">
                          <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-400 rounded-full flex items-center justify-center">
                            {formData.paymentMethod === 'cod' && (
                              <CheckCircle size={16} className="text-white" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold text-orange-900">Cash on Delivery</span>
                              <div className="flex items-center space-x-1">
                                <Clock size={14} className="text-orange-500" />
                                <span className="text-xs text-orange-600">Pay Later</span>
                              </div>
                            </div>
                            <p className="text-sm text-orange-600">
                              Pay when you receive your order
                            </p>
                          </div>
                        </div>
                      </motion.label>
                    </div>
                  </div>

                  {/* Coupon Code Section */}
                  <div className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-orange-50 border border-orange-200 rounded-xl">
                    <div className="flex items-center space-x-2 mb-4">
                      <Gift size={20} className="text-orange-500" />
                      <h3 className="text-lg font-semibold text-orange-900">Have a coupon?</h3>
                    </div>
                    {!appliedCoupon ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => {
                            setCouponCode(e.target.value);
                            setCouponError(''); // Clear error when user types
                          }}
                          placeholder="Enter coupon code"
                          className="flex-1 px-4 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                          disabled={couponLoading}
                        />
                        <button
                          onClick={handleCouponSubmit}
                          disabled={couponLoading || !couponCode.trim()}
                          className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-lg hover:from-orange-600 hover:to-orange-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {couponLoading ? 'Applying...' : 'Apply'}
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg border border-green-200">
                        <div className="flex items-center space-x-2">
                          <CheckCircle size={20} className="text-green-500" />
                          <div>
                            <p className="text-green-700 font-medium">{appliedCoupon.code}</p>
                            <p className="text-sm text-green-600">
                              {appliedCoupon.discountPercentage}% off (₹{appliedCoupon.discountAmount.toFixed(2)} saved)
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={removeCoupon}
                          type="button"
                          className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                    {couponError && (
                      <p className="mt-2 text-red-500 text-sm flex items-center">
                        <AlertCircle size={14} className="mr-1" />
                        {couponError}
                      </p>
                    )}
                  </div>
                </form>
              </div>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-1/3">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-xl border border-orange-100 p-6 sticky top-24"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-400 rounded-full flex items-center justify-center">
                  <Truck size={16} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-orange-900">Order Summary</h3>
              </div>

              <div className="space-y-4 mb-6">
                {cartItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-4 p-3 bg-orange-50/50 rounded-xl"
                  >
                    <div className="relative">
                      <img 
                        src={config.fixImageUrl(getItemImage(item))} 
                        alt={item.product?.name || item.name} 
                        className="w-16 h-16 rounded-lg object-cover border border-orange-200" 
                        onError={e => {
                          e.target.onerror = null;
                          if (item.product?.images && item.product.images.length > 0) {
                            const nextImage = item.product.images.find(img => img !== e.target.src);
                            if (nextImage) {
                              e.target.src = config.fixImageUrl(nextImage);
                              return;
                            }
                          }
                          e.target.src = 'https://placehold.co/150x150/e2e8f0/475569?text=Product';
                        }}
                      />
                      <span className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-orange-400 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-semibold">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-orange-900 line-clamp-2">
                        {item.product?.name || item.name}
                      </h4>
                      <p className="text-sm text-orange-600">
                        ₹{(item.product?.price || item.price).toFixed(2)}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-orange-900">
                      ₹{((item.product?.price || item.price) * item.quantity).toFixed(2)}
                    </p>
                  </motion.div>
                ))}
              </div>

              <div className="border-t border-orange-200 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-orange-700">Subtotal</span>
                  <span className="font-semibold text-orange-900">₹{subtotal.toFixed(2)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Discount ({appliedCoupon.discountPercentage}% off)</span>
                    <span className="text-green-600 font-semibold">-₹{appliedCoupon.discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-orange-700">Shipping</span>
                  <span className="text-green-600 font-semibold">FREE</span>
                </div>
                <div className="border-t border-orange-200 pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-orange-900">Total</span>
                    <span className="text-orange-900">₹{finalTotal.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-orange-600 mt-1">Including all taxes</p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={formData.paymentMethod === 'razorpay' ? handleRazorpayPayment : handleSubmit}
                disabled={loading || paymentProcessing}
                className="w-full mt-6 bg-gradient-to-r from-orange-500 to-orange-400 text-white px-6 py-4 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading || paymentProcessing ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Lock size={20} />
                    <span>
                      {formData.paymentMethod === 'razorpay' ? 'Proceed to Payment' : 'Place Order'}
                    </span>
                  </>
                )}
              </motion.button>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl"
                >
                  <p className="text-red-700 text-sm flex items-center">
                    <AlertCircle size={16} className="mr-2" />
                    {error}
                  </p>
                </motion.div>
              )}

              <div className="mt-4 p-3 bg-orange-50 rounded-xl">
                <div className="flex items-center space-x-2 text-sm text-orange-700">
                  <Shield size={16} />
                  <span>Your payment is secured with SSL encryption</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 