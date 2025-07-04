import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import config from '../config/config';

const PaymentSuccess = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Get transactionId from URL parameters
        const params = new URLSearchParams(window.location.search);
        const transactionId = params.get('transactionId') || params.get('merchantTransactionId');
        
        console.log('PaymentSuccess - Transaction ID from URL:', transactionId);
        
        if (!transactionId) {
          console.log('PaymentSuccess - No transaction ID found in URL');
          setError('No transaction ID found');
          setLoading(false);
          return;
        }

        // Also check for POST data (PhonePe might send data via POST)
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        
        console.log('PaymentSuccess - URL params:', { code, state, transactionId });

        // If we have a success code, mark as successful
        if (code === 'SUCCESS' || state === 'COMPLETED') {
          console.log('PaymentSuccess - Payment appears successful based on URL params');
          setStatus({ success: true, code: 'PAYMENT_SUCCESS', data: { state: 'COMPLETED' } });
          setLoading(false);
          return;
        }

        // Otherwise, verify with backend
        console.log('PaymentSuccess - Verifying payment with backend...');
        const response = await fetch(`${config.API_BASE_URL}/api/payment/phonepe/status/${transactionId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('PaymentSuccess - Backend verification response:', data);
        
        setStatus(data);
      } catch (err) {
        console.error('PaymentSuccess - Error verifying payment:', err);
        setError(err.message);
        setStatus({ success: false, message: err.message });
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, []);

  const handleGoHome = () => navigate('/');
  const handleGoOrders = () => navigate('/account');

  let content;
  if (loading) {
    content = (
      <div className="flex flex-col items-center justify-center py-12">
        <Clock size={64} className="text-yellow-500 mb-4 animate-spin" />
        <h2 className="text-xl font-semibold mb-2">Verifying payment...</h2>
        <p className="text-gray-600">Please wait while we confirm your payment status.</p>
      </div>
    );
  } else if (error) {
    content = (
      <div className="flex flex-col items-center justify-center py-12">
        <XCircle size={64} className="text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Verification Error</h2>
        <p className="text-gray-700 mb-6">Unable to verify payment status: {error}</p>
        <div className="flex gap-4">
          <button onClick={handleGoOrders} className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg font-semibold transition">View Orders</button>
          <button onClick={handleGoHome} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-semibold transition">Go to Home</button>
        </div>
      </div>
    );
  } else if (status.success && (status.code === 'PAYMENT_SUCCESS' || status.data?.state === 'COMPLETED')) {
    content = (
      <div className="flex flex-col items-center justify-center py-12">
        <CheckCircle size={64} className="text-green-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
        <p className="text-gray-700 mb-6">Thank you for your order. Your payment was received successfully.</p>
        <div className="flex gap-4">
          <button onClick={handleGoOrders} className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg font-semibold transition">View Orders</button>
          <button onClick={handleGoHome} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-semibold transition">Go to Home</button>
        </div>
      </div>
    );
  } else if (status.success && (status.code === 'PAYMENT_PENDING' || status.data?.state === 'PENDING')) {
    content = (
      <div className="flex flex-col items-center justify-center py-12">
        <Clock size={64} className="text-yellow-500 mb-4 animate-pulse" />
        <h2 className="text-2xl font-bold mb-2">Payment Pending</h2>
        <p className="text-gray-700 mb-6">Your payment is still being processed. Please check your orders after a few minutes.</p>
        <div className="flex gap-4">
          <button onClick={handleGoOrders} className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg font-semibold transition">View Orders</button>
          <button onClick={handleGoHome} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-semibold transition">Go to Home</button>
        </div>
      </div>
    );
  } else {
    content = (
      <div className="flex flex-col items-center justify-center py-12">
        <XCircle size={64} className="text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Payment Failed</h2>
        <p className="text-gray-700 mb-6">Sorry, your payment could not be processed. Please try again or contact support.</p>
        <div className="flex gap-4">
          <button onClick={handleGoOrders} className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg font-semibold transition">View Orders</button>
          <button onClick={handleGoHome} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-semibold transition">Go to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full mx-auto">
        {content}
      </div>
    </div>
  );
};

export default PaymentSuccess; 