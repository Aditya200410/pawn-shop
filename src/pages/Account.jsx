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
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const { cartItems, removeFromCart } = useCart();
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Account Information
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Personal details and account information.
            </p>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Full name
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user?.name}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Email address
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user?.email}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Account type
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user?.role}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoggingOut ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing out...
              </span>
            ) : (
              'Sign out'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Account;