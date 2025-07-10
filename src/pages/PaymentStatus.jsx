import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  Home,
  RefreshCw,
  CreditCard,
  Truck,
  Shield,
  ArrowLeft
} from 'lucide-react';
import paymentService from '../services/paymentService';
import orderService from '../services/orderService';
import config from '../config/config';
import { toast } from 'react-hot-toast';
import Loader from '../components/Loader';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const PaymentStatus = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState(null); // 'success', 'failed', 'pending', 'unknown', 'error'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const placingOrderRef = useRef(false);

  // Get cart and user context
  const { cartItems: contextCartItems, getTotalPrice, clearCart, getItemImage, sellerToken } = useCart();
  const { user } = useAuth();

  // Try to get form data and cart from localStorage (set in Checkout before payment)
  let savedFormData = {};
  let savedCoupon = null;
  let savedCartItems = [];
  try {
    savedFormData = JSON.parse(localStorage.getItem('checkoutFormData') || '{}') || {};
  } catch (e) { savedFormData = {}; }
  try {
    savedCoupon = JSON.parse(localStorage.getItem('appliedCoupon') || 'null') || JSON.parse(localStorage.getItem('checkoutAppliedCoupon') || 'null');
  } catch (e) { savedCoupon = null; }
  try {
    savedCartItems = JSON.parse(localStorage.getItem('checkoutCartItems') || '[]') || [];
  } catch (e) { savedCartItems = []; }

  const savedCodUpfrontAmount = Number(localStorage.getItem('codUpfrontAmount') || 39);

  const orderId = searchParams.get('orderId');
  const transactionId = searchParams.get('transactionId');

  // Use cart from localStorage if contextCartItems is empty
  const cartItems = (contextCartItems && contextCartItems.length > 0) ? contextCartItems : savedCartItems;

  // Helper to calculate total with coupon
  const getFinalTotal = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.product?.price || item.price) * item.quantity, 0);
    const discount = savedCoupon && typeof savedCoupon.discountAmount === 'number' ? savedCoupon.discountAmount : 0;
    const total = subtotal - discount;
    return total > 0 ? total : 0;
  };

  useEffect(() => {
    if (!orderId && !transactionId) {
      setError('No order ID or transaction ID provided');
      setLoading(false);
      return;
    }
    checkPaymentStatus();
    // eslint-disable-next-line
  }, [orderId, transactionId, retryCount]);

  // Place order after payment is successful (for testing, also on failed/pending)
  useEffect(() => {
    if (status === 'success' && !orderPlaced && !placingOrderRef.current) {

      placingOrderRef.current = true;
      placeOrderAfterPayment();
    }
    // eslint-disable-next-line
  }, [status]);

  // Add redirect after payment success
  useEffect(() => {
    if (status === 'success') {
      const timer = setTimeout(() => {
        navigate('/');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [status, navigate]);

  const checkPaymentStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const idToCheck = orderId || transactionId;
      const response = await paymentService.getPhonePeStatus(idToCheck);
      setStatus(response.status);
      setOrderDetails(response.data?.data || response.data);
      // No redirect here; wait for order placement
    } catch (err) {
      setError(err.message || 'Failed to check payment status');
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  // Place order after payment is successful
  const placeOrderAfterPayment = async () => {
    try {
      // Check if order has already been placed for this payment
      const orderKey = `order_placed_${orderId || transactionId}`;
      const orderAlreadyPlaced = localStorage.getItem(orderKey);
      
      if (orderAlreadyPlaced === 'true') {
        
        setOrderPlaced(true);
        return;
      }

      // Check if we have the required data
      if (!orderId && !transactionId) {
        toast.error('Missing payment/order ID. Cannot place order.');
        // Clear persisted data
        localStorage.removeItem('checkoutFormData');
        localStorage.removeItem('checkoutCartItems');
        localStorage.removeItem('appliedCoupon');
        localStorage.removeItem('checkoutAppliedCoupon');
        setError('Missing payment/order ID. Please try again.');
        return;
      }
      if (!Array.isArray(cartItems) || cartItems.length === 0) {
        toast.error('No items in cart to place order');
        // Clear persisted data
        localStorage.removeItem('checkoutFormData');
        localStorage.removeItem('checkoutCartItems');
        localStorage.removeItem('appliedCoupon');
        localStorage.removeItem('checkoutAppliedCoupon');
        // Redirect to checkout page to place order there
        navigate('/checkout?paymentSuccess=true&orderId=' + (orderId || transactionId));
        return;
      }

      // Check if we have form data and all required fields
      const formData = savedFormData;
      const requiredFields = [
        'firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode', 'country'
      ];
      const missingFields = requiredFields.filter(f => !formData[f] || String(formData[f]).trim() === '');
      if (missingFields.length > 0) {
        toast.error('Missing required info: ' + missingFields.join(', '));
        // Clear persisted data
        localStorage.removeItem('checkoutFormData');
        localStorage.removeItem('checkoutCartItems');
        localStorage.removeItem('appliedCoupon');
        localStorage.removeItem('checkoutAppliedCoupon');
        // Redirect to checkout to fix
        navigate('/checkout?paymentSuccess=true&orderId=' + (orderId || transactionId));
        return;
      }

      // Use the same order creation logic as Checkout page
      const appliedCoupon = savedCoupon;
      
      // Create order data similar to Checkout page
      const orderData = {
        customerName: `${formData.firstName || user?.name || ''} ${formData.lastName || ''}`.trim(),
        email: formData.email || user?.email,
        phone: formData.phone || user?.phone,
        address: formData.address || user?.address,
        city: formData.city || user?.city || '',
        state: formData.state || user?.state || '',
        pincode: formData.zipCode || user?.zipCode || '',
        country: formData.country || user?.country || 'India',
        items: cartItems.map(item => ({
          productId: item.product?._id || item.id,
          name: item.product?.name || item.name,
          quantity: item.quantity,
          price: item.product?.price || item.price,
          image: getItemImage(item)
        })),
        totalAmount: getFinalTotal(),
        shippingCost: 0, // No shipping cost for online payment
        codExtraCharge: 0, // No COD charge for online payment
        finalTotal: getFinalTotal(),
        paymentMethod: 'phonepe',
        paymentStatus: 'completed',
        upfrontAmount: 0,
        remainingAmount: 0,
        sellerToken: sellerToken,
        couponCode: appliedCoupon ? appliedCoupon.code : undefined,
        phonepeOrderId: orderDetails?.orderId || orderId,
      };

      // Create the order using the same service as Checkout
      const response = await orderService.createOrder(orderData);

      if (response.success) {
        // Mark this order as placed to prevent duplicates
        localStorage.setItem(orderKey, 'true');
        setOrderPlaced(true);
        clearCart();
        // Clear persisted checkout data after order placed
        localStorage.removeItem('checkoutFormData');
        localStorage.removeItem('checkoutCartItems');
        localStorage.removeItem('appliedCoupon');
        localStorage.removeItem('checkoutAppliedCoupon');
        toast.success('Order placed successfully!');
      } else {
        toast.error(response.message || 'Failed to place order');
        // Clear persisted data on error
        localStorage.removeItem('checkoutFormData');
        localStorage.removeItem('checkoutCartItems');
        localStorage.removeItem('appliedCoupon');
        localStorage.removeItem('checkoutAppliedCoupon');
      }
    } catch (err) {
    
      toast.error('Failed to place order after payment: ' + (err.message || 'Unknown error'));
      // Clear persisted data on error
      localStorage.removeItem('checkoutFormData');
      localStorage.removeItem('checkoutCartItems');
      localStorage.removeItem('appliedCoupon');
      localStorage.removeItem('checkoutAppliedCoupon');
      // If order placement fails, redirect to checkout to try again
      navigate('/checkout?paymentSuccess=true&orderId=' + (orderId || transactionId));
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoToOrders = () => {
    navigate('/account?tab=orders');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-500 via-white to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <Loader />
          <p className="mt-4 text-pink-700">Checking payment status...</p>
        </div>
      </div>
    );
  }

  if (error && !status) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-500 via-white to-pink-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={32} className="text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="space-y-3">
              <button
                onClick={handleRetry}
                className="w-full bg-pink-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-pink-700 transition-colors"
              >
                <RefreshCw size={20} className="inline mr-2" />
                Try Again
              </button>
              <button
                onClick={handleGoHome}
                className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-300 transition-colors"
              >
                <Home size={20} className="inline mr-2" />
                Go Home
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  const renderSuccessStatus = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full mx-4"
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle size={40} className="text-green-500" />
        </motion.div>
        <h1 className="text-3xl font-bold text-green-600 mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-4">Your order has been confirmed and payment received.</p>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <p className="text-green-700 text-sm">
            <Shield size={16} className="inline mr-2" />
            Your payment is secure and your order is being processed
          </p>
        </div>
      </div>

      {orderDetails && (
        <div className="space-y-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-700 mb-2">Order Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-medium">{orderDetails.merchantOrderId || orderDetails.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium">₹{(orderDetails.amount / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="text-green-600 font-medium">Completed</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-700 mb-2">What's Next?</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <Truck size={16} className="text-pink-500 mr-2" />
                  <span>Order will be shipped within 5-7 days</span>
                </div>
               
                <div className="flex items-center">
                  <Shield size={16} className="text-pink-500 mr-2" />
                  <span>Secure payment processed successfully</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="text-center">
        <p className="text-gray-500 text-sm mb-4">
          Redirecting to home page in 5 seconds...
        </p>
        <div className="space-y-3">
          <button
            onClick={handleGoHome}
            className="w-full bg-pink-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-pink-700 transition-colors"
          >
            <Home size={20} className="inline mr-2" />
            Go Home Now
          </button>
          <button
            onClick={handleGoToOrders}
            className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-300 transition-colors"
          >
            View My Orders
          </button>
        </div>
      </div>
    </motion.div>
  );

  const renderFailedStatus = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full mx-4"
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <XCircle size={40} className="text-red-500" />
        </motion.div>
        <h1 className="text-3xl font-bold text-red-600 mb-2">Payment Failed</h1>
        <p className="text-gray-600 mb-4">Your payment could not be processed. Please try again.</p>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <p className="text-red-700 text-sm">
            <AlertCircle size={16} className="inline mr-2" />
            No amount has been deducted from your account
          </p>
        </div>
      </div>

      {orderDetails && (
        <div className="space-y-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-700 mb-2">Order Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-medium">{orderDetails.merchantOrderId || orderDetails.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium">₹{(orderDetails.amount / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="text-red-600 font-medium">Failed</span>
                </div>
                {orderDetails.errorCode && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Error Code:</span>
                    <span className="font-medium text-red-600">{orderDetails.errorCode}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-700 mb-2">What You Can Do</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <RefreshCw size={16} className="text-pink-500 mr-2" />
                  <span>Try the payment again</span>
                </div>
                <div className="flex items-center">
                  <CreditCard size={16} className="text-pink-500 mr-2" />
                  <span>Use a different payment method</span>
                </div>
                <div className="flex items-center">
                  <Shield size={16} className="text-pink-500 mr-2" />
                  <span>Contact support if issue persists</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="text-center space-y-3">
        <button
          onClick={() => navigate('/checkout')}
          className="w-full bg-pink-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-pink-700 transition-colors"
        >
          <RefreshCw size={20} className="inline mr-2" />
          Try Payment Again
        </button>
        <button
          onClick={handleGoHome}
          className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-300 transition-colors"
        >
          <Home size={20} className="inline mr-2" />
          Go Home
        </button>
      </div>
    </motion.div>
  );

  const renderPendingStatus = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full mx-4"
    >
      <div className="text-center mb-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <Clock size={40} className="text-yellow-500" />
        </motion.div>
        <h1 className="text-3xl font-bold text-yellow-600 mb-2">Payment Pending</h1>
        <p className="text-gray-600 mb-4">Your payment is being processed. Please wait...</p>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
          <p className="text-yellow-700 text-sm">
            <Clock size={16} className="inline mr-2" />
            This may take a few minutes to complete
          </p>
        </div>
      </div>

      {orderDetails && (
        <div className="space-y-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-700 mb-2">Order Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-medium">{orderDetails.merchantOrderId || orderDetails.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium">₹{(orderDetails.amount / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="text-yellow-600 font-medium">Pending</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-700 mb-2">What's Happening</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <RefreshCw size={16} className="text-pink-500 mr-2" />
                  <span>Payment is being verified</span>
                </div>
                <div className="flex items-center">
                  <Shield size={16} className="text-pink-500 mr-2" />
                  <span>Your money is safe</span>
                </div>
                <div className="flex items-center">
                  <Clock size={16} className="text-pink-500 mr-2" />
                  <span>Please wait for confirmation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="text-center space-y-3">
        <button
          onClick={handleRetry}
          disabled={retryCount >= 3}
          className="w-full bg-pink-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw size={20} className="inline mr-2" />
          Check Status Again ({3 - retryCount} attempts left)
        </button>
        <button
          onClick={handleGoHome}
          className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-300 transition-colors"
        >
          <Home size={20} className="inline mr-2" />
          Go Home
        </button>
      </div>
    </motion.div>
  );

  const renderUnknownStatus = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full mx-4"
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <AlertCircle size={40} className="text-gray-500" />
        </motion.div>
        <h1 className="text-3xl font-bold text-gray-700 mb-2">Unknown Payment Status</h1>
        <p className="text-gray-600 mb-4">We couldn't determine the payment status. Please try again or contact support.</p>
      </div>
      <div className="text-center space-y-3">
        <button
          onClick={handleRetry}
          className="w-full bg-pink-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-pink-700 transition-colors"
        >
          <RefreshCw size={20} className="inline mr-2" />
          Try Again
        </button>
        <button
          onClick={handleGoHome}
          className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-300 transition-colors"
        >
          <Home size={20} className="inline mr-2" />
          Go Home
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-white to-pink-100 flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {status === 'success' && renderSuccessStatus()}
        {status === 'failed' && renderFailedStatus()}
        {status === 'pending' && renderPendingStatus()}
        {status === 'unknown' && renderUnknownStatus()}
      </AnimatePresence>
    </div>
  );
};

export default PaymentStatus; 
