import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import config from '../config/config';
import paymentService from '../services/paymentService';

const PaymentSuccess = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Get transactionId from URL parameters (enhanced for 2025)
        const params = new URLSearchParams(window.location.search);
        const transactionId = params.get('transactionId') || 
                             params.get('merchantTransactionId') || 
                             params.get('txnId');
        
        console.log('PaymentSuccess - Transaction ID from URL:', transactionId);
        
        // Also check localStorage for transaction ID
        const storedTransactionId = localStorage.getItem('phonepe_transaction_id');
        const finalTransactionId = transactionId || storedTransactionId;
        
        if (!finalTransactionId) {
          console.log('PaymentSuccess - No transaction ID found in URL or localStorage');
          setError('No transaction ID found');
          setLoading(false);
          return;
        }

        // Enhanced URL parameter checking for 2025
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        const responseCode = urlParams.get('responseCode');
        const message = urlParams.get('message');
        
        console.log('PaymentSuccess - Enhanced URL params for 2025:', { 
          code, 
          state, 
          responseCode, 
          message, 
          transactionId: finalTransactionId 
        });

        // Enhanced success detection for 2025
        const isSuccessFromURL = code === 'SUCCESS' || 
                                state === 'COMPLETED' || 
                                responseCode === 'SUCCESS' ||
                                (code && !code.includes('FAIL'));

        if (isSuccessFromURL) {
          console.log('PaymentSuccess - Payment appears successful based on URL params');
          setStatus({ 
            success: true, 
            code: 'PAYMENT_SUCCESS', 
            data: { 
              state: 'COMPLETED',
              message: message || 'Payment completed successfully'
            } 
          });
          setLoading(false);
          return;
        }

        // Enhanced backend verification for 2025
        console.log('PaymentSuccess - Verifying payment with backend (2025 API)...');
        
        try {
          const data = await paymentService.checkPhonePeStatus(finalTransactionId);
          console.log('PaymentSuccess - Enhanced backend verification response:', data);
          setStatus(data);
        } catch (backendError) {
          console.error('PaymentSuccess - Backend verification failed:', backendError);
          
          // If backend verification fails, try to determine status from URL params
          if (code === 'FAILED' || state === 'FAILED' || responseCode === 'FAILED') {
            setStatus({ 
              success: false, 
              code: 'PAYMENT_FAILED', 
              message: message || 'Payment failed'
            });
          } else if (code === 'PENDING' || state === 'PENDING') {
            setStatus({ 
              success: true, 
              code: 'PAYMENT_PENDING', 
              message: 'Payment is being processed'
            });
          } else {
            // If we can't determine status, show error
            setError(backendError.message);
            setStatus({ success: false, message: backendError.message });
          }
        }
      } catch (err) {
        console.error('PaymentSuccess - Error verifying payment:', err);
        setError(err.message);
        setStatus({ success: false, message: err.message });
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [retryCount]);

  // Enhanced retry mechanism for 2025
  const handleRetry = () => {
    if (retryCount < 3) {
      setRetryCount(prev => prev + 1);
      setLoading(true);
      setError(null);
    }
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
  } else if (status.success && (status.code === 'PAYMENT_SUCCESS' || status.data?.state === 'COMPLETED')) {
    content = (
      <div className="flex flex-col items-center justify-center py-12">
        <CheckCircle size={64} className="text-green-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
        <p className="text-gray-700 mb-6">
          {status.data?.message || 'Thank you for your order. Your payment was received successfully.'}
        </p>
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
        <p className="text-gray-700 mb-6">
          {status.message || 'Your payment is still being processed. Please check your orders after a few minutes.'}
        </p>
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
        <p className="text-gray-700 mb-6">
          {status.message || 'Sorry, your payment could not be processed. Please try again or contact support.'}
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
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