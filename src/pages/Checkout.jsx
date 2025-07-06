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
  Clock,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import orderService from '../services/orderService';
import paymentService from '../services/paymentService';
import { toast } from 'react-hot-toast';
import config from '../config/config.js';
import apiService from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import Loader from '../components/Loader';
import AuthPrompt from '../components/AuthPrompt';
import FlashMessage from '../components/FlashMessage';
import cartService from '../services/cartService';
import { useSellerNavigation } from '../hooks/useSellerNavigation';

// Get PhonePe checkout object
const getPhonePeCheckout = () => {
  return new Promise((resolve, reject) => {
    if (window.PhonePeCheckout) {
      resolve(window.PhonePeCheckout);
      return;
    }
    
    // Wait for script to load if not already available
    const checkInterval = setInterval(() => {
      if (window.PhonePeCheckout) {
        clearInterval(checkInterval);
        resolve(window.PhonePeCheckout);
      }
    }, 100);
    
    // Timeout after 5 seconds
    setTimeout(() => {
      clearInterval(checkInterval);
      reject(new Error('PhonePe checkout script not loaded'));
    }, 5000);
  });
};

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice, clearCart, getItemImage, sellerToken, setSellerTokenFromURL, clearSellerToken, setCartItems } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const { navigateToCart } = useSellerNavigation();
  
  // Always set seller token from URL if present (robustness)
  useEffect(() => {
    const urlSellerToken = searchParams.get('seller');
    if (urlSellerToken) {
      setSellerTokenFromURL(urlSellerToken);
    }
  }, [searchParams, setSellerTokenFromURL]);
  
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
    
    // Payment Information - will be set after cart loads
    paymentMethod: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [cartLoading, setCartLoading] = useState(true);
  const [cartLoaded, setCartLoaded] = useState(false);

  // Pre-fill form with user data if logged in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName || user.name?.split(' ')[0] || '',
        lastName: user.lastName || user.name?.split(' ').slice(1).join(' ') || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
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
    if (cartItems.length === 0 && cartLoaded) {
      navigate('/cart');
    }
  }, [cartItems, navigate, cartLoaded]);

  // Force cart refresh from backend on checkout page load
  useEffect(() => {
    const refreshCart = async () => {
      if (isAuthenticated && user && user.email) {
        try {
          const cartData = await cartService.getCart(user.email);
          if (cartData.items) {
            if (typeof setCartItems === 'function') {
              setCartItems(cartData.items);
            }
          }
        } catch (err) {
          console.error('Failed to refresh cart on checkout:', err);
        }
      }
      setCartLoading(false);
      setCartLoaded(true);
    };
    refreshCart();
    // eslint-disable-next-line
  }, []);

  // Determine if COD is available for all cart items
  const isCodAvailableForCart = cartItems.every(item => {
    return item.codAvailable !== false; // treat undefined as true for backward compatibility
  });

  // Set payment method after cart loads and COD availability is determined
  useEffect(() => {
    if (cartLoaded && cartItems.length > 0) {
      if (isCodAvailableForCart) {
        setFormData(prev => ({
          ...prev,
          paymentMethod: 'cod'
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          paymentMethod: 'phonepe'
        }));
      }
    }
  }, [cartLoaded, cartItems, isCodAvailableForCart]);

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

  // Calculate shipping cost based on payment method and order total
  const calculateShippingCost = () => {
    // Free delivery for all orders
    return 0;
  };

  // Calculate COD extra charge (39 rupees extra for COD orders)
  const getCodExtraCharge = () => {
    return formData.paymentMethod === 'cod' ? 39 : 0;
  };

  // Calculate final total
  const getFinalTotal = () => {
    const subtotal = getTotalPrice();
    const shipping = calculateShippingCost();
    const codExtra = getCodExtraCharge();
    return subtotal + shipping + codExtra;
  };

  // Calculate amount to be paid online (for COD: full amount including extra charge, for online: full amount)
  const getOnlinePaymentAmount = () => {
    return getFinalTotal();
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

    // Prevent COD order if not available
    if (!isCodAvailableForCart && formData.paymentMethod === 'cod') {
      setError("Cash on Delivery is not available for one or more items in your cart. Please use online payment.");
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
      shippingCost: calculateShippingCost(),
      codExtraCharge: getCodExtraCharge(),
      finalTotal: getFinalTotal(),
      paymentMethod: formData.paymentMethod,
      paymentStatus: formData.paymentMethod === 'cod' ? 'partial' : 'processing',
      sellerToken: sellerToken, // Include seller token if present
      couponCode: appliedCoupon ? appliedCoupon.code : undefined // Pass coupon code to backend
    };
    

    
    try {
      const response = await orderService.createOrder(orderData);

      if (response.success) {
        toast.success('Order placed successfully!');
        if (sellerToken) {
       
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

  const handlePhonePePayment = async () => {
    setPaymentProcessing(true);
    setError(null);
    try {
      if (!validateForm()) {
        setError("Please fill in all required fields correctly.");
        setPaymentProcessing(false);
        return;
      }

      // Validate minimum order amount for online payment
      const finalAmount = getOnlinePaymentAmount();
      if (finalAmount < 1) {
        setError("Order amount must be at least ₹1 for online payment.");
        setPaymentProcessing(false);
        return;
      }

      // Prepare order data according to PhonePe API requirements
      const orderData = {
        amount: finalAmount,
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
        shippingCost: calculateShippingCost(),
        codExtraCharge: getCodExtraCharge(),
        finalTotal: getFinalTotal(),
        paymentMethod: 'phonepe',
        sellerToken: sellerToken,
        couponCode: appliedCoupon ? appliedCoupon.code : undefined
      };

      console.log('Initiating PhonePe payment with order data:', orderData);

      // Call backend to create PhonePe order
      const data = await paymentService.initiatePhonePePayment(orderData);
      
      if (data.success && data.redirectUrl) {
        
        // Store transaction data for later verification
        if (data.orderId) {
          localStorage.setItem('phonepe_order_id', data.orderId);
          localStorage.setItem('phonepe_merchant_order_id', data.merchantOrderId);
          localStorage.setItem('phonepe_order_data', JSON.stringify(orderData));
          localStorage.setItem('phonepe_redirect_time', new Date().toISOString());
        }
        
        // Get PhonePe checkout object
        try {
          const PhonePeCheckout = await getPhonePeCheckout();
          
          // Define callback function for payment completion
          // Based on: https://developer.phonepe.com/v1/reference/initiate-payment-using-js-standard-checkout
          const paymentCallback = (response) => {
            console.log('PhonePe payment callback:', response);
            
            if (response === 'USER_CANCEL') {
              toast.error('Payment was cancelled by the user.');
              // Add any custom logic for cancelled payment
            } else if (response === 'CONCLUDED') {
              toast.success('Payment process has concluded.');
              // Add any custom logic for completed payment
              // You can verify payment status here
              setTimeout(() => {
                window.location.reload();
              }, 2000);
            }
          };

          // Show success message
          toast.success('Initiating PhonePe payment...');
          
          // Invoke PhonePe checkout in redirect mode
          // Based on: https://developer.phonepe.com/v1/reference/initiate-payment-using-js-standard-checkout
          PhonePeCheckout.transact({ 
            tokenUrl: data.redirectUrl 
          });
          
        } catch (scriptError) {
          console.error('Failed to load PhonePe script:', scriptError);
          // Fallback to direct redirect
          toast.success('Opening PhonePe payment gateway...');
          setTimeout(() => {
            window.open(data.redirectUrl, '_blank', 'noopener,noreferrer');
          }, 1000);
        }
        
      } else {
        const errorMsg = data.message || data.error?.message || "Failed to initiate PhonePe payment.";
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error('PhonePe payment error:', error);
      let errorMsg = error.message || "PhonePe payment failed.";
      
      if (error.response?.data?.error?.message) {
        errorMsg = error.response.data.error.message;
      } else if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error.code === 'ECONNABORTED') {
        errorMsg = 'Payment gateway timeout. Please try again.';
      } else if (error.code === 'ENOTFOUND') {
        errorMsg = 'Payment gateway not reachable. Please try again.';
      } else if (error.response?.status === 500) {
        errorMsg = 'Payment gateway error. Please try again later.';
      } else if (error.response?.status === 400) {
        errorMsg = 'Invalid payment request. Please check your details.';
      } else if (error.response?.status === 401) {
        errorMsg = 'Payment gateway authentication failed. Please try again.';
      }
      
      setError(errorMsg);
      toast.error(errorMsg);
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
          ...(localStorage.getItem('seller_jwt') ? {
            'Authorization': `Bearer ${localStorage.getItem('seller_jwt')}`
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
            ...(localStorage.getItem('seller_jwt') ? {
              'Authorization': `Bearer ${localStorage.getItem('seller_jwt')}`
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

  // Show authentication prompt if user is not signed in
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-500 via-white to-pink-100">
        <div className="container mx-auto px-4 py-8">
          <AuthPrompt 
            title="Sign In to Checkout"
            message="Please sign in to complete your purchase. This ensures your order is properly tracked and you can access your order history."
            action="checkout"
          />
        </div>
      </div>
    );
  }

  if (cartLoading || !cartLoaded || !formData.paymentMethod) {
    return <Loader />;
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-500 via-white to-pink-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-24 h-24 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Truck size={48} className="text-pink-400" />
          </div>
          <h2 className="text-2xl font-bold text-pink-900 mb-4">Your cart is empty</h2>
          <p className="text-pink-700 mb-8">Please add items to your cart before proceeding to checkout.</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/shop')}
            className="bg-gradient-to-r from-[#8f3a61] to-[#8f3a61] text-white px-8 py-4 rounded-xl font-medium hover:from-[#8f3a61] hover:to-[#8f3a61] transition-all duration-200"
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
      <div className="bg-white shadow-sm border-b border-pink-100">
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
                onClick={navigateToCart}
                className="flex items-center space-x-2 text-[#8f3a61] hover:text-[#8f3a61]/80 transition-colors"
              >
                <ArrowLeft size={20} />
                <span>Back to Cart</span>
              </motion.button>
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-[#8f3a61]">Secure Checkout</h1>
              <p className="text-[#8f3a61]/70 text-sm">Complete your purchase safely</p>
            </div>
            <div className="flex items-center space-x-2 text-green-600">
              <Shield size={20} />
              <span className="text-sm font-medium">Secure Payment</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Free Delivery Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto my-10 px-4 mb-6"
      >
        <div className="bg-gradient-to-r from-[#8f3a61] to-[#8f3a61] rounded-xl p-4 text-white shadow-lg">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Truck size={20} className="text-white" />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-lg">🚚 FREE DELIVERY ON ALL ORDERS</h3>
              <p className="text-white/80 text-sm">No minimum order value required</p>
            </div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-2xl"
            >
              🎉
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Checkout Form */}
          <div className="w-full lg:w-2/3">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-xl border border-[#8f3a61]/20 overflow-hidden"
            >
              <div className="p-8">
              

                <div className="mb-6 p-4 bg-gradient-to-r from-[#8f3a61]/10 to-[#8f3a61]/5 border border-[#8f3a61]/20 rounded-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <Sparkles size={20} className="text-[#8f3a61]" />
                    <p className="text-sm font-medium text-[#8f3a61]">
                      Premium Shopping Experience
                    </p>
                  </div>
                  <p className="text-sm text-[#8f3a61]/70">
                    <span className="text-red-500 font-semibold">*</span> indicates required fields. 
                    Your information is protected with bank-level security.
                  </p>
                </div>

                <form onSubmit={handleSubmit}>
                  {/* Shipping Information */}
                  <div className="mb-8">
                    <div className="flex items-center space-x-3 mb-6">
                                          <div className="w-10 h-10 bg-gradient-to-r from-[#8f3a61] to-[#8f3a61] rounded-full flex items-center justify-center">
                      <MapPin size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#8f3a61]">Shipping Information</h3>
                      <p className="text-[#8f3a61]/70 text-sm">Where should we deliver your order?</p>
                    </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-[#8f3a61] mb-2">
                          First Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#8f3a61] focus:border-transparent transition-all duration-200 ${
                            fieldErrors.firstName ? 'border-red-300 bg-red-50' : 'border-[#8f3a61]/30 bg-[#8f3a61]/5'
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
                        <label className="block text-sm font-semibold text-[#8f3a61] mb-2">
                          Last Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#8f3a61] focus:border-transparent transition-all duration-200 ${
                            fieldErrors.lastName ? 'border-red-300 bg-red-50' : 'border-[#8f3a61]/30 bg-[#8f3a61]/5'
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
                        <label className="block text-sm font-semibold text-[#8f3a61] mb-2">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#8f3a61] focus:border-transparent transition-all duration-200 ${
                            fieldErrors.email ? 'border-red-300 bg-red-50' : 'border-[#8f3a61]/30 bg-[#8f3a61]/5'
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
                        <label className="block text-sm font-semibold text-[#8f3a61] mb-2">
                          Phone <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#8f3a61] focus:border-transparent transition-all duration-200 ${
                            fieldErrors.phone ? 'border-red-300 bg-red-50' : 'border-[#8f3a61]/30 bg-[#8f3a61]/5'
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
                        <label className="block text-sm font-semibold text-pink-900 mb-2">
                          Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 ${
                            fieldErrors.address ? 'border-red-300 bg-red-50' : 'border-pink-200 bg-pink-50/30'
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
                        <label className="block text-sm font-semibold text-[#8f3a61] mb-2">
                          City <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#8f3a61] focus:border-transparent transition-all duration-200 ${
                            fieldErrors.city ? 'border-red-300 bg-red-50' : 'border-[#8f3a61]/30 bg-[#8f3a61]/5'
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
                        <label className="block text-sm font-semibold text-[#8f3a61] mb-2">
                          State <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#8f3a61] focus:border-transparent transition-all duration-200 ${
                            fieldErrors.state ? 'border-red-300 bg-red-50' : 'border-[#8f3a61]/30 bg-[#8f3a61]/5'
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
                        <label className="block text-sm font-semibold text-[#8f3a61] mb-2">
                          ZIP Code <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#8f3a61] focus:border-transparent transition-all duration-200 ${
                            fieldErrors.zipCode ? 'border-red-300 bg-red-50' : 'border-[#8f3a61]/30 bg-[#8f3a61]/5'
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
                  <div className="bg-white rounded-xl p-6 mb-8">
                    <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
                    <div className="flex flex-col gap-4">
                      {!cartLoaded || !formData.paymentMethod ? (
                        <div className="flex items-center justify-center py-4">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500"></div>
                          <span className="ml-2 text-gray-600">Loading payment options...</span>
                        </div>
                      ) : isCodAvailableForCart ? (
                        <>
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="cod"
                              checked={formData.paymentMethod === 'cod'}
                              onChange={handleInputChange}
                              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <div className="flex-1">
                              <span className="text-gray-800 font-medium">Cash on Delivery (COD)</span>
                              <p className="text-sm text-gray-600 mt-1">
                                Pay full amount online + ₹39 extra charge + remaining amount on delivery
                              </p>
                            </div>
                          </label>
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="phonepe"
                              checked={formData.paymentMethod === 'phonepe'}
                              onChange={handleInputChange}
                              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <div className="flex-1">
                              <span className="text-gray-800 font-medium">UPI (PhonePe)</span>
                              <p className="text-sm text-gray-600 mt-1">
                                Pay securely using UPI via PhonePe
                              </p>
                            </div>
                          </label>
                        </>
                      ) : (
                        <>
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="phonepe"
                              checked={formData.paymentMethod === 'phonepe'}
                              onChange={handleInputChange}
                              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <div className="flex-1">
                              <span className="text-gray-800 font-medium">UPI (PhonePe)</span>
                              <p className="text-sm text-gray-600 mt-1">
                                Pay securely using UPI via PhonePe
                              </p>
                            </div>
                          </label>
                          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-sm text-yellow-700">
                              <span className="font-medium">Note:</span> Cash on Delivery is not available for one or more items in your cart.
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Coupon Code Section */}
                  <div className="mb-6 p-4 bg-gradient-to-r from-[#8f3a61]/10 to-[#8f3a61]/5 border border-[#8f3a61]/20 rounded-xl">
                    <div className="flex items-center space-x-2 mb-4">
                      <Gift size={20} className="text-[#8f3a61]" />
                      <h3 className="text-lg font-semibold text-[#8f3a61]">Have a coupon?</h3>
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
                          className="flex-1 px-4 py-2 border border-[#8f3a61]/30 rounded-lg focus:ring-2 focus:ring-[#8f3a61] focus:border-transparent bg-white"
                          disabled={couponLoading}
                        />
                        <button
                          onClick={handleCouponSubmit}
                          disabled={couponLoading || !couponCode.trim()}
                          className="px-4 py-2 bg-gradient-to-r from-[#8f3a61] to-[#8f3a61] text-white rounded-lg hover:from-[#8f3a61] hover:to-[#8f3a61] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
                          className="text-[#8f3a61] hover:text-[#8f3a61]/80 text-sm font-medium"
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
              className="bg-white rounded-2xl shadow-xl border border-[#8f3a61]/20 p-6 sticky top-24"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-[#8f3a61] to-[#8f3a61] rounded-full flex items-center justify-center">
                  <Truck size={16} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#8f3a61]">Order Summary</h3>
              </div>

              <div className="space-y-4 mb-6">
                {!cartLoaded ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8f3a61]"></div>
                    <span className="ml-3 text-gray-600">Loading cart items...</span>
                  </div>
                ) : (
                  cartItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-4 p-3 bg-[#8f3a61]/5 rounded-xl"
                    >
                      <div className="relative">
                        <img 
                          src={config.fixImageUrl(getItemImage(item))} 
                          alt={item.product?.name || item.name} 
                          className="w-16 h-16 rounded-lg object-cover border border-[#8f3a61]/20" 
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
                        <span className="absolute -top-2 -right-2 bg-gradient-to-r from-[#8f3a61] to-[#8f3a61] text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-semibold">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-pink-900 line-clamp-2">
                          {item.product?.name || item.name}
                        </h4>
                        <p className="text-sm text-pink-600">
                          ₹{(item.product?.price || item.price).toFixed(2)}
                        </p>
                      </div>
                      <p className="text-sm font-bold text-pink-900">
                        ₹{((item.product?.price || item.price) * item.quantity).toFixed(2)}
                      </p>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Free Delivery Highlight */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-6 p-4 bg-gradient-to-r from-[#8f3a61] to-[#8f3a61] rounded-xl text-white shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <Truck size={16} className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">🚚 FREE DELIVERY</h4>
                      <p className="text-white/80 text-sm">On all orders nationwide</p>
                    </div>
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-2xl font-bold"
                  >
                    🎉
                  </motion.div>
                </div>
              </motion.div>

              <div className="bg-white rounded-xl p-6 mb-8">
                <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                {!cartLoaded || !formData.paymentMethod ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500"></div>
                    <span className="ml-2 text-gray-600">Calculating totals...</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Subtotal ({cartItems.length} items)</span>
                      <span>₹{getTotalPrice().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Shipping</span>
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex items-center space-x-2"
                      >
                        <span className="text-green-600 font-bold">FREE</span>
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="text-green-500"
                        >
                          ✨
                        </motion.div>
                      </motion.div>
                    </div>
                    {formData.paymentMethod === 'cod' && (
                      <div className="flex justify-between">
                        <span>COD Extra Charge</span>
                        <span>₹{getCodExtraCharge().toFixed(2)}</span>
                      </div>
                    )}
                    <div className="border-t pt-3">
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total Amount</span>
                        <span>₹{getFinalTotal().toFixed(2)}</span>
                      </div>
                      {formData.paymentMethod === 'cod' && (
                        <div className="text-sm text-gray-600 mt-1">
                          Pay ₹{getCodExtraCharge().toFixed(2)} online + ₹{getTotalPrice().toFixed(2)} on delivery
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={
                  formData.paymentMethod === 'phonepe'
                    ? handlePhonePePayment
                    : handleSubmit
                }
                disabled={loading || paymentProcessing || !cartLoaded || !formData.paymentMethod}
                className="w-full mt-6 bg-gradient-to-r from-[#8f3a61] to-[#8f3a61] text-white px-6 py-4 rounded-xl font-semibold hover:from-pink-600 hover:to-pink-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading || paymentProcessing ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : !cartLoaded || !formData.paymentMethod ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Lock size={20} />
                    <span>
                      {formData.paymentMethod === 'phonepe' ? 'Proceed to PhonePe Payment' : 'Place Order'}
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

              <div className="mt-4 p-3 bg-pink-50 rounded-xl">
                <div className="flex items-center space-x-2 text-sm text-pink-700">
                  <Shield size={16} />
                  <span>Your payment is secured with SSL encryption</span>
                </div>
              </div>

              {/* Timeframes Section */}
              <div className="mt-4 p-3 bg-pink-50 rounded-xl">
                <div className="space-y-2 text-sm text-pink-700">
                  <div className="flex items-start gap-2">
                    <Clock size={16} className="mt-0.5" />
                    <div>
                      <span className="font-medium">Delivery:</span> Products will be delivered within 5-7 days
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <RefreshCw size={16} className="mt-0.5" />
                    <div>
                      <span className="font-medium">Refunds:</span> Will be credited into original payment method within 5-7 business days
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Truck size={16} className="mt-0.5" />
                    <div>
                      <span className="font-medium">Replacements:</span> Will be delivered within 5-7 days
                    </div>
                  </div>
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