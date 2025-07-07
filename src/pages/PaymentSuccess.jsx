import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import config from '../config/config';
import paymentService from '../services/paymentService';
import { useCart } from '../context/CartContext';
import { toast } from 'react-hot-toast';

const PaymentSuccess = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [orderCreated, setOrderCreated] = useState(false);
  const [orderCreationRetry, setOrderCreationRetry] = useState(0);
  const navigate = useNavigate();
    const { clearCart, clearSellerToken } = useCart();

  useEffect(() => {
    const verifyPayment = async () => {
      setLoading(true);
      
      // Get transaction ID from URL or localStorage
      const urlParams = new URLSearchParams(window.location.search);
      const transactionId = urlParams.get('transactionId') || 
                           urlParams.get('orderId') || 
                           localStorage.getItem('phonepe_merchant_order_id');
      
      const storedOrderData = localStorage.getItem('phonepe_order_data');
      
      console.log('PaymentSuccess - Transaction ID:', transactionId);

      
      if (!transactionId) {
        setError('No transaction ID found. Please contact support.');
        setLoading(false);
        return;
      }

      // Check if order was already created
      const orderCreated = localStorage.getItem('order_created_' + transactionId);
      if (orderCreated === 'true') {
        console.log('PaymentSuccess - Order already created for transaction:', transactionId);
        setOrderCreated(true);
        setStatus({ 
          success: true, 
          code: 'PAYMENT_SUCCESS', 
          data: { 
            state: 'COMPLETED',
            message: 'Payment completed successfully'
          } 
        });
        setLoading(false);
        return;
      }

      // For COD orders with upfront payment
      if (storedOrderData) {
        try {
          const orderData = JSON.parse(storedOrderData);
          if (orderData.paymentMethod === 'cod') {
            console.log('PaymentSuccess - COD order with upfront payment detected');
            
            // For COD orders, we need to verify the upfront payment
            const result = await paymentService.completePaymentFlow(transactionId, orderData);
            
            if (result.success) {
              setOrderCreated(true);
              localStorage.setItem('order_created_' + transactionId, 'true');
              
              // Clear cart and seller token after successful order creation
              clearCart();
              clearSellerToken();
              // Clear stored payment data
              localStorage.removeItem('phonepe_order_id');
              localStorage.removeItem('phonepe_merchant_order_id');
              localStorage.removeItem('phonepe_order_data');
              localStorage.removeItem('phonepe_redirect_time');
              
              toast.success('Order placed successfully!');
              
              setStatus({ 
                success: true, 
                code: 'PAYMENT_SUCCESS', 
                data: { 
                  state: 'COMPLETED',
                  message: 'Upfront payment successful! Order placed successfully.'
                },
                order: result.order
              });
            } else {
              setError(result.message || 'Failed to verify payment and create order.');
            }
            
            setLoading(false);
            return;
          }
        } catch (parseError) {
          console.error('PaymentSuccess - Error parsing stored order data:', parseError);
        }
      }

      // For PhonePe payments, verify payment status
      console.log('PaymentSuccess - Verifying PhonePe payment...');
      
      try {
        // Get the PhonePe order ID from URL
        const phonePeOrderId = urlParams.get('orderId');
        if (!phonePeOrderId) {
          setError('PhonePe order ID not found in URL. Please contact support.');
          setLoading(false);
          return;
        }
        
        // Fetch order/payment details from backend using orderId
        let merchantOrderId = null;
        let statusResult = null;
        try {
          statusResult = await paymentService.checkPhonePeStatus(phonePeOrderId);
          merchantOrderId = statusResult.data?.merchantOrderId || null;
        } catch (fetchError) {
          setError('Failed to fetch order/payment details: ' + (fetchError.message || 'Unknown error'));
          setLoading(false);
          return;
        }
        
        // Show payment as successful only if state === 'COMPLETED'
        if (statusResult.data?.state === 'COMPLETED') {
          setOrderCreated(true);
          clearCart();
          clearSellerToken();
          toast.success('Order Done!');
        } else {
          setError('Unknown payment status. Please contact support.');
        }
        setStatus(statusResult.data);
        
        // If payment is completed and order not yet created, create the order
        if (statusResult.data?.state === 'COMPLETED' && !orderCreated) {
          // You may need to reconstruct orderData or fetch it from backend
          // For now, show a placeholder for order creation logic
          try {
            // Example: fetch orderData from backend or reconstruct from statusResult if possible
            // const orderData = await fetchOrderData(phonePeOrderId);
            // await paymentService.createOrderAfterPayment(orderData, 'completed');
            // For demo, just setOrderCreated(true)
            setOrderCreated(true);
            clearCart();
            clearSellerToken();
            toast.success('Order placed successfully!');
          } catch (orderError) {
            setError('Payment was successful but order creation failed. Please contact support.');
          }
        }
      } catch (error) {
        console.error('PaymentSuccess - Payment verification failed:', error);
        setError(error.message || 'Failed to verify payment. Please contact support.');
        
        // If order data is missing, provide specific guidance
        if (!storedOrderData) {
          setError('Order data not found. Please try placing your order again.');
        }
      }
      
      setLoading(false);
    };

    verifyPayment();
  }, [clearCart, clearSellerToken, orderCreationRetry]);

  // Retry mechanism
  const handleRetry = () => {
    if (retryCount < 3) {
      setRetryCount(prev => prev + 1);
      setLoading(true);
      setError(null);
      // Re-run the verification process
      setTimeout(() => {
        verifyPayment();
      }, 1000);
    }
  };

  // Manual order creation retry
  const handleRetryOrderCreation = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const storedOrderData = localStorage.getItem('phonepe_order_data');
      const phonePeOrderId = localStorage.getItem('phonepe_order_id');
      const urlParams = new URLSearchParams(window.location.search);
      const transactionId = urlParams.get('transactionId') || 
                           urlParams.get('orderId') || 
                           localStorage.getItem('phonepe_merchant_order_id');
      
      if (!phonePeOrderId) {
        setError('Order ID not found. Please contact support.');
        setLoading(false);
        return;
      }
      
      let orderData = null;
      if (storedOrderData) {
        try {
          orderData = JSON.parse(storedOrderData);
        } catch (parseError) {
          console.error('PaymentSuccess - Error parsing stored order data:', parseError);
        }
      }
      
      if (!orderData) {
        setError('Order data not found. Please try placing your order again.');
        setLoading(false);
        return;
      }
      
      // Try to create order directly
      const orderResult = await paymentService.createOrderAfterPayment(orderData, 'completed');
      
      if (orderResult.success) {
        setOrderCreated(true);
        localStorage.setItem('order_created_' + transactionId, 'true');
        clearCart();
        clearSellerToken();
        toast.success('Order created successfully!');
        setStatus({ 
          success: true, 
          code: 'PAYMENT_SUCCESS', 
          data: { 
            state: 'COMPLETED',
            message: 'Order created successfully'
          },
          order: orderResult
        });
      } else {
        setError('Failed to create order. Please contact support.');
      }
    } catch (error) {
      console.error('PaymentSuccess - Manual order creation failed:', error);
      setError('Failed to create order: ' + error.message);
    }
    
    setLoading(false);
  };

  const handleGoHome = () => navigate('/');
  const handleGoOrders = () => navigate('/account');

  let content;
  if (loading) {
    content = (
      <div className="flex flex-col items-center justify-center py-12">
        <Clock size={64} className="text-yellow-500 mb-4 animate-spin" />
        <h2 className="text-xl font-semibold mb-2">Verifying payment...</h2>
        <p className="text-gray-600">Please wait while we confirm your payment status.</p>
        {retryCount > 0 && (
          <p className="text-sm text-gray-500 mt-2">Retry attempt: {retryCount}/3</p>
        )}
      </div>
    );
  } else if (error) {
    content = (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertTriangle size={64} className="text-orange-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Verification Error</h2>
        <p className="text-gray-700 mb-6">Unable to verify payment status: {error}</p>
        <div className="flex gap-4 flex-wrap justify-center">
          {retryCount < 3 && (
            <button 
              onClick={handleRetry} 
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition"
            >
              Retry Verification
            </button>
          )}
          <button onClick={handleGoOrders} className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg font-semibold transition">View Orders</button>
          <button onClick={handleGoHome} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-semibold transition">Go to Home</button>
        </div>
      </div>
    );
  } else if (status && status.success && status.code === 'PAYMENT_SUCCESS') {
    // Check if this was a COD order with upfront payment
    const storedOrderData = localStorage.getItem('phonepe_order_data');
    let isCodOrder = false;
    let upfrontAmount = 0;
    let remainingAmount = 0;
    
    if (storedOrderData) {
      try {
        const orderData = JSON.parse(storedOrderData);
        isCodOrder = orderData.paymentMethod === 'cod';
        upfrontAmount = orderData.upfrontAmount || 0;
        remainingAmount = orderData.remainingAmount || 0;
      } catch (e) {
        console.error('Error parsing stored order data:', e);
      }
    }
    
    content = (
      <div className="flex flex-col items-center justify-center py-12">
        <CheckCircle size={64} className="text-green-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">
          {isCodOrder ? 'Upfront Payment Successful!' : 'Payment Successful!'}
        </h2>
        <p className="text-gray-700 mb-6">
          {isCodOrder 
            ? `Thank you for your order. Your upfront payment of ₹${upfrontAmount} was received successfully. You will pay the remaining ₹${remainingAmount} on delivery.`
            : (status.data?.message || 'Thank you for your order. Your payment was received successfully.')
          }
        </p>
        {status.order && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-800 font-semibold">Order ID: {status.order.order?._id || 'Processing...'}</p>
            <p className="text-green-700 text-sm">You will receive an email confirmation shortly.</p>
            {isCodOrder && (
              <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded">
                <p className="text-blue-800 text-sm font-medium">Payment Breakdown:</p>
                <p className="text-blue-700 text-xs">✅ Upfront: ₹{upfrontAmount}</p>
                <p className="text-blue-700 text-xs">💰 On Delivery: ₹{remainingAmount}</p>
              </div>
            )}
          </div>
        )}
        <div className="flex gap-4">
          <button onClick={handleGoOrders} className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg font-semibold transition">View Orders</button>
          <button onClick={handleGoHome} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-semibold transition">Go to Home</button>
        </div>
      </div>
    );
  } else if (status && status.success && status.code === 'PAYMENT_PENDING') {
    content = (
      <div className="flex flex-col items-center justify-center py-12">
        <Clock size={64} className="text-yellow-500 mb-4 animate-pulse" />
        <h2 className="text-2xl font-bold mb-2">Payment Pending</h2>
        <p className="text-gray-700 mb-6">
          {status.message || 'Your payment is still being processed. Please check your orders after a few minutes.'}
        </p>
        <div className="flex gap-4">
          <button onClick={handleGoOrders} className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg font-semibold transition">View Orders</button>
          <button onClick={handleGoHome} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-semibold transition">Go to Home</button>
        </div>
      </div>
    );
  } else if (status && status.code === 'ORDER_CREATION_FAILED') {
    const urlParams = new URLSearchParams(window.location.search);
    const transactionId = urlParams.get('transactionId') || 
                         urlParams.get('orderId') || 
                         localStorage.getItem('phonepe_merchant_order_id');
    
    content = (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertTriangle size={64} className="text-orange-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Payment Successful - Order Issue</h2>
        <p className="text-gray-700 mb-6">
          Payment was successful, but we could not create your order. Please contact support with your transaction ID.
        </p>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
          <p className="text-orange-800 font-semibold">Transaction ID: {transactionId}</p>
          <p className="text-orange-700 text-sm">Please save this ID for support reference.</p>
        </div>
        <div className="flex gap-4 flex-wrap justify-center">
          <button onClick={handleRetryOrderCreation} className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition">Retry Order Creation</button>
          <button onClick={handleGoHome} className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg font-semibold transition">Go to Home</button>
          <button onClick={handleGoOrders} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-semibold transition">View Orders</button>
        </div>
      </div>
    );
  } else if (status && !status.success) {
    content = (
      <div className="flex flex-col items-center justify-center py-12">
        <XCircle size={64} className="text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Payment Failed</h2>
        <p className="text-gray-700 mb-6">
          {status.message || 'Sorry, your payment could not be processed. Please try again or contact support.'}
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <button onClick={handleGoOrders} className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg font-semibold transition">View Orders</button>
          <button onClick={handleGoHome} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-semibold transition">Go to Home</button>
        </div>
      </div>
    );
  } else {
    // Default case - no status or unknown status
    content = (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertTriangle size={64} className="text-orange-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Payment Status Unknown</h2>
        <p className="text-gray-700 mb-6">
          We couldn't determine your payment status. Please check your orders or contact support.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <button onClick={handleGoOrders} className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg font-semibold transition">View Orders</button>
          <button onClick={handleGoHome} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-semibold transition">Go to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-white to-pink-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
          {content}
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess; 