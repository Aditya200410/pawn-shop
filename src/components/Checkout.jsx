import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import orderService from '../services/orderService';
import config from '../config/config.js';

export default function Checkout() {
  const { cartItems, clearCart, getTotalPrice, getItemImage } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India',
    },
    paymentMethod: 'cod', // Default to Cash on Delivery
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        customerName: user.name || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  useEffect(() => {
    if (cartItems.length === 0 && !isSubmitting) {
      toast.error('Your cart is empty. Redirecting...');
      navigate('/cart');
    }
  }, [cartItems, navigate, isSubmitting]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      address: { ...prev.address, [name]: value }
    }));
  };

  const validateForm = () => {
    if (!formData.customerName || !formData.email || !formData.phone || !formData.address.street || !formData.address.city || !formData.address.pincode) {
      setError('Please fill all required fields.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setError(null);

    const orderData = {
      ...formData,
      items: cartItems.map(item => ({
        productId: item.product?._id || item.id,
        name: item.product?.name || item.name,
        price: item.product?.price || item.price,
        quantity: item.quantity,
        image: getItemImage(item),
      })),
      totalAmount: getTotalPrice(),
      paymentStatus: formData.paymentMethod === 'cod' ? 'Pending' : 'Paid',
    };

    try {
      const response = await orderService.createOrder(orderData);
      if (response.success && response.order?._id) {
        toast.success('Order placed successfully!');
        await clearCart();
        navigate(`/order-confirmation/${response.order._id}`);
      } else {
        throw new Error(response.message || 'Failed to place order.');
      }
    } catch (err) {
      console.error('Checkout failed:', err);
      setError(err.message || 'An error occurred during checkout.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 mt-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Checkout Form */}
          <div className="md:col-span-1">
            <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 border-b pb-2">Shipping Information</h2>
              {error && <div className="p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}

              <div>
                <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input type="text" name="customerName" id="customerName" value={formData.customerName} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" name="email" id="email" value={formData.email} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
              </div>
              <div>
                <label htmlFor="street" className="block text-sm font-medium text-gray-700">Street Address</label>
                <input type="text" name="street" id="street" value={formData.address.street} onChange={handleAddressChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                  <input type="text" name="city" id="city" value={formData.address.city} onChange={handleAddressChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                </div>
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
                  <input type="text" name="state" id="state" value={formData.address.state} onChange={handleAddressChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">PIN Code</label>
                  <input type="text" name="pincode" id="pincode" value={formData.address.pincode} onChange={handleAddressChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                </div>
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                  <input type="text" name="country" id="country" value={formData.address.country} onChange={handleAddressChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" disabled />
                </div>
              </div>

              <h2 className="text-xl font-semibold pt-4 border-b pb-2">Payment Method</h2>
              <div className="flex items-center">
                <input type="radio" name="paymentMethod" id="cod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={handleInputChange} className="h-4 w-4 text-orange-600 border-gray-300" />
                <label htmlFor="cod" className="ml-2 block text-sm font-medium text-gray-700">Cash on Delivery (COD)</label>
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full bg-orange-600 text-white py-3 px-4 rounded-md hover:bg-orange-700 disabled:bg-gray-400">
                {isSubmitting ? 'Placing Order...' : `Place Order (₹${getTotalPrice()})`}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 border-b pb-2">Order Summary</h2>
              <div className="space-y-4">
                {cartItems.map(item => (
                  <div key={item.product?._id || item.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img 
                        src={config.fixImageUrl(getItemImage(item))} 
                        alt={item.product?.name || item.name} 
                        className="w-16 h-16 object-cover rounded-md mr-4"
                        onError={e => {
                          e.target.onerror = null;
                          e.target.src = 'https://placehold.co/150x150/e2e8f0/475569?text=Product';
                        }}
                      />
                      <div>
                        <p className="font-semibold">{item.product?.name || item.name}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-semibold">₹{(item.product?.price || item.price) * item.quantity}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{getTotalPrice()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 