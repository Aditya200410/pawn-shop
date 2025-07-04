import { useEffect, useState } from 'react';
import { XCircle, AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const PaymentFailure = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Get failure details from URL parameters
    const code = searchParams.get('code');
    const message = searchParams.get('message');
    const transactionId = searchParams.get('transactionId') || 
                         searchParams.get('merchantTransactionId') || 
                         searchParams.get('txnId');

    console.log('PaymentFailure - Failure details:', { code, message, transactionId });

    // Clear any stored payment data
    localStorage.removeItem('phonepe_transaction_id');
    localStorage.removeItem('phonepe_order_data');
    localStorage.removeItem('phonepe_redirect_time');

    // Show appropriate error message
    if (message) {
      toast.error(message);
    } else if (code === 'PAYMENT_CANCELLED') {
      toast.error('Payment was cancelled by you');
    } else {
      toast.error('Payment failed. Please try again.');
    }
  }, [searchParams]);

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
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure; 