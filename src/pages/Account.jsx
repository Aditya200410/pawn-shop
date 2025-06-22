import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  UserCircleIcon, 
  PencilSquareIcon, 
  ArrowLeftOnRectangleIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  ShoppingCartIcon, 
  ClockIcon, 
  TrashIcon, 
  PlusIcon, 
  MinusIcon,
  CogIcon,
  ShieldCheckIcon,
  HeartIcon,
  StarIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  CreditCardIcon,
  TruckIcon,
  GiftIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import cartService from '../services/cartService';
import config from '../config/config.js';

const Account = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, clearCart, getTotalPrice, loading: cartLoading } = useCart();
  const { user, logout, updateProfile, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      setLoading(false);
      toast.success(`Welcome back, ${user?.name}!`);
    }
  }, [isAuthenticated, navigate, user]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      address: user.address || '',
    }));
    
    setOrders([]);
  }, [user, navigate]);

  useEffect(() => {
    if (activeTab === 'orders' && user) {
      fetchOrders();
    }
  }, [activeTab, user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(config.API_URLS.ORDERS, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const userOrders = response.data.filter(order => order.email === user.email);
      setOrders(userOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      const errorMessage = error.response?.data?.message || 'Failed to fetch orders';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await updateQuantity(productId, newQuantity);
      toast.success('Cart updated successfully');
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update cart');
    }
  };

  const handleRemoveFromCart = async (productId) => {
    try {
      await removeFromCart(productId);
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Failed to remove item from cart');
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
      toast.success('Cart cleared successfully');
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'processing':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'confirmed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'manufacturing':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'shipped':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'delivered':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'processing':
        return <ClockIcon className="h-4 w-4" />;
      case 'confirmed':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'manufacturing':
        return <CogIcon className="h-4 w-4" />;
      case 'shipped':
        return <TruckIcon className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircleIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (formData.newPassword && formData.newPassword !== formData.confirmNewPassword) {
      setError('New passwords do not match');
      toast.error('New passwords do not match');
      return;
    }

    try {
      await updateProfile({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      setMessage('Profile updated successfully!');
      setIsEditing(false);
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      }));
      toast.success('Profile updated successfully!');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'An error occurred while updating your profile.';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      toast.success('Logged out successfully');
    navigate('/login');
    } catch (error) {
      toast.error('Failed to logout. Please try again.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (loading || cartLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center space-y-4"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-200 border-t-amber-600"></div>
          <p className="text-amber-700 font-medium">Loading your account...</p>
        </motion.div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: UserCircleIcon },
    { id: 'profile', label: 'Profile', icon: PencilSquareIcon },
    { id: 'cart', label: 'Cart', icon: ShoppingCartIcon },
    { id: 'orders', label: 'Orders', icon: GiftIcon },
    
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
              <p className="text-gray-600 mt-1">Welcome back, {user?.name}! Manage your profile and orders.</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors shadow-lg"
            >
              <ArrowLeftOnRectangleIcon className="h-5 w-5" />
              <span>{isLoggingOut ? 'Signing out...' : 'Sign out'}</span>
            </motion.button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6 sticky top-8"
            >
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-amber-100 text-amber-700 border border-amber-200 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <tab.icon className="h-5 w-5" />
                    <span className="font-medium">{tab.label}</span>
                  </motion.button>
                ))}
            </nav>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div
                      whileHover={{ y: -4 }}
                      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Total Orders</p>
                          <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                        </div>
                        <div className="p-3 bg-amber-100 rounded-xl">
                          <GiftIcon className="h-6 w-6 text-amber-600" />
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      whileHover={{ y: -4 }}
                      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Cart Items</p>
                          <p className="text-2xl font-bold text-gray-900">{cartItems.length}</p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-xl">
                          <ShoppingCartIcon className="h-6 w-6 text-blue-600" />
                        </div>
                </div>
                    </motion.div>

                    <motion.div
                      whileHover={{ y: -4 }}
                      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Account Status</p>
                          <p className="text-2xl font-bold text-green-600">Active</p>
                </div>
                        <div className="p-3 bg-green-100 rounded-xl">
                          <CheckCircleIcon className="h-6 w-6 text-green-600" />
                </div>
            </div>
                    </motion.div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveTab('cart')}
                        className="flex items-center space-x-3 p-4 bg-amber-50 rounded-xl hover:bg-amber-100 transition-colors"
                      >
                        <ShoppingCartIcon className="h-6 w-6 text-amber-600" />
                        <span className="font-medium text-gray-900">View Cart</span>
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveTab('orders')}
                        className="flex items-center space-x-3 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
                      >
                        <GiftIcon className="h-6 w-6 text-blue-600" />
                        <span className="font-medium text-gray-900">View Orders</span>
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveTab('profile')}
                        className="flex items-center space-x-3 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
                      >
                        <PencilSquareIcon className="h-6 w-6 text-green-600" />
                        <span className="font-medium text-gray-900">Edit Profile</span>
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveTab('security')}
                        className="flex items-center space-x-3 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors"
                      >
                        <ShieldCheckIcon className="h-6 w-6 text-purple-600" />
                        <span className="font-medium text-gray-900">Security Settings</span>
                      </motion.button>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                        <div className="p-2 bg-amber-100 rounded-lg">
                          <UserCircleIcon className="h-4 w-4 text-amber-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Account logged in</p>
                          <p className="text-sm text-gray-500">Just now</p>
                        </div>
                      </div>
                      
                      {cartItems.length > 0 && (
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <ShoppingCartIcon className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{cartItems.length} items in cart</p>
                            <p className="text-sm text-gray-500">Total: ₹{getTotalPrice().toFixed(2)}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'profile' && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">Profile Information</h3>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsEditing(!isEditing)}
                      className="flex items-center space-x-2 px-4 py-2 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors"
                    >
                      <PencilSquareIcon className="h-4 w-4" />
                      <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
                    </motion.button>
                  </div>

                  {isEditing ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                          <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div className="border-t pt-6">
                        <h4 className="text-lg font-medium text-gray-900 mb-4">Change Password</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                            <input
                              type="password"
                              name="currentPassword"
                              value={formData.currentPassword}
                              onChange={handleChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                            <input
                              type="password"
                              name="newPassword"
                              value={formData.newPassword}
                              onChange={handleChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                            <input
                              type="password"
                              name="confirmNewPassword"
                              value={formData.confirmNewPassword}
                              onChange={handleChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                      </div>

                      {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                          <p className="text-red-700">{error}</p>
                        </div>
                      )}

                      {message && (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                          <p className="text-green-700">{message}</p>
                        </div>
                      )}

                      <div className="flex justify-end space-x-4">
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setIsEditing(false)}
                          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </motion.button>
                        <motion.button
                          type="submit"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-6 py-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors"
                        >
                          Save Changes
                        </motion.button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                          <UserCircleIcon className="h-6 w-6 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Full Name</p>
                            <p className="font-medium text-gray-900">{user?.name}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                          <EnvelopeIcon className="h-6 w-6 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium text-gray-900">{user?.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                          <PhoneIcon className="h-6 w-6 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Phone</p>
                            <p className="font-medium text-gray-900">{user?.phone || 'Not provided'}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                          <MapPinIcon className="h-6 w-6 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Address</p>
                            <p className="font-medium text-gray-900">{user?.address || 'Not provided'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'cart' && (
                <motion.div
                  key="cart"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Shopping Cart</h3>
                  
                  {cartItems.length === 0 ? (
                    <div className="text-center py-12">
                      <ShoppingCartIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                      <p className="text-gray-500 mb-6">Start shopping to add items to your cart.</p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/shop')}
                        className="px-6 py-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors"
                      >
                        Browse Products
                      </motion.button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {cartItems.map((item) => (
                        <motion.div
                          key={item.product?._id || item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                        >
                          <div className="flex items-center space-x-4">
                            <img
                              src={config.fixImageUrl(item.product?.image || item.image)}
                              alt={item.product?.name || item.name}
                              className="h-16 w-16 object-cover rounded-lg"
                            />
                            <div>
                              <h4 className="font-medium text-gray-900">{item.product?.name || item.name}</h4>
                              <p className="text-sm text-gray-500">₹{(item.product?.price || item.price).toFixed(2)}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2 bg-white rounded-lg p-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              onClick={() => handleUpdateQuantity(item.product?._id || item.id, item.quantity - 1)}
                              className="p-1 rounded-full hover:bg-gray-100"
                              disabled={item.quantity <= 1}
                            >
                              <MinusIcon className="h-4 w-4" />
                              </motion.button>
                              <span className="font-medium px-2">{item.quantity}</span>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              onClick={() => handleUpdateQuantity(item.product?._id || item.id, item.quantity + 1)}
                              className="p-1 rounded-full hover:bg-gray-100"
                            >
                              <PlusIcon className="h-4 w-4" />
                              </motion.button>
                          </div>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            onClick={() => handleRemoveFromCart(item.product?._id || item.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <TrashIcon className="h-5 w-5" />
                            </motion.button>
                        </div>
                        </motion.div>
                    ))}
                      
                      <div className="border-t pt-6">
                        <div className="flex justify-between items-center mb-4">
                      <div className="text-lg font-medium">
                        Total: ₹{getTotalPrice().toFixed(2)}
                      </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          onClick={handleClearCart}
                          className="text-sm text-red-600 hover:text-red-800"
                        >
                          Clear Cart
                          </motion.button>
                        </div>
                        <div className="flex space-x-4">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/shop')}
                            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                          >
                            Continue Shopping
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/checkout')}
                            className="flex-1 px-6 py-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors"
                      >
                          Proceed to Checkout
                          </motion.button>
                        </div>
                    </div>
                  </div>
                )}
                </motion.div>
            )}

            {activeTab === 'orders' && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Order History</h3>
                  
                {orders.length === 0 ? (
                    <div className="text-center py-12">
                      <GiftIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                      <p className="text-gray-500 mb-6">Start shopping to place your first order.</p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/shop')}
                        className="px-6 py-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors"
                      >
                        Browse Products
                      </motion.button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                        <motion.div
                          key={order._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 bg-gray-50 rounded-xl border border-gray-200"
                        >
                          <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <img
                                src={config.fixImageUrl(order.product?.image)}
                                alt={order.product?.name}
                                className="h-16 w-16 object-cover rounded-lg"
                            />
                            <div>
                                <h4 className="font-medium text-gray-900">{order.product?.name}</h4>
                              <p className="text-sm text-gray-500">Order ID: {order._id}</p>
                                <p className="text-sm text-gray-500">₹{order.total?.toFixed(2)}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(order.status)}
                              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                                {order.status}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'security' && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Security Settings</h3>
                  
                  <div className="space-y-6">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <ShieldCheckIcon className="h-6 w-6 text-green-600" />
                        <div>
                          <h4 className="font-medium text-green-900">Account Security</h4>
                          <p className="text-sm text-green-700">Your account is secure and protected.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <h4 className="font-medium text-gray-900 mb-2">Two-Factor Authentication</h4>
                        <p className="text-sm text-gray-600 mb-4">Add an extra layer of security to your account.</p>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                        >
                          Enable 2FA
                        </motion.button>
                      </div>
                      
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <h4 className="font-medium text-gray-900 mb-2">Login History</h4>
                        <p className="text-sm text-gray-600 mb-4">View your recent login activity.</p>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          View History
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
                )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;