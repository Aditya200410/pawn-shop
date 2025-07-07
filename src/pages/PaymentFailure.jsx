import { useEffect, useState } from 'react';
import { XCircle, AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import paymentService from '../services/paymentService';

const PaymentFailure = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState('');
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const phonePeOrderId = urlParams.get('orderId');
    if (!phonePeOrderId) {
      setError('No payment order ID found in URL.');
      return;
    }
    paymentService.checkPhonePeStatus(phonePeOrderId)
      .then((result) => {
        if (result.data?.state === 'FAILED') {
          setError('Payment failed. Please try again or contact support.');
        } else if (result.data?.state === 'PENDING') {
          setError('Payment is still pending. Please check again later.');
        } else if (result.data?.state === 'COMPLETED') {
          setError('Payment was successful.');
        } else {
          setError('Unknown payment status. Please contact support.');
        }
        setStatus(result.data);
      })
      .catch((err) => {
        setError('Failed to check payment status: ' + (err.message || 'Unknown error'));
      });
  }, []);

  const handleRetryPayment = () => {
    setLoading(true);
    // Navigate back to checkout
    navigate('/checkout');
  };

  const handleGoHome = () => navigate('/');
  const handleGoCart = () => navigate('/cart');
  const handleGoOrders = () => navigate('/account');

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-white to-pink-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="flex flex-col items-center justify-center py-12">
            <XCircle size={64} className="text-red-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Payment Failed</h2>
            <p className="text-gray-700 mb-6 text-center">
              Sorry, your payment could not be processed. This could be due to:
            </p>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 w-full">
              <ul className="text-red-800 text-sm space-y-2">
                <li>• Insufficient funds in your account</li>
                <li>• Network connectivity issues</li>
                <li>• Payment gateway timeout</li>
                <li>• Transaction was cancelled</li>
                <li>• Technical issues with the payment gateway</li>
              </ul>
            </div>

            <div className="flex gap-4 flex-wrap justify-center">
              <button 
                onClick={handleRetryPayment}
                disabled={loading}
                className="bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white px-6 py-2 rounded-lg font-semibold transition flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <ArrowLeft size={16} />
                    Try Again
                  </>
                )}
              </button>
              <button 
                onClick={handleGoCart}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition"
              >
                View Cart
              </button>
              <button 
                onClick={handleGoOrders}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold transition"
              >
                View Orders
              </button>
              <button 
                onClick={handleGoHome}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-semibold transition"
              >
                Go to Home
              </button>
            </div>

            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle size={20} className="text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-semibold mb-1">Need Help?</p>
                  <p>If you continue to face issues, please contact our support team with your transaction details.</p>
                </div>
              </div>
            </div>

            {status && (
              <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="text-sm text-gray-800">
                    <p className="font-semibold mb-1">Order ID:</p>
                    <p>{status.orderId}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 mt-2">
                  <div className="text-sm text-gray-800">
                    <p className="font-semibold mb-1">Merchant Order ID:</p>
                    <p>{status.merchantOrderId}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure; 