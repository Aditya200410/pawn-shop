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
import { settingsAPI } from '../services/api';

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
  
  // Check if we're coming from successful payment
  const paymentSuccess = searchParams.get('paymentSuccess');
  const orderId = searchParams.get('orderId');
  
  // Always set seller token from URL if present (robustness)
  useEffect(() => {
    const urlSellerToken = searchParams.get('seller');
    if (urlSellerToken) {
      setSellerTokenFromURL(urlSellerToken);
    }
  }, [searchParams, setSellerTokenFromURL]);

  // Handle successful payment redirect
  useEffect(() => {
    if (paymentSuccess === 'true' && orderId && cartItems.length > 0) {
      // Automatically place order for successful payment
      handleSuccessfulPaymentOrder();
    }
  }, [paymentSuccess, orderId, cartItems]);

  // Fetch COD upfront amount
  useEffect(() => {
    const fetchCodUpfrontAmount = async () => {
      try {
        const response = await settingsAPI.getCodUpfrontAmount();
        
        // Check both response.data and direct response
        const amount = response.data?.amount || response.amount;
        if (amount) {
          setCodUpfrontAmount(Number(amount));
        }
      } catch (error) {
      
        // Keep default value of 39
      }
    };

    fetchCodUpfrontAmount();
  }, []);
  
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
  const [codUpfrontAmount, setCodUpfrontAmount] = useState(39); // Default value
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

  // Restore cartItems and formData from localStorage if missing (for payment success redirect)
  useEffect(() => {
    if ((cartItems.length === 0 || !cartItems) && localStorage.getItem('checkoutCartItems')) {
      try {
        const savedCart = JSON.parse(localStorage.getItem('checkoutCartItems'));
        if (Array.isArray(savedCart) && savedCart.length > 0 && typeof setCartItems === 'function') {
          setCartItems(savedCart);
        }
      } catch (e) { /* ignore */ }
    }
    if (!formData.phone && localStorage.getItem('checkoutFormData')) {
      try {
        const savedForm = JSON.parse(localStorage.getItem('checkoutFormData'));
        if (savedForm && typeof savedForm === 'object') {
          setFormData(prev => ({ ...prev, ...savedForm }));
        }
      } catch (e) { /* ignore */ }
    }
  }, []);

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

  // Calculate COD extra charge (dynamic amount for COD orders)
  const getCodExtraCharge = () => {
    return formData.paymentMethod === 'cod' ? codUpfrontAmount : 0;
  };

  // Calculate final total
  const getFinalTotal = () => {
    const subtotal = getTotalPrice();
    const shipping = calculateShippingCost();
    const codExtra = getCodExtraCharge();
    // Use discounted price if coupon is applied
    const discountedSubtotal = appliedCoupon ? appliedCoupon.finalPrice : subtotal;
    return discountedSubtotal + shipping + codExtra;
  };

  // Calculate amount to be paid online (for COD: only 39 rupees upfront, for online: full amount)
  const getOnlinePaymentAmount = () => {
    if (formData.paymentMethod === 'cod') {
      return getCodExtraCharge(); // Only 39 rupees for COD upfront
    } else {
      return getFinalTotal(); // Full amount for online payment (discounted if coupon applied)
    }
  };

  const handleCodOrder = async () => {
    setLoading(true);
    setError(null);
    
    if (!validateForm()) {
      setError("Please fill in all required fields correctly.");
      setLoading(false);
      return;
    }

    // For COD orders, we need to collect upfront payment first
    if (codUpfrontAmount > 0) {
    
      
      // Use PhonePe for upfront payment
      await handlePhonePePayment();
      return;
    }

    // For COD orders without upfront payment, create order directly
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
      totalAmount: appliedCoupon ? appliedCoupon.finalPrice : getTotalPrice(),
      shippingCost: calculateShippingCost(),
      codExtraCharge: getCodExtraCharge(),
      finalTotal: getFinalTotal(),
      paymentMethod: 'cod',
      paymentStatus: 'pending',
      upfrontAmount: 0,
      remainingAmount: getFinalTotal(),
      sellerToken: sellerToken,
      couponCode: appliedCoupon ? appliedCoupon.code : undefined
    };

    // Save form data to localStorage for potential use
    localStorage.setItem('checkoutFormData', JSON.stringify(formData));

    try {
      const response = await orderService.createOrder(orderData);

      if (response.success) {
        toast.success('Order placed successfully! Pay on delivery.');
        clearCart();
        clearSellerToken();
        // Clear persisted data after order placed
        localStorage.removeItem('checkoutFormData');
        localStorage.removeItem('checkoutCartItems');
        navigate('/account?tab=orders');
      } else {
        setError(response.message || "Failed to create order. Please try again.");
      }
    } catch (err) {
     
      setError("Failed to create order. Please try again.");
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

      // Determine payment amount based on payment method
      let paymentAmount;
      if (formData.paymentMethod === 'cod') {
        paymentAmount = codUpfrontAmount; // Use upfront amount for COD
      } else {
        paymentAmount = getOnlinePaymentAmount(); // Use full amount for online payment
      }
      
      if (paymentAmount < 1) {
        setError("Order amount must be at least ₹1 for online payment.");
        setPaymentProcessing(false);
        return;
      }

      // Prepare order data according to PhonePe API requirements
      const orderData = {
        amount: getOnlinePaymentAmount(), // Use discounted amount if coupon applied
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
        totalAmount: appliedCoupon ? appliedCoupon.finalPrice : getTotalPrice(),
        shippingCost: calculateShippingCost(),
        codExtraCharge: getCodExtraCharge(),
        finalTotal: getFinalTotal(),
        paymentMethod: formData.paymentMethod,
        paymentStatus: formData.paymentMethod === 'cod' ? 'pending_upfront' : 'processing',
        upfrontAmount: formData.paymentMethod === 'cod' ? codUpfrontAmount : 0,
        remainingAmount: formData.paymentMethod === 'cod' ? (getFinalTotal() - codUpfrontAmount) : 0,
        sellerToken: sellerToken,
        couponCode: appliedCoupon ? appliedCoupon.code : undefined
      };

      // Call backend to create PhonePe order
      const data = await paymentService.initiatePhonePePayment(orderData);
      
      if (data.success && data.redirectUrl) {
        
        // Save form data to localStorage for PaymentStatus page
        localStorage.setItem('checkoutFormData', JSON.stringify(formData));
        localStorage.setItem('checkoutCartItems', JSON.stringify(cartItems));
        
        // Get PhonePe checkout object
        try {
          const PhonePeCheckout = await getPhonePeCheckout();
          
          // Define callback function for payment completion according to PhonePe documentation
          const paymentCallback = (response) => {
            
            if (response === 'USER_CANCEL') {
              // User cancelled the payment
              toast.error('Payment was cancelled by the user.');
              setPaymentProcessing(false);
            } else if (response === 'CONCLUDED') {
              // Payment process has concluded (success or failure)

              // Redirect to status page for verification
              setTimeout(() => {
                window.location.href = `${window.location.origin}/payment/status?orderId=${data.orderId}`;
              }, 1000);
            }
          };

          // Show success message

          
          // Invoke PhonePe checkout with tokenUrl according to documentation
          // Based on: https://developer.phonepe.com/v1/reference/initiate-payment-using-js-standard-checkout
          // The tokenUrl is NOT a regular redirect URL - it's specifically for PhonePeCheckout.transact()
          PhonePeCheckout.transact({ 
            tokenUrl: data.redirectUrl,
            callback: paymentCallback
          });
          
        } catch (checkoutError) {
     
          
          // If PhonePe checkout fails, show error instead of redirecting manually
          setError('PhonePe checkout failed. Please try again.');
        }
        
      } else {
        setError(data.message || "Failed to initiate PhonePe payment.");
      }
      
    } catch (error) {
     
      setError(error.message || "Failed to process PhonePe payment.");
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
        }
      } else {
        setCouponError(data.message || 'Invalid coupon code');
      }
    } catch (error) {
     
      const errorMessage = 'Failed to process coupon. Please try again.';
      setCouponError(errorMessage);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setError("Please fill in all required fields correctly.");
      return;
    }

    // Handle different payment methods
    if (formData.paymentMethod === 'cod') {
      await handleCodOrder();
    } else if (formData.paymentMethod === 'phonepe') {
      await handlePhonePePayment();
    } else {
      setError("Please select a valid payment method.");
    }
  };

  const handleSuccessfulPaymentOrder = async () => {
    try {
      // Check if order has already been placed for this payment
      const orderKey = `order_placed_${orderId}`;
      const orderAlreadyPlaced = localStorage.getItem(orderKey);
      
      if (orderAlreadyPlaced === 'true') {
       
        toast.success('Order already placed successfully!');
        clearCart();
        clearSellerToken();
        // Clear persisted data after order placed
        localStorage.removeItem('checkoutFormData');
        localStorage.removeItem('checkoutCartItems');
        navigate('/');
        return;
      }

      setLoading(true);
      
      // Create order data for successful payment
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
        totalAmount: appliedCoupon ? appliedCoupon.finalPrice : getTotalPrice(),
        shippingCost: 0,
        codExtraCharge: 0,
        finalTotal: getFinalTotal(),
        paymentMethod: 'phonepe',
        paymentStatus: 'completed',
        upfrontAmount: 0,
        remainingAmount: 0,
        sellerToken: sellerToken,
        couponCode: appliedCoupon ? appliedCoupon.code : undefined,
        phonepeOrderId: orderId,
      };

      const response = await orderService.createOrder(orderData);

      if (response.success) {
        // Mark this order as placed to prevent duplicates
        localStorage.setItem(orderKey, 'true');
        toast.success('Order placed successfully!');
        clearCart();
        clearSellerToken();
        // Clear persisted data after order placed
        localStorage.removeItem('checkoutFormData');
        localStorage.removeItem('checkoutCartItems');
        navigate('/');
      } else {
        toast.error(response.message || 'Failed to place order');
      }
    } catch (err) {
     
      toast.error('Failed to place order: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
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
                        <select
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#8f3a61] focus:border-transparent transition-all duration-200 ${
                            fieldErrors.state ? 'border-red-300 bg-red-50' : 'border-[#8f3a61]/30 bg-[#8f3a61]/5'
                          }`}
                          required
                        >
                          <option value="">Select State</option>
                          <option value="Andhra Pradesh">Andhra Pradesh</option>
                          <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                          <option value="Assam">Assam</option>
                          <option value="Bihar">Bihar</option>
                          <option value="Chhattisgarh">Chhattisgarh</option>
                          <option value="Goa">Goa</option>
                          <option value="Gujarat">Gujarat</option>
                          <option value="Haryana">Haryana</option>
                          <option value="Himachal Pradesh">Himachal Pradesh</option>
                          <option value="Jharkhand">Jharkhand</option>
                          <option value="Karnataka">Karnataka</option>
                          <option value="Kerala">Kerala</option>
                          <option value="Madhya Pradesh">Madhya Pradesh</option>
                          <option value="Maharashtra">Maharashtra</option>
                          <option value="Manipur">Manipur</option>
                          <option value="Meghalaya">Meghalaya</option>
                          <option value="Mizoram">Mizoram</option>
                          <option value="Nagaland">Nagaland</option>
                          <option value="Odisha">Odisha</option>
                          <option value="Punjab">Punjab</option>
                          <option value="Rajasthan">Rajasthan</option>
                          <option value="Sikkim">Sikkim</option>
                          <option value="Tamil Nadu">Tamil Nadu</option>
                          <option value="Telangana">Telangana</option>
                          <option value="Tripura">Tripura</option>
                          <option value="Uttar Pradesh">Uttar Pradesh</option>
                          <option value="Uttarakhand">Uttarakhand</option>
                          <option value="West Bengal">West Bengal</option>
                          <option value="Delhi">Delhi</option>
                          <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                          <option value="Ladakh">Ladakh</option>
                          <option value="Chandigarh">Chandigarh</option>
                          <option value="Dadra and Nagar Haveli and Daman and Diu">Dadra and Nagar Haveli and Daman and Diu</option>
                          <option value="Lakshadweep">Lakshadweep</option>
                          <option value="Puducherry">Puducherry</option>
                          <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
                        </select>
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
                          <div className="animate-spin rounded-full h-6 w-6 border-pink-500"></div>
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
                                Pay ₹{codUpfrontAmount} online + remaining amount on delivery
                              </p>
                              <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-xs text-blue-700">
                                  <span className="font-medium">Upfront Payment:</span> ₹{codUpfrontAmount} (required)
                                </p>
                                <p className="text-xs text-blue-600 mt-1">
                                  <span className="font-medium">On Delivery:</span> ₹{(getFinalTotal() - codUpfrontAmount).toFixed(2)}
                                </p>
                              </div>
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

              {/* Coupon Code Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mb-6 p-4 bg-gradient-to-r from-[#8f3a61]/10 to-[#8f3a61]/5 border border-[#8f3a61]/20 rounded-xl"
              >
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
                    {appliedCoupon && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount ({appliedCoupon.code})</span>
                        <span>-₹{appliedCoupon.discountAmount.toFixed(2)}</span>
                      </div>
                    )}
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
                        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="text-sm text-blue-700 font-medium mb-2">Payment Breakdown:</div>
                          <div className="space-y-1 text-xs">
                            <div className="flex justify-between">
                              <span className="text-blue-600">Upfront Payment (Online):</span>
                              <span className="font-medium text-blue-700">₹{codUpfrontAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-blue-600">On Delivery:</span>
                              <span className="font-medium text-blue-700">₹{(getFinalTotal() - codUpfrontAmount).toFixed(2)}</span>
                            </div>
                            <div className="border-t border-blue-200 pt-1 mt-1">
                              <div className="flex justify-between font-medium">
                                <span className="text-blue-800">Total:</span>
                                <span className="text-blue-800">₹{getFinalTotal().toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
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
                      {formData.paymentMethod === 'cod' ? `Pay ₹${codUpfrontAmount} Online + Rest on Delivery` : 'Proceed to PhonePe Payment'}
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