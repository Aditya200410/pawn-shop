import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import config from '../config/config.js';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(config.API_URLS.ORDERS, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // Filter orders to only show the current user's orders
      const userOrders = response.data.filter(order => order.email === user.email);
      setOrders(userOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      const errorMessage = error.response?.data?.message || 'Failed to fetch orders. Please try again later.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'processing':
        return 'bg-yellow-900/10 text-yellow-400 border border-yellow-400 shadow-[0_0_2px_#ca8a04]';
      case 'confirmed':
        return 'bg-blue-900/10 text-blue-400 border border-blue-400 shadow-[0_0_2px_#60a5fa]';
      case 'manufacturing':
        return 'bg-purple-900/10 text-purple-400 border border-purple-400 shadow-[0_0_2px_#c084fc]';
      case 'shipped':
        return 'bg-indigo-900/10 text-indigo-400 border border-indigo-400 shadow-[0_0_2px_#818cf8]';
      case 'delivered':
        return 'bg-green-900/10 text-green-400 border border-green-400 shadow-[0_0_2px_#4ade80]';
      default:
        return 'bg-gray-900/10 text-gray-400 border border-gray-400 shadow-[0_0_2px_#9ca3af]';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-900/10 text-green-400 border border-green-400 shadow-[0_0_2px_#4ade80]';
      case 'pending':
        return 'bg-yellow-900/10 text-yellow-400 border border-yellow-400 shadow-[0_0_2px_#ca8a04]';
      case 'failed':
        return 'bg-red-900/10 text-red-400 border border-red-400 shadow-[0_0_2px_#f87171]';
      default:
        return 'bg-gray-900/10 text-gray-400 border border-gray-400 shadow-[0_0_2px_#9ca3af]';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-pink"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-red-400">
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 relative inline-block group">
          <span className="relative z-10">Your Orders</span>
          <span className="absolute inset-0 bg-neon-pink/20 blur-lg group-hover:bg-neon-pink/30 transition-colors duration-300"></span>
        </h1>
        
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No orders found</p>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div key={order._id} className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-pink to-neon-blue opacity-30 blur group-hover:opacity-50 transition duration-300"></div>
                <div className="relative bg-gray-800 shadow-lg rounded-lg overflow-hidden border border-gray-700">
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-semibold text-white group-hover:text-neon-pink transition-colors duration-300">
                          Order #{order._id.slice(-6).toUpperCase()}
                        </h2>
                        <p className="text-sm text-gray-400 mt-1">
                          Placed on {format(new Date(order.createdAt), 'PPP')}
                        </p>
                      </div>
                      <div className="flex space-x-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                          {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                          {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h3 className="text-lg font-medium text-white">Items</h3>
                      <div className="mt-4 space-y-4">
                        {order.items.map((item, index) => (
                          <div key={index} className="border border-gray-700 rounded-lg p-4 bg-gray-800/50">
                            <div className="flex justify-between">
                              <div>
                                <p className="font-medium text-white">{item.text}</p>
                                <p className="text-sm text-gray-400">
                                  {item.type.charAt(0).toUpperCase() + item.type.slice(1)} • {item.size} • {item.usage}
                                </p>
                                {item.addOns.length > 0 && (
                                  <p className="text-sm text-gray-400">
                                    Add-ons: {item.addOns.join(', ')}
                                  </p>
                                )}
                              </div>
                              <p className="font-medium text-neon-pink">₹{item.price.toLocaleString()}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 border-t border-gray-700 pt-6">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-white">Shipping Details</h3>
                          <div className="mt-2 text-sm text-gray-400">
                            <p>{order.customerName}</p>
                            <p>{order.address.street}</p>
                            <p>{order.address.city}, {order.address.state} {order.address.pincode}</p>
                            <p>{order.address.country}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-400">Total Amount</p>
                          <p className="text-2xl font-bold text-neon-pink group-hover:text-neon-blue transition-colors duration-300">
                            ₹{order.totalAmount.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-400 mt-1">
                            {order.paymentMethod.toUpperCase()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 