import { useEffect, useState } from 'react';
import { XCircle, AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import paymentService from '../services/paymentService';

const PaymentFailure = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null);
  const orderId = searchParams.get('orderId') || searchParams.get('transactionId');

  useEffect(() => {
    async function fetchStatus() {
      if (!orderId) {
        setError('Order ID not found.');
        setLoading(false);
        return;
      }
      try {
        const res = await paymentService.checkPhonePeStatus(orderId);
        const s = res.status || res.data?.state || res.data?.status || null;
        setStatus(s);
        if (s === 'COMPLETED' || s === 'completed') {
          navigate(`/payment/success?orderId=${orderId}`);
        }
      } catch {
        setError('Could not verify payment status.');
      } finally {
        setLoading(false);
      }
    }
    fetchStatus();
  }, [orderId, navigate]);

  const handleRetryPayment = async () => {
    setLoading(true);
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('orderId');
    const merchantOrderId = urlParams.get('merchantOrderId') || localStorage.getItem('phonepe_merchant_order_id');
    if (!orderId || !merchantOrderId) {
      setError('Order ID or Merchant Order ID not found.');
      setLoading(false);
      return;
    }
    try {
      const response = await fetch('/api/payment/phonepe/callback/retry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ merchantOrderId, orderId })
      });
      const result = await response.json();
      const state = result.data?.state?.toLowerCase();
      if (state === 'completed') {
        navigate(`/payment/success?transactionId=${orderId}`);
        return;
      } else if (state === 'pending') {
        setError('Payment is still pending. Please check again later.');
      } else if (state === 'failed') {
        setError('Payment failed. Please try again or contact support.');
      } else {
        setError('Unknown payment status. Please contact support.');
      }
      setStatus(result.data);
    } catch (err) {
      setError('Failed to check payment status: ' + (err.message || 'Unknown error'));
    }
    setLoading(false);
  };

  const handleGoHome = () => navigate('/');
  const handleGoCart = () => navigate('/cart');
  const handleGoOrders = () => navigate('/account');

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mb-4"></div>
      <div className="text-lg font-semibold">Checking payment status...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-white to-pink-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="flex flex-col items-center justify-center py-12">
            <XCircle size={64} className="text-red-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Payment Failed or Cancelled</h2>
            <p className="text-gray-700 mb-6 text-center">
              {error || 'Your payment could not be processed. If you have been charged, please contact support with your order ID.'}
            </p>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 w-full">
              <div className="text-gray-800 text-sm font-semibold">Order ID: {orderId}</div>
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