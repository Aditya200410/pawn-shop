import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { format } from 'date-fns';
import orderService from '../services/orderService';
import config from '../config/config.js';

const OrderConfirmation = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      orderService.getOrderById(id)
        .then(response => {
          if (response.success) {
            setOrder(response.order);
          } else {
            setError(response.message || 'Order not found.');
          }
        })
        .catch(err => {
          setError(err.message || 'Failed to load order details.');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setError("No order ID provided.");
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return <div className="text-center py-20">Loading order details...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-500">{error}</div>;
  }

  if (!order) {
    return <div className="text-center py-20">Order not found.</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center mb-8">
          <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800">Thank you for your order!</h1>
          <p className="text-gray-600 mt-2">Your order has been placed successfully.</p>
          <p className="text-sm text-gray-500 mt-1">Order ID: #{order._id}</p>
        </div>

        <div className="border-t border-b border-gray-200 py-4">
          <h2 className="text-lg font-semibold mb-3">Order Summary</h2>
          <div className="space-y-3">
            {order.items.map(item => (
              <div key={item.productId} className="flex items-center justify-between">
                <div className="flex items-center">
                  <img src={config.fixImageUrl(item.image)} alt={item.name} className="w-14 h-14 object-cover rounded-lg mr-4" />
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-medium">₹{item.price * item.quantity}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between font-bold text-xl">
            <span>Total</span>
            <span>₹{order.totalAmount}</span>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div>
            <h3 className="font-semibold mb-2">Shipping To</h3>
            <p className="text-gray-600">{order.customerName}</p>
            <p className="text-gray-600">{order.address.street}</p>
            <p className="text-gray-600">{order.address.city}, {order.address.state} {order.address.pincode}</p>
            <p className="text-gray-600">{order.address.country}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Order Details</h3>
            <p className="text-gray-600">Date: {format(new Date(order.createdAt), 'PP')}</p>
            <p className="text-gray-600">Payment: {order.paymentMethod.toUpperCase()}</p>
            <p className="text-gray-600">Status: {order.orderStatus}</p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link to="/shop" className="bg-orange-600 text-white py-3 px-6 rounded-lg hover:bg-orange-700 transition">
            Continue Shopping
          </Link>
          <Link to="/account?tab=orders" className="ml-4 text-orange-600 font-medium">
            View My Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation; 