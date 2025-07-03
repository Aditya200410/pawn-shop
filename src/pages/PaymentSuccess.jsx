import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {
  const [status, setStatus] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get transactionId from URL or POST data
    const params = new URLSearchParams(window.location.search);
    const transactionId = params.get('transactionId') || params.get('merchantTransactionId');
    if (!transactionId) return;

    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/payment/phonepe/status/${transactionId}`)
      .then(res => res.json())
      .then(data => setStatus(data))
      .catch(() => setStatus({ success: false }));
  }, []);

  const handleGoHome = () => navigate('/');
  const handleGoOrders = () => navigate('/account');

  let content;
  if (!status) {
    content = (
      <div className="flex flex-col items-center justify-center py-12">
        <Clock size={64} className="text-yellow-500 mb-4 animate-spin" />
        <h2 className="text-xl font-semibold mb-2">Verifying payment...</h2>
        <p className="text-gray-600">Please wait while we confirm your payment status.</p>
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