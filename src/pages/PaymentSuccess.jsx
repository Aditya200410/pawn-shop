import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import paymentService from '../services/paymentService';
import { CheckCircle, AlertTriangle } from 'lucide-react';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId') || searchParams.get('transactionId');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchStatus() {
      if (!orderId) {
        setError('Order ID not found.');
        setLoading(false);
        return;
      }
      try {
        const res = await paymentService.checkPhonePeStatus(orderId);
        setStatus(res.status || res.data?.state || res.data?.status || null);
      } catch {
        setError('Could not verify payment status.');
      } finally {
        setLoading(false);
      }
    }
    fetchStatus();
  }, [orderId]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mb-4"></div>
      <div className="text-lg font-semibold">Verifying payment...</div>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center py-16">
      <AlertTriangle size={48} className="text-orange-500 mb-4" />
      <div className="text-xl font-bold mb-2">Unable to verify payment</div>
      <div className="text-gray-700 mb-4">{error}</div>
      <button onClick={() => navigate('/account')} className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg font-semibold transition">View Orders</button>
    </div>
  );

  if (status && (status === 'COMPLETED' || status === 'completed')) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <CheckCircle size={64} className="text-green-500 mb-4" />
        <div className="text-2xl font-bold mb-2">Payment Successful!</div>
        <div className="text-gray-700 mb-4">Your payment was received and your order is being processed.</div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="text-green-800 text-sm font-semibold">Order ID: {orderId}</div>
        </div>
        <button onClick={() => navigate('/account')} className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg font-semibold transition">View Orders</button>
        <button onClick={() => navigate('/')} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-semibold transition mt-2">Go to Home</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <AlertTriangle size={48} className="text-yellow-500 mb-4" />
      <div className="text-xl font-bold mb-2">Payment Not Completed</div>
      <div className="text-gray-700 mb-4">We could not verify your payment. Please contact support if you have been charged.</div>
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div className="text-yellow-800 text-sm font-semibold">Order ID: {orderId}</div>
      </div>
      <button onClick={() => navigate('/account')} className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg font-semibold transition">View Orders</button>
      <button onClick={() => navigate('/')} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-semibold transition mt-2">Go to Home</button>
    </div>
  );
} 