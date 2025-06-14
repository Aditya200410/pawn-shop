import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Added Link
import { UserCircleIcon, PencilSquareIcon, ArrowLeftOnRectangleIcon, CheckCircleIcon, XCircleIcon, ShoppingCartIcon, ClockIcon, TrashIcon } from '@heroicons/react/24/outline'; // Added icons
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const Account = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { cartItems, removeFromCart } = useCart();
  const { user, logout, updateProfile } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      name: user.name,
      email: user.email,
    }));
    
    setOrders([]);
  }, [user, navigate]);

  // Fetch orders when the orders tab is active
  useEffect(() => {
    if (activeTab === 'orders' && user) {
      fetchOrders();
    }
  }, [activeTab, user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/orders', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // Filter orders to only show the current user's orders
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
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'An error occurred while updating your profile.';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-pink-500"></div>
      </div>
    ); // Basic loader
  }

  // Calculate cart total
  const calculateCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price, 0);
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-gray-900 py-16 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 text-center">
            <Link to="/">
              <img src="/logo.png" alt="Volcanic Neon" className="mx-auto h-20 w-auto mb-3" />
            </Link>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">My Account</h2>
        </div>

        <div className="bg-gray-800 shadow-2xl rounded-xl overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 p-6 sm:p-8 border-b border-gray-700">
            <div className="flex items-center">
              <UserCircleIcon className="h-12 w-12 text-pink-400 mr-4" />
              <div>
                <h3 className="text-xl font-semibold text-white">{user.name}</h3>
                <p className="text-sm text-gray-400">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center text-sm font-medium text-red-400 hover:text-red-300 transition-colors duration-150"
            >
              <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-1.5" />
              Sign out
            </button>
          </div>
          
          {/* Tab Navigation */}
          <div className="border-b border-gray-700">
            <nav className="flex flex-wrap">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-3 px-4 sm:py-4 sm:px-6 text-sm font-medium border-b-2 ${activeTab === 'profile' 
                  ? 'border-pink-500 text-pink-400' 
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'}`}
              >
                <UserCircleIcon className="h-5 w-5 inline mr-2" />
                Profile
              </button>
              <button
                onClick={() => setActiveTab('cart')}
                className={`py-3 px-4 sm:py-4 sm:px-6 text-sm font-medium border-b-2 ${activeTab === 'cart' 
                  ? 'border-pink-500 text-pink-400' 
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'}`}
              >
                <ShoppingCartIcon className="h-5 w-5 inline mr-2" />
                Cart Items {cartItems.length > 0 && `(${cartItems.length})`}
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-3 px-4 sm:py-4 sm:px-6 text-sm font-medium border-b-2 ${activeTab === 'orders' 
                  ? 'border-pink-500 text-pink-400' 
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'}`}
              >
                <ClockIcon className="h-5 w-5 inline mr-2" />
                Order History
              </button>
            </nav>
          </div>

          <div className="p-5 sm:p-8">
            {message && (
              <div className="mb-5 p-3 sm:p-4 bg-green-500/20 text-green-300 rounded-md flex items-center ring-1 ring-green-500/50">
                <CheckCircleIcon className="h-5 w-5 mr-2" />
                {message}
              </div>
            )}

            {error && (
              <div className="mb-5 p-3 sm:p-4 bg-red-500/20 text-red-300 rounded-md flex items-center ring-1 ring-red-500/50">
                <XCircleIcon className="h-5 w-5 mr-2" />
                {error}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
                className="mt-1 block w-full border border-gray-700 bg-gray-700 rounded-md shadow-sm py-2.5 px-4 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm text-white placeholder-gray-400 disabled:opacity-70 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
                className="mt-1 block w-full border border-gray-700 bg-gray-700 rounded-md shadow-sm py-2.5 px-4 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm text-white placeholder-gray-400 disabled:opacity-70 disabled:cursor-not-allowed"
              />
            </div>

            {isEditing && (
              <>
                <div className="pt-4 border-t border-gray-700">
                    <h4 className="text-md font-semibold text-gray-200 mb-3">Change Password</h4>
                </div>
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-300 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    id="currentPassword"
                    autoComplete="current-password"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-700 bg-gray-700 rounded-md shadow-sm py-2.5 px-4 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm text-white placeholder-gray-400"
                  />
                </div>

                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    id="newPassword"
                    autoComplete="new-password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-700 bg-gray-700 rounded-md shadow-sm py-2.5 px-4 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm text-white placeholder-gray-400"
                  />
                </div>

                <div>
                  <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-300 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmNewPassword"
                    id="confirmNewPassword"
                    autoComplete="new-password"
                    value={formData.confirmNewPassword}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-700 bg-gray-700 rounded-md shadow-sm py-2.5 px-4 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm text-white placeholder-gray-400"
                  />
                </div>
              </>
            )}

            <div className="pt-5 mt-2 border-t border-gray-700 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                        setIsEditing(false);
                        setError('');
                        setMessage('');
                        // Reset form to original user data if canceling edit
                        const storedUser = localStorage.getItem('user');
                        if (storedUser) {
                            const userData = JSON.parse(storedUser);
                            setFormData({
                                name: userData.name,
                                email: userData.email,
                                currentPassword: '',
                                newPassword: '',
                                confirmNewPassword: '',
                            });
                        }
                    }}
                    className="w-full sm:w-auto justify-center py-2.5 px-5 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-500 transition-colors duration-150"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-full sm:w-auto justify-center py-2.5 px-5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-pink-500 transition-all duration-150 ease-in-out"
                  >
                    Save Changes
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="w-full sm:w-auto flex items-center justify-center py-2.5 px-5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-pink-500 transition-colors duration-150"
                >
                  <PencilSquareIcon className="h-5 w-5 mr-2" />
                  Edit Profile
                </button>
              )}
            </div>
              </form>
            )}

            {/* Cart Items Tab */}
            {activeTab === 'cart' && (
              <div>
                <h3 className="text-xl font-semibold mb-6">Your Cart Items</h3>
                
                {cartItems.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCartIcon className="h-12 w-12 mx-auto text-gray-500 mb-3" />
                    <p className="text-gray-400">Your cart is empty</p>
                    <Link to="/shop" className="mt-4 inline-block text-pink-400 hover:text-pink-300">
                      Browse products
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-700/30 rounded-lg">
                        <div className="w-16 h-16 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                          <img src={item.preview} alt={item.text} className="w-full h-full object-cover" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-white truncate">{item.text}</h4>
                          <p className="text-sm text-gray-400 truncate">
                            {item.color} • {item.size} • {item.font}
                          </p>
                          {item.type && (
                            <p className="text-sm text-gray-400">Type: {item.type}</p>
                          )}
                          <p className="text-pink-400 font-medium mt-1">₹{item.price}</p>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                          aria-label="Remove item"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    ))}

                    <div className="mt-6 pt-4 border-t border-gray-700 flex justify-between items-center">
                      <span className="font-medium">Total: <span className="text-pink-400">₹{calculateCartTotal()}</span></span>
                      <Link 
                        to="/checkout" 
                        className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-md font-medium hover:from-pink-600 hover:to-purple-700 transition-all duration-150"
                      >
                        Checkout
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-white">Order History</h3>
                  <Link 
                    to="/orders" 
                    className="text-sm text-pink-400 hover:text-pink-300 transition-colors duration-150"
                  >
                    View All Orders
                  </Link>
                </div>

                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No orders found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order._id} className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-blue-500 opacity-30 blur group-hover:opacity-50 transition duration-300 rounded-lg"></div>
                        <div className="relative bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                          <div className="flex flex-col sm:flex-row justify-between gap-4">
                            <div>
                              <h4 className="font-medium text-white group-hover:text-pink-400 transition-colors duration-300">
                                Order #{order._id.slice(-6).toUpperCase()}
                              </h4>
                              <p className="text-sm text-gray-400 mt-1">
                                Placed on {format(new Date(order.createdAt), 'PPP')}
                              </p>
                              <div className="flex flex-wrap gap-2 mt-2">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                                  {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                                </span>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                                  {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-400">Total Amount</p>
                              <p className="text-lg font-bold text-pink-400 group-hover:text-blue-400 transition-colors duration-300">
                                ₹{order.totalAmount.toLocaleString()}
                              </p>
                              <Link 
                                to={`/orders`} 
                                className="inline-block text-sm text-pink-400 hover:text-pink-300 mt-2 transition-colors duration-150"
                              >
                                View Details →
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;