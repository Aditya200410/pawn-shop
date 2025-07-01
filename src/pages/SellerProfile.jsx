import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSeller } from '../context/SellerContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Loader from '../components/Loader';
import { 
  FiDollarSign, 
  FiShoppingCart, 
  FiLink, 
  FiTag, 
  FiDownload, 
  FiSmartphone,
  FiUser,
  FiSettings,
  FiBarChart,
  FiCreditCard,
  FiLogOut,
  FiEdit3,
  FiCheck,
  FiX,
  FiTrendingUp,
  FiUsers,
  FiPackage,
  FiStar,
  FiImage
} from 'react-icons/fi';
import RikoCraftPoster from '../components/RikoCraftPoster';
import html2canvas from 'html2canvas';

const SellerProfile = () => {
  const { seller, loading, error, updateProfile, logout, fetchProfile } = useSeller();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const posterRef = useRef();
  const [formData, setFormData] = useState({
    businessName: '',
    phone: '',
    address: '',
    businessType: '',
    accountHolderName: '',
    bankAccountNumber: '',
    ifscCode: '',
    bankName: ''
  });
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);
  const [bankDetails, setBankDetails] = useState({
    accountName: '',
    accountNumber: '',
    ifsc: '',
    bankName: ''
  });
  const [withdrawing, setWithdrawing] = useState(false);
  const [availableToWithdraw, setAvailableToWithdraw] = useState(0);

  // Fetch seller profile on mount if not present
  useEffect(() => {
    if (!seller) {
      const token = localStorage.getItem('seller_token');
      if (token) fetchProfile(token);
    }
    // eslint-disable-next-line
  }, []);

  // Update formData when seller is loaded
  useEffect(() => {
    if (seller) {
      setFormData({
        businessName: seller.businessName || '',
        phone: seller.phone || '',
        address: seller.address || '',
        businessType: seller.businessType || '',
        accountHolderName: seller.accountHolderName || '',
        bankAccountNumber: seller.bankAccountNumber || '',
        ifscCode: seller.ifscCode || '',
        bankName: seller.bankName || ''
      });
      setBankDetails({
        accountName: seller.accountHolderName || seller.bankDetails?.accountName || '',
        accountNumber: seller.bankAccountNumber || seller.bankDetails?.accountNumber || '',
        ifsc: seller.ifscCode || seller.bankDetails?.ifsc || '',
        bankName: seller.bankName || seller.bankDetails?.bankName || ''
      });
      setAvailableToWithdraw(Math.round(seller.availableCommission || 0));
    }
  }, [seller]);

  useEffect(() => {
    const sellerEmail = localStorage.getItem('seller_email');
    if (!loading && !seller && !sellerEmail) {
      navigate('/seller');
    }
  }, [loading, seller, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-pink-50">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-white p-8 rounded-2xl shadow-xl"
        >
          <h2 className="text-2xl font-bold mb-4 text-red-600">Something went wrong</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button 
            onClick={() => navigate('/seller')} 
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-500 text-white rounded-xl hover:from-pink-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Go to Seller Login
          </button>
        </motion.div>
      </div>
    );
  }

  if (!seller) {
    return null;
  }

  // Fallbacks for all fields used in rendering
  const safeSeller = {
    businessName: seller.businessName || '',
    email: seller.email || '',
    phone: seller.phone || '',
    address: seller.address || '',
    businessType: seller.businessType || '',
    accountHolderName: seller.accountHolderName || seller.bankDetails?.accountName || '',
    bankAccountNumber: seller.bankAccountNumber || seller.bankDetails?.accountNumber || '',
    ifscCode: seller.ifscCode || seller.bankDetails?.ifsc || '',
    bankName: seller.bankName || seller.bankDetails?.bankName || '',
    sellerToken: seller.sellerToken || '',
    websiteLink: seller.websiteLink || '',
    qrCode: seller.qrCode || '',
    images: Array.isArray(seller.images) ? seller.images : [],
    profileImage: seller.profileImage || null,
    totalOrders: seller.totalOrders || 0,
    totalCommission: seller.totalCommission || 0,
    availableCommission: seller.availableCommission || 0,
    withdrawals: Array.isArray(seller.withdrawals) ? seller.withdrawals : [],
    createdAt: seller.createdAt || '',
    verified: typeof seller.verified === 'boolean' ? seller.verified : false
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/seller');
    window.location.reload();
  };

  const downloadQRCode = async () => {
    if (!seller.qrCode) {
      toast.error('QR code not available');
      return;
    }
    try {
      const posterNode = posterRef.current;
      const canvas = await html2canvas(posterNode, { backgroundColor: null, useCORS: true });
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = url;
      link.download = `${seller.businessName}-poster.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Poster downloaded successfully!');
    } catch (error) {
      console.error('Error downloading poster:', error);
      toast.error('Failed to download poster');
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    setWithdrawing(true);
    try {
      const res = await fetch(`/api/seller/withdraw`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('seller_token')}` },
        body: JSON.stringify({
          bankDetails,
          amount: availableToWithdraw
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('Withdrawal request submitted!');
        setShowWithdrawForm(false);
      } else {
        toast.error(data.message || 'Failed to request withdrawal');
      }
    } catch (err) {
      toast.error('Failed to request withdrawal');
    } finally {
      setWithdrawing(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiBarChart },
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'earnings', label: 'Earnings', icon: FiDollarSign },
    { id: 'tools', label: 'Tools', icon: FiSettings }
  ];

  const stats = [
    {
      title: 'Total Orders',
      value: seller.totalOrders || 0,
      svg: (
        <svg className="w-6 h-6" fill="none" stroke="url(#orders-gradient)" strokeWidth="2" viewBox="0 0 24 24">
          <defs>
            <linearGradient id="orders-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
          </defs>
          <path stroke="url(#orders-gradient)" d="M3 7V6a2 2 0 012-2h2a2 2 0 012 2v1m0 0h4m-4 0v10a2 2 0 002 2h4a2 2 0 002-2V7m-8 0V6a2 2 0 012-2h2a2 2 0 012 2v1" />
        </svg>
      ),
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Commission',
      value: `₹${Math.round(seller.totalCommission || 0)}`,
      svg: (
        <svg className="w-6 h-6" fill="none" stroke="url(#commission-gradient)" strokeWidth="2" viewBox="0 0 24 24">
          <defs>
            <linearGradient id="commission-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#16a34a" />
            </linearGradient>
          </defs>
          <circle cx="12" cy="12" r="10" stroke="url(#commission-gradient)" />
          <path stroke="url(#commission-gradient)" d="M8 12h8M12 8v8" />
        </svg>
      ),
      bgColor: 'bg-green-50'
    },
    {
      title: 'Available to Withdraw',
      value: `₹${availableToWithdraw}`,
      svg: (
        <svg className="w-6 h-6" fill="none" stroke="url(#withdraw-gradient)" strokeWidth="2" viewBox="0 0 24 24">
          <defs>
            <linearGradient id="withdraw-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
          </defs>
          <path stroke="url(#withdraw-gradient)" d="M12 4v16m8-8H4" />
        </svg>
      ),
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Commission Rate',
      value: '30%',
      svg: (
        <svg className="w-6 h-6" fill="none" stroke="url(#rate-gradient)" strokeWidth="2" viewBox="0 0 24 24">
          <defs>
            <linearGradient id="rate-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f59e42" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>
          </defs>
          <circle cx="12" cy="12" r="10" stroke="url(#rate-gradient)" />
          <path stroke="url(#rate-gradient)" d="M8 12l2 2 4-4" />
        </svg>
      ),
      bgColor: 'bg-pink-50'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hidden poster for download */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        <div ref={posterRef}>
          <RikoCraftPoster qrSrc={seller.qrCode} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="relative bg-gradient-to-r from-pink-500 via-pink-500 to-pink-600 px-4 sm:px-8 py-8 sm:py-12 text-white overflow-hidden">
            <div className="absolute inset-0 bg-black opacity-10"></div>
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                  <h1 className="text-2xl sm:text-4xl font-bold mb-2">Seller Dashboard</h1>
                  <p className="text-pink-100 text-base sm:text-lg">Welcome back, {seller.businessName}!</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-white bg-opacity-20 backdrop-blur-sm text-white rounded-xl hover:bg-white hover:text-pink-600 transition-all duration-300 border border-white border-opacity-30 text-sm sm:text-base"
                >
                  <FiLogOut className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Logout
                </motion.button>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white border-opacity-30"
                  >
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="text-pink-100 text-xs sm:text-sm truncate">{stat.title}</p>
                        <p className="text-lg sm:text-2xl font-bold truncate">{stat.value}</p>
                      </div>
                      <div className={`p-2 sm:p-3 rounded-lg ${stat.bgColor} flex-shrink-0 ml-2`}>{stat.svg}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="border-b border-gray-200 bg-gray-50">
            <div className="flex flex-wrap space-x-1 px-4 sm:px-8 py-2 sm:py-4">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-3 sm:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all duration-300 text-sm sm:text-base ${
                    activeTab === tab.id
                      ? 'bg-white text-pink-600 shadow-lg border border-pink-200'
                      : 'text-gray-600 hover:text-pink-600 hover:bg-white'
                  }`}
                >
                  <tab.icon className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-4 sm:p-8">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6 sm:space-y-8"
                >
                  {/* Business Info Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    <motion.div
                      whileHover={{ y: -5 }}
                      className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-6 rounded-2xl border border-blue-200"
                    >
                      <div className="flex items-center mb-4">
                        <div className="p-2 sm:p-3 bg-blue-500 rounded-xl mr-3 sm:mr-4">
                          <FiTag className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Seller Token</h3>
                          <p className="text-xs sm:text-sm text-gray-600">Your unique identifier</p>
                        </div>
                      </div>
                      <p className="text-lg sm:text-2xl font-bold text-blue-600 font-mono break-all">{seller.sellerToken}</p>
                    </motion.div>

                    <motion.div
                      whileHover={{ y: -5 }}
                      className="bg-gradient-to-br from-green-50 to-green-100 p-4 sm:p-6 rounded-2xl border border-green-200"
                    >
                      <div className="flex items-center mb-4">
                        <div className="p-2 sm:p-3 bg-green-500 rounded-xl mr-3 sm:mr-4">
                          <FiLink className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Shop Link</h3>
                          <p className="text-xs sm:text-sm text-gray-600">Share with customers</p>
                        </div>
                      </div>
                      <a 
                        href={seller.websiteLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-700 font-medium break-all text-sm sm:text-base"
                      >
                        View Shop →
                      </a>
                    </motion.div>

                    <motion.div
                      whileHover={{ y: -5 }}
                      className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 sm:p-6 rounded-2xl border border-purple-200"
                    >
                      <div className="flex items-center mb-4">
                        <div className="p-2 sm:p-3 bg-purple-500 rounded-xl mr-3 sm:mr-4">
                          <FiSmartphone className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-gray-900 text-sm sm:text-base">QR Code</h3>
                          <p className="text-xs sm:text-sm text-gray-600">Download & share</p>
                        </div>
                      </div>
                      <button
                        onClick={downloadQRCode}
                        className="flex items-center text-purple-600 hover:text-purple-700 font-medium text-sm sm:text-base"
                      >
                        <FiDownload className="w-4 h-4 sm:w-4 sm:h-4 mr-2" />
                        Download QR Code
                      </button>
                    </motion.div>
                  </div>

                  {/* QR Code Display */}
                  {seller.qrCode && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-8 rounded-2xl border border-gray-200 text-center"
                    >
                      <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-gray-900">Your Shop QR Code</h3>
                      <div className="flex justify-center">
                        <div className="bg-white p-3 sm:p-4 rounded-2xl shadow-lg">
                          <img 
                            src={seller.qrCode} 
                            alt="Shop QR Code" 
                            className="w-32 h-32 sm:w-48 sm:h-48 rounded-xl"
                          />
                        </div>
                      </div>
                      <p className="text-gray-600 mt-3 sm:mt-4 text-sm sm:text-base">
                        Scan this QR code to visit your shop
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {activeTab === 'profile' && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6 sm:space-y-8"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Business Profile</h2>
                    {!isEditing && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsEditing(true)}
                        className="flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-pink-500 to-pink-500 text-white rounded-xl hover:from-pink-600 hover:to-pink-600 transition-all duration-300 shadow-lg text-sm sm:text-base"
                      >
                        <FiEdit3 className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        Edit Profile
                      </motion.button>
                    )}
                  </div>

                  {/* Profile Image */}
                  {seller.profileImage && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-6 rounded-2xl border border-blue-200"
                    >
                      <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900 flex items-center">
                        <FiUser className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 mr-2" />
                        Profile Image
                      </h3>
                      <div className="flex justify-center">
                        <img
                          src={seller.profileImage.url}
                          alt={seller.profileImage.alt || 'Profile image'}
                          className="w-32 h-32 sm:w-48 sm:h-48 object-cover rounded-2xl shadow-lg"
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Business Images Gallery */}
                  {seller.images && seller.images.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 rounded-2xl border border-gray-200"
                    >
                      <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900 flex items-center">
                        <FiImage className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 mr-2" />
                        Business Images ({seller.images.length})
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                        {seller.images.map((image, index) => (
                          <motion.div
                            key={image._id || index}
                            whileHover={{ scale: 1.05 }}
                            className="relative group"
                          >
                            <img
                              src={image.url}
                              alt={image.alt || `Business image ${index + 1}`}
                              className="w-full h-24 sm:h-32 object-cover rounded-xl shadow-md"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-xl flex items-center justify-center">
                              <button
                                onClick={() => {
                                  // Open image in full screen or modal
                                  window.open(image.url, '_blank');
                                }}
                                className="opacity-0 group-hover:opacity-100 transition-opacity bg-white bg-opacity-80 p-2 rounded-full"
                              >
                                <FiUser className="w-4 h-4 text-gray-700" />
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {isEditing ? (
                    <motion.form
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      onSubmit={handleSubmit}
                      className="bg-gray-50 p-4 sm:p-8 rounded-2xl space-y-4 sm:space-y-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Business Name</label>
                          <input
                            type="text"
                            name="businessName"
                            value={formData.businessName}
                            onChange={handleChange}
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Business Type</label>
                          <input
                            type="text"
                            name="businessType"
                            value={formData.businessType}
                            onChange={handleChange}
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Account Holder Name</label>
                          <input
                            type="text"
                            name="accountHolderName"
                            value={formData.accountHolderName}
                            onChange={handleChange}
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Bank Account Number</label>
                          <input
                            type="text"
                            name="bankAccountNumber"
                            value={formData.bankAccountNumber}
                            onChange={handleChange}
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">IFSC Code</label>
                          <input
                            type="text"
                            name="ifscCode"
                            value={formData.ifscCode}
                            onChange={handleChange}
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Bank Name</label>
                          <input
                            type="text"
                            name="bankName"
                            value={formData.bankName}
                            onChange={handleChange}
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          rows="4"
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                        />
                      </div>
                      <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-300 text-sm sm:text-base"
                        >
                          <FiX className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                          Cancel
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          type="submit"
                          className="flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg text-sm sm:text-base"
                        >
                          <FiCheck className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                          Save Changes
                        </motion.button>
                      </div>
                    </motion.form>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      <motion.div
                        whileHover={{ y: -2 }}
                        className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-6 rounded-2xl border border-blue-200"
                      >
                        <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Business Name</h3>
                        <p className="text-base sm:text-lg text-blue-600 break-words">{seller.businessName}</p>
                      </motion.div>
                      <motion.div
                        whileHover={{ y: -2 }}
                        className="bg-gradient-to-br from-green-50 to-green-100 p-4 sm:p-6 rounded-2xl border border-green-200"
                      >
                        <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Email</h3>
                        <p className="text-base sm:text-lg text-green-600 break-words">{seller.email}</p>
                      </motion.div>
                      <motion.div
                        whileHover={{ y: -2 }}
                        className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 sm:p-6 rounded-2xl border border-purple-200"
                      >
                        <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Phone</h3>
                        <p className="text-base sm:text-lg text-purple-600">{seller.phone}</p>
                      </motion.div>
                      <motion.div
                        whileHover={{ y: -2 }}
                        className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 sm:p-6 rounded-2xl border border-pink-200"
                      >
                        <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Business Type</h3>
                        <p className="text-base sm:text-lg text-pink-600 break-words">{seller.businessType}</p>
                      </motion.div>
                      <motion.div
                        whileHover={{ y: -2 }}
                        className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 sm:p-6 rounded-2xl border border-indigo-200"
                      >
                        <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Address</h3>
                        <p className="text-base sm:text-lg text-indigo-600 break-words">{seller.address}</p>
                      </motion.div>
                      <motion.div
                        whileHover={{ y: -2 }}
                        className="bg-gradient-to-br from-teal-50 to-teal-100 p-4 sm:p-6 rounded-2xl border border-teal-200"
                      >
                        <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Account Holder</h3>
                        <p className="text-base sm:text-lg text-teal-600 break-words">{seller.accountHolderName}</p>
                      </motion.div>
                      <motion.div
                        whileHover={{ y: -2 }}
                        className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 sm:p-6 rounded-2xl border border-orange-200"
                      >
                        <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Bank Account</h3>
                        <p className="text-base sm:text-lg text-orange-600 break-words">{seller.bankAccountNumber}</p>
                      </motion.div>
                      <motion.div
                        whileHover={{ y: -2 }}
                        className="bg-gradient-to-br from-red-50 to-red-100 p-4 sm:p-6 rounded-2xl border border-red-200"
                      >
                        <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">IFSC Code</h3>
                        <p className="text-base sm:text-lg text-red-600 break-words">{seller.ifscCode}</p>
                      </motion.div>
                      <motion.div
                        whileHover={{ y: -2 }}
                        className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 sm:p-6 rounded-2xl border border-yellow-200"
                      >
                        <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Bank Name</h3>
                        <p className="text-base sm:text-lg text-yellow-600 break-words">{seller.bankName}</p>
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'earnings' && (
                <motion.div
                  key="earnings"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6 sm:space-y-8"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Earnings & Withdrawals</h2>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowWithdrawForm(true)}
                      disabled={availableToWithdraw <= 0}
                      className="flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                    >
                      <FiCreditCard className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Withdraw Earnings
                    </motion.button>
                  </div>

                  {/* Earnings Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                    <motion.div
                      whileHover={{ y: -5 }}
                      className="bg-gradient-to-br from-green-50 to-green-100 p-4 sm:p-6 rounded-2xl border border-green-200"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Total Commission</h3>
                        <div className="p-2 sm:p-3 bg-green-500 rounded-xl">
                          
                        </div>
                      </div>
                      <p className="text-2xl sm:text-3xl font-bold text-green-600">₹{Math.round(seller.totalCommission || 0)}</p>
                      <p className="text-xs sm:text-sm text-gray-600 mt-2">30% commission from orders</p>
                    </motion.div>

                    <motion.div
                      whileHover={{ y: -5 }}
                      className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-6 rounded-2xl border border-blue-200"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Available to Withdraw</h3>
                        <div className="p-2 sm:p-3 bg-blue-500 rounded-xl">
                          <FiTrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                      </div>
                      <p className="text-2xl sm:text-3xl font-bold text-blue-600">₹{availableToWithdraw}</p>
                      <p className="text-xs sm:text-sm text-gray-600 mt-2">Ready for withdrawal</p>
                    </motion.div>

                    <motion.div
                      whileHover={{ y: -5 }}
                      className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 sm:p-6 rounded-2xl border border-purple-200"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Total Orders</h3>
                        <div className="p-2 sm:p-3 bg-purple-500 rounded-xl">
                          <FiShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                      </div>
                      <p className="text-2xl sm:text-3xl font-bold text-purple-600">{seller.totalOrders || 0}</p>
                      <p className="text-xs sm:text-sm text-gray-600 mt-2">Orders through your link</p>
                    </motion.div>
                  </div>

                  {/* Bank Details */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 rounded-2xl border border-gray-200"
                  >
                    <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900 flex items-center">
                      <FiCreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 mr-2" />
                      Bank Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <p className="text-xs sm:text-sm text-gray-600">Account Holder</p>
                        <p className="font-semibold text-gray-900 text-sm sm:text-base">{seller.accountHolderName}</p>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-gray-600">Account Number</p>
                        <p className="font-semibold text-gray-900 text-sm sm:text-base">{seller.bankAccountNumber}</p>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-gray-600">IFSC Code</p>
                        <p className="font-semibold text-gray-900 text-sm sm:text-base">{seller.ifscCode}</p>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-gray-600">Bank Name</p>
                        <p className="font-semibold text-gray-900 text-sm sm:text-base">{seller.bankName}</p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {activeTab === 'tools' && (
                <motion.div
                  key="tools"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6 sm:space-y-8"
                >
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Tools & Resources</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <motion.div
                      whileHover={{ y: -5 }}
                      className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-6 rounded-2xl border border-blue-200"
                    >
                      <div className="flex items-center mb-4">
                        <div className="p-2 sm:p-3 bg-blue-500 rounded-xl mr-3 sm:mr-4">
                          <FiDownload className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Download QR Code</h3>
                          <p className="text-xs sm:text-sm text-gray-600">Share with customers</p>
                        </div>
                      </div>
                      <button
                        onClick={downloadQRCode}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-300 text-sm sm:text-base"
                      >
                        Download Poster
                      </button>
                    </motion.div>

                    <motion.div
                      whileHover={{ y: -5 }}
                      className="bg-gradient-to-br from-green-50 to-green-100 p-4 sm:p-6 rounded-2xl border border-green-200"
                    >
                      <div className="flex items-center mb-4">
                        <div className="p-2 sm:p-3 bg-green-500 rounded-xl mr-3 sm:mr-4">
                          <FiLink className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Shop Link</h3>
                          <p className="text-xs sm:text-sm text-gray-600">Copy and share</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(seller.websiteLink);
                          toast.success('Link copied to clipboard!');
                        }}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all duration-300 text-sm sm:text-base"
                      >
                        Copy Link
                      </button>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Withdraw Form Modal */}
      <AnimatePresence>
        {showWithdrawForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-4 sm:p-8 w-full max-w-md shadow-2xl"
            >
              <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900">Withdraw to Bank</h3>
              <form onSubmit={handleWithdraw} className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Account Holder Name</label>
                  <input
                    type="text"
                    placeholder="Enter account holder name"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm sm:text-base"
                    value={bankDetails.accountName}
                    onChange={e => setBankDetails({ ...bankDetails, accountName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Account Number</label>
                  <input
                    type="text"
                    placeholder="Enter account number"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm sm:text-base"
                    value={bankDetails.accountNumber}
                    onChange={e => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">IFSC Code</label>
                  <input
                    type="text"
                    placeholder="Enter IFSC code"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm sm:text-base"
                    value={bankDetails.ifsc}
                    onChange={e => setBankDetails({ ...bankDetails, ifsc: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Bank Name</label>
                  <input
                    type="text"
                    placeholder="Enter bank name"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm sm:text-base"
                    value={bankDetails.bankName}
                    onChange={e => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                    required
                  />
                </div>
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 text-sm sm:text-base"
                    onClick={() => setShowWithdrawForm(false)}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg text-sm sm:text-base"
                    disabled={withdrawing}
                  >
                    {withdrawing ? 'Processing...' : `Withdraw ₹${availableToWithdraw}`}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SellerProfile; 