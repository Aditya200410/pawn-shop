import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, ShoppingBag, Truck, User } from 'lucide-react';
import config from '../config/config';

const OrderConfirmation = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // NOTE: Replace with your actual API endpoint for fetching a single order
        const response = await axios.get(`${config.API_URLS.ORDERS}/${id}`);
        setOrder(response.data);
      } catch (err) {
        setError('Failed to fetch order details. Please try again later.');
        console.error('Order fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-500">
        <p>{error}</p>
        <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">Go to Homepage</Link>
      </div>
    );
  }
  
  if (!order) {
    return (
        <div className="text-center py-20">
            <p>No order found.</p>
             <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">Go to Homepage</Link>
        </div>
    );
  }

  const subtotal = order.products.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="bg-gray-50 min-h-screen py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-10 border border-gray-100">
          
          <div className="text-center mb-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Thank you for your order!</h1>
            <p className="text-gray-600 mt-2">Your order has been placed successfully.</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-center">
            <p className="text-gray-600">Order ID: <span className="font-semibold text-gray-800">{order.orderId}</span></p>
            <p className="text-gray-600 text-sm">Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
          
          {/* Order Summary */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
                <ShoppingBag className="w-6 h-6 mr-3 text-gray-500" />
                Order Summary
              </h2>
              <div className="space-y-4">
                {order.products.map((item) => (
                  <div key={item.productId} className="flex items-center justify-between pb-4 border-b last:border-b-0">
                    <div className="flex items-center">
                      <img src={config.fixImageUrl(item.image)} alt={item.name} className="w-16 h-16 rounded-lg object-cover mr-4" />
                      <div>
                        <p className="font-semibold text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-semibold text-gray-800">₹{item.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="border-t pt-4 space-y-2">
               <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
               <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>₹{order.shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-xl text-gray-800">
                <span>Total</span>
                <span>₹{order.totalAmount.toFixed(2)}</span>
              </div>
            </div>

             {/* Shipping Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
                <Truck className="w-6 h-6 mr-3 text-gray-500" />
                Shipping Information
              </h2>
              <div className="bg-gray-50 rounded-lg p-4 text-gray-700">
                <p className="font-semibold">{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.address}, {order.shippingAddress.city}</p>
                <p>{order.shippingAddress.state}, {order.shippingAddress.postalCode}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-10">
            <Link to="/shop" className="bg-gray-800 text-white px-8 py-3 rounded-lg hover:bg-gray-900 transition-colors">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation; 