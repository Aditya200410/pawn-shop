import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSeller } from '../context/SellerContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Loader from '../components/Loader';
import { 
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
  FiImage,
  FiBell,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle
} from 'react-icons/fi';
import RikoCraftPoster from '../components/RikoCraftPoster';
import html2canvas from 'html2canvas';
import config from '../config/config';
import historyService from '../services/historyService';
import { createRoot } from 'react-dom/client';

const SellerProfile = () => {
  const { seller, loading, error, updateProfile, logout, fetchProfile, loggedIn } = useSeller();
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
    bankName: '',
    upi: ''
  });
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);
  const [bankDetails, setBankDetails] = useState({
    accountName: '',
    accountNumber: '',
    ifsc: '',
    bankName: '',
    upi: ''
  });
  const [withdrawing, setWithdrawing] = useState(false);
  const [availableToWithdraw, setAvailableToWithdraw] = useState(0);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [withdrawalHistory, setWithdrawalHistory] = useState([]);
  const [commissionHistory, setCommissionHistory] = useState([]);
  const [commissionSummary, setCommissionSummary] = useState({});
  const [activeHistoryTab, setActiveHistoryTab] = useState('withdrawals');
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Fetch seller profile on mount if not present
  useEffect(() => {
    if (!seller) {
      const token = localStorage.getItem('seller_jwt');
      if (token) fetchProfile(token);
    }
    // eslint-disable-next-line
  }, []);

  // Load history data when history tab is active
  useEffect(() => {
    if (activeTab === 'history' && seller) {
      loadHistoryData();
    }
  }, [activeTab, seller]);

  // Check for withdrawal status updates
  useEffect(() => {
    if (seller && withdrawalHistory.length > 0) {
      checkWithdrawalStatusUpdates();
    }
  }, [seller, withdrawalHistory]);

  // Periodic check for withdrawal status updates (every 30 seconds)
  useEffect(() => {
    if (seller && withdrawalHistory.length > 0) {
      const interval = setInterval(() => {
        checkWithdrawalStatusUpdates();
      }, 30000); // Check every 30 seconds

      return () => clearInterval(interval);
    }
  }, [seller, withdrawalHistory]);

  const loadHistoryData = async () => {
    setHistoryLoading(true);
    try {
      console.log('Loading history data for seller:', seller?._id);
      
      // Load withdrawal history
      console.log('Loading withdrawal history...');
      const withdrawalData = await historyService.getWithdrawalHistory();
      console.log('Withdrawal data received:', withdrawalData);
      setWithdrawalHistory(withdrawalData.withdrawals || []);

      // Load commission history
      console.log('Loading commission history...');
      const commissionData = await historyService.getCommissionHistory();
      console.log('Commission data received:', commissionData);
      setCommissionHistory(commissionData.commissionHistory || []);

      // Load commission summary
      console.log('Loading commission summary...');
      const summaryData = await historyService.getCommissionSummary();
      console.log('Summary data received:', summaryData);
      setCommissionSummary(summaryData || {});
      
      console.log('All history data loaded successfully');
    } catch (error) {
      console.error('Failed to load history data:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        response: error.response?.data
      });
      toast.error(`Failed to load history data: ${error.message}`);
    } finally {
      setHistoryLoading(false);
    }
  };

  const checkWithdrawalStatusUpdates = async () => {
    try {
      // Fetch latest withdrawal data
      const withdrawalData = await historyService.getWithdrawalHistory();
      const latestWithdrawals = withdrawalData.withdrawals || [];
      
      // Check for status changes and create notifications
      latestWithdrawals.forEach(latestWithdrawal => {
        const oldWithdrawal = withdrawalHistory.find(w => w._id === latestWithdrawal._id);
        
        if (oldWithdrawal && oldWithdrawal.status !== latestWithdrawal.status) {
          let notification = {
            id: Date.now() + Math.random(),
            type: 'withdrawal',
            title: '',
            message: '',
            icon: null,
            color: ''
          };

          switch (latestWithdrawal.status) {
            case 'approved':
              notification = {
                ...notification,
                title: 'Withdrawal Approved!',
                message: `Your withdrawal request of ₹${latestWithdrawal.amount} has been approved and payment is being processed.`,
                icon: FiCheckCircle,
                color: 'green'
              };
              break;
            case 'completed':
              notification = {
                ...notification,
                title: 'Payment Completed!',
                message: `Your withdrawal of ₹${latestWithdrawal.amount} has been successfully transferred to your bank account.`,
                icon: FiCheckCircle,
                color: 'green'
              };
              break;
            case 'rejected':
              notification = {
                ...notification,
                title: 'Withdrawal Rejected',
                message: `Your withdrawal request of ₹${latestWithdrawal.amount} has been rejected. ${latestWithdrawal.rejectionReason ? `Reason: ${latestWithdrawal.rejectionReason}` : ''}`,
                icon: FiXCircle,
                color: 'red'
              };
              break;
            default:
              return;
          }

          // Add notification
          setNotifications(prev => [notification, ...prev.slice(0, 4)]); // Keep only last 5 notifications
          
          // Show toast notification
          if (notification.color === 'green') {
            toast.success(notification.message);
          } else {
            toast.error(notification.message);
          }
        }
      });

      // Update withdrawal history
      setWithdrawalHistory(latestWithdrawals);
      
      // Also refresh seller profile to get updated commission data
      if (seller) {
        const token = localStorage.getItem('seller_jwt');
        if (token) {
          fetchProfile(token);
        }
      }
    } catch (error) {
      console.error('Error checking withdrawal updates:', error);
    }
  };

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
        bankName: seller.bankName || '',
        upi: seller.upi || seller.bankDetails?.upi || ''
      });
      setBankDetails({
        accountName: seller.accountHolderName || seller.bankDetails?.accountName || '',
        accountNumber: seller.bankAccountNumber || seller.bankDetails?.accountNumber || '',
        ifsc: seller.ifscCode || seller.bankDetails?.ifsc || '',
        bankName: seller.bankName || seller.bankDetails?.bankName || '',
        upi: seller.upi || seller.bankDetails?.upi || ''
      });
      setAvailableToWithdraw(Math.round(seller.availableCommission || 0));
    }
  }, [seller]);

  useEffect(() => {
    if (!loading && !seller && loggedIn) {
      navigate('/seller');
    }
  }, [loading, seller, loggedIn, navigate]);

  // Auto-remove notifications after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setNotifications(prev => prev.filter(n => Date.now() - n.id < 10000));
    }, 10000);

    return () => clearTimeout(timer);
  }, [notifications]);

  // Close notifications dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showNotifications && !event.target.closest('.notification-dropdown')) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-xl border border-red-200 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button onClick={() => window.location.reload()} className="px-6 py-3 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl">Reload</button>
        </div>
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
    verified: typeof seller.verified === 'boolean' ? seller.verified : false,
    blocked: typeof seller.blocked === 'boolean' ? seller.blocked : false,
    upi: seller.upi || seller.bankDetails?.upi || ''
  };

  if (safeSeller.blocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 via-white to-red-100">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-white p-8 rounded-2xl shadow-xl border-2 border-red-300"
        >
          <h2 className="text-2xl font-bold mb-4 text-red-600">Account Blocked</h2>
          <p className="text-gray-700 mb-6">Your account has been blocked by the admin.</p>
          <button 
            onClick={() => logout()} 
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-500 text-white rounded-xl hover:from-red-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Logout
          </button>
        </motion.div>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({ ...formData });
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
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      document.body.appendChild(tempDiv);
      import('../components/RikoCraftPoster.jsx').then(({ default: RikoCraftPoster }) => {
        const root = createRoot(tempDiv);
        root.render(<RikoCraftPoster qrSrc={seller.qrCode} />);
        setTimeout(async () => {
          const canvas = await html2canvas(tempDiv, { backgroundColor: null, useCORS: true });
          const url = canvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.href = url;
          link.download = `${seller.businessName}-poster.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          root.unmount();
          document.body.removeChild(tempDiv);
          toast.success('Poster downloaded successfully!');
        }, 200);
      });
    } catch (error) {
      console.error('Error downloading poster:', error);
      toast.error('Failed to download poster');
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    setWithdrawing(true);
    try {
      const res = await fetch(`${config.API_BASE_URL}/api/withdrawal/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('seller_jwt')}` },
        body: JSON.stringify({
          amount: availableToWithdraw,
          sellerNotes: `Withdrawal request for ₹${availableToWithdraw}`
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('Withdrawal request submitted!');
        setShowWithdrawForm(false);
        // Refetch seller profile to update withdrawals
        if (typeof fetchProfile === 'function') {
          const token = localStorage.getItem('seller_jwt');
          if (token) {
            await fetchProfile(token);
            // Also refresh withdrawal history
            await loadHistoryData();
          }
        }
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
    { id: 'earnings', label: 'Earnings', icon: FiTrendingUp },
    { id: 'tools', label: 'Tools', icon: FiSettings },
    { id: 'history', label: 'History', icon: FiBarChart },
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
      bgColor: 'bg-pink-50'
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
      bgColor: 'bg-pink-50'
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
      bgColor: 'bg-pink-50'
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
          <RikoCraftPoster qrSrc={safeSeller.qrCode} />
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
                <div className="flex items-center gap-3">
                  {/* Notification Bell */}
                  <div className="relative notification-dropdown">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowNotifications(!showNotifications)}
                      className="flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-white bg-opacity-20 backdrop-blur-sm text-white rounded-xl hover:bg-white hover:text-pink-600 transition-all duration-300 border border-white border-opacity-30 text-sm sm:text-base"
                    >
                      <FiBell className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Notifications
                      {notifications.length > 0 && (
                        <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                          {notifications.length}
                        </span>
                      )}
                    </motion.button>
                    
                    {/* Notifications Dropdown */}
                    <AnimatePresence>
                      {showNotifications && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto
                            sm:w-80 sm:bottom-auto sm:right-0
                            w-screen left-1/2 -translate-x-1/2 bottom-0 sm:translate-x-0 sm:left-auto
                            sm:rounded-xl rounded-t-2xl sm:rounded-b-xl rounded-b-none
                            sm:p-0 p-2"
                          style={{
                            maxHeight: '80vh',
                          }}
                        >
                          <div className="p-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                          </div>
                          <div className="p-2">
                            {notifications.length === 0 ? (
                              <div className="text-center py-8">
                                <FiBell className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-500 text-sm">No new notifications</p>
                              </div>
                            ) : (
                              notifications.map((notification) => {
                                const IconComponent = notification.icon;
                                return (
                                  <motion.div
                                    key={notification.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`p-3 rounded-lg mb-2 border-l-4 ${
                                      notification.color === 'green' 
                                        ? 'bg-green-50 border-green-500' 
                                        : notification.color === 'red'
                                        ? 'bg-red-50 border-red-500'
                                        : 'bg-blue-50 border-blue-500'
                                    }`}
                                  >
                                    <div className="flex items-start gap-3">
                                      <IconComponent className={`w-5 h-5 mt-0.5 ${
                                        notification.color === 'green' ? 'text-green-600' : 'text-red-600'
                                      }`} />
                                      <div className="flex-1">
                                        <h4 className="text-sm font-semibold text-gray-900 mb-1">
                                          {notification.title}
                                        </h4>
                                        <p className="text-xs text-gray-600">
                                          {notification.message}
                                        </p>
                                      </div>
                                    </div>
                                  </motion.div>
                                );
                              })
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
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
                      className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 sm:p-6 rounded-2xl border border-pink-200"
                    >
                      <div className="flex items-center mb-4">
                        <div className="p-2 sm:p-3 bg-pink-500 rounded-xl mr-3 sm:mr-4">
                          <FiTag className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Seller Token</h3>
                          <p className="text-xs sm:text-sm text-gray-600">Your unique identifier</p>
                        </div>
                      </div>
                      <p className="text-lg sm:text-2xl font-bold text-pink-600 font-mono break-all">{safeSeller.sellerToken}</p>
                    </motion.div>

                    <motion.div
                      whileHover={{ y: -5 }}
                      className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 sm:p-6 rounded-2xl border border-pink-200"
                    >
                      <div className="flex items-center mb-4">
                        <div className="p-2 sm:p-3 bg-pink-500 rounded-xl mr-3 sm:mr-4">
                          <FiLink className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Shop Link</h3>
                          <p className="text-xs sm:text-sm text-gray-600">Share with customers</p>
                        </div>
                      </div>
                      <a 
                        href={safeSeller.websiteLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-600 hover:text-pink-700 font-medium break-all text-sm sm:text-base"
                      >
                        View Shop →
                      </a>
                    </motion.div>

                    <motion.div
                      whileHover={{ y: -5 }}
                      className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 sm:p-6 rounded-2xl border border-pink-200"
                    >
                      <div className="flex items-center mb-4">
                        <div className="p-2 sm:p-3 bg-pink-500 rounded-xl mr-3 sm:mr-4">
                          <FiSmartphone className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-gray-900 text-sm sm:text-base">QR Code</h3>
                          <p className="text-xs sm:text-sm text-gray-600">Download & share</p>
                        </div>
                      </div>
                      <button
                        onClick={downloadQRCode}
                        className="flex items-center text-pink-600 hover:text-pink-700 font-medium text-sm sm:text-base"
                      >
                        <FiDownload className="w-4 h-4 sm:w-4 sm:h-4 mr-2" />
                        Download Poster
                      </button>
                    </motion.div>
                  </div>

                  {/* QR Code Display */}
                  {safeSeller.qrCode && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 sm:p-8 rounded-2xl border border-pink-200 text-center"
                    >
                      <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-gray-900">Your Shop QR Code</h3>
                      <div className="flex justify-center">
                        <div className="bg-white p-3 sm:p-4 rounded-2xl shadow-lg">
                          <img 
                            src={safeSeller.qrCode} 
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

                
                  {/* Business Images Gallery */}
                  {safeSeller.images && safeSeller.images.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 sm:p-6 rounded-2xl border border-pink-200"
                    >
                      <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900 flex items-center">
                        <FiImage className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 mr-2" />
                        Business Images ({safeSeller.images.length})
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                        {safeSeller.images.map((image, index) => (
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
                      className="bg-pink-50 p-4 sm:p-8 rounded-2xl space-y-4 sm:space-y-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Business Name</label>
                          <input
                            type="text"
                            name="businessName"
                            value={formData.businessName}
                            onChange={handleChange}
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Business Type</label>
                          <input
                            type="text"
                            name="businessType"
                            value={formData.businessType}
                            onChange={handleChange}
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Account Holder Name</label>
                          <input
                            type="text"
                            name="accountHolderName"
                            value={formData.accountHolderName}
                            onChange={handleChange}
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Bank Account Number</label>
                          <input
                            type="text"
                            name="bankAccountNumber"
                            value={formData.bankAccountNumber}
                            onChange={handleChange}
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">IFSC Code</label>
                          <input
                            type="text"
                            name="ifscCode"
                            value={formData.ifscCode}
                            onChange={handleChange}
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Bank Name</label>
                          <input
                            type="text"
                            name="bankName"
                            value={formData.bankName}
                            onChange={handleChange}
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">UPI</label>
                          <input
                            type="text"
                            name="upi"
                            value={formData.upi}
                            onChange={handleChange}
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
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
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                        />
                      </div>
                      <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 border border-pink-200 rounded-xl text-pink-700 hover:bg-pink-50 transition-all duration-300 text-sm sm:text-base"
                        >
                          <FiX className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                          Cancel
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          type="submit"
                          className="flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl hover:from-pink-600 hover:to-pink-700 transition-all duration-300 shadow-lg text-sm sm:text-base"
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
                        className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 sm:p-6 rounded-2xl border border-pink-200"
                      >
                        <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Business Name</h3>
                        <p className="text-base sm:text-lg text-pink-600 break-words">{safeSeller.businessName}</p>
                      </motion.div>
                      <motion.div
                        whileHover={{ y: -2 }}
                        className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 sm:p-6 rounded-2xl border border-pink-200"
                      >
                        <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Email</h3>
                        <p className="text-base sm:text-lg text-pink-600 break-words">{safeSeller.email}</p>
                      </motion.div>
                      <motion.div
                        whileHover={{ y: -2 }}
                        className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 sm:p-6 rounded-2xl border border-pink-200"
                      >
                        <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Phone</h3>
                        <p className="text-base sm:text-lg text-pink-600">{safeSeller.phone}</p>
                      </motion.div>
                      <motion.div
                        whileHover={{ y: -2 }}
                        className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 sm:p-6 rounded-2xl border border-pink-200"
                      >
                        <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Business Type</h3>
                        <p className="text-base sm:text-lg text-pink-600 break-words">{safeSeller.businessType}</p>
                      </motion.div>
                      <motion.div
                        whileHover={{ y: -2 }}
                        className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 sm:p-6 rounded-2xl border border-pink-200"
                      >
                        <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Address</h3>
                        <p className="text-base sm:text-lg text-pink-600 break-words">{safeSeller.address}</p>
                      </motion.div>
                      <motion.div
                        whileHover={{ y: -2 }}
                        className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 sm:p-6 rounded-2xl border border-pink-200"
                      >
                        <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Account Holder</h3>
                        <p className="text-base sm:text-lg text-pink-600 break-words">{safeSeller.accountHolderName}</p>
                      </motion.div>
                      <motion.div
                        whileHover={{ y: -2 }}
                        className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 sm:p-6 rounded-2xl border border-pink-200"
                      >
                        <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Bank Account</h3>
                        <p className="text-base sm:text-lg text-pink-600 break-words">{safeSeller.bankAccountNumber}</p>
                      </motion.div>
                      <motion.div
                        whileHover={{ y: -2 }}
                        className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 sm:p-6 rounded-2xl border border-pink-200"
                      >
                        <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">IFSC Code</h3>
                        <p className="text-base sm:text-lg text-pink-600 break-words">{safeSeller.ifscCode}</p>
                      </motion.div>
                      <motion.div
                        whileHover={{ y: -2 }}
                        className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 sm:p-6 rounded-2xl border border-pink-200"
                      >
                        <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Bank Name</h3>
                        <p className="text-base sm:text-lg text-pink-600 break-words">{safeSeller.bankName}</p>
                      </motion.div>
                      <motion.div
                        whileHover={{ y: -2 }}
                        className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 sm:p-6 rounded-2xl border border-pink-200"
                      >
                        <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">UPI</h3>
                        <p className="text-base sm:text-lg text-pink-600 break-words">{safeSeller.upi}</p>
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
                      className="flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl hover:from-pink-600 hover:to-pink-700 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                    >
                      <FiCreditCard className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Withdraw Earnings
                    </motion.button>
                  </div>

                  {/* Earnings Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                    <motion.div
                      whileHover={{ y: -5 }}
                      className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 sm:p-6 rounded-2xl border border-pink-200"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Total Commission</h3>
                        <div className="p-2 sm:p-3 bg-pink-500 rounded-xl">
                        <FiTrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                      </div>
                      <p className="text-2xl sm:text-3xl font-bold text-pink-600">₹{Math.round(safeSeller.totalCommission)}</p>
                      <p className="text-xs sm:text-sm text-gray-600 mt-2">30% commission from orders</p>
                    </motion.div>

                    <motion.div
                      whileHover={{ y: -5 }}
                      className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 sm:p-6 rounded-2xl border border-pink-200"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Available to Withdraw</h3>
                        <div className="p-2 sm:p-3 bg-pink-500 rounded-xl">
                          <FiTrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                      </div>
                      <p className="text-2xl sm:text-3xl font-bold text-pink-600">₹{availableToWithdraw}</p>
                      <p className="text-xs sm:text-sm text-gray-600 mt-2">Ready for withdrawal</p>
                    </motion.div>

                    <motion.div
                      whileHover={{ y: -5 }}
                      className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 sm:p-6 rounded-2xl border border-pink-200"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Total Orders</h3>
                        <div className="p-2 sm:p-3 bg-pink-500 rounded-xl">
                          <FiShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                      </div>
                      <p className="text-2xl sm:text-3xl font-bold text-pink-600">{safeSeller.totalOrders}</p>
                      <p className="text-xs sm:text-sm text-gray-600 mt-2">Orders through your link</p>
                    </motion.div>
                  </div>

                  {/* Bank Details */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 sm:p-6 rounded-2xl border border-pink-200"
                  >
                    <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900 flex items-center">
                      <FiCreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 mr-2" />
                      Bank Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <p className="text-xs sm:text-sm text-gray-600">Account Holder</p>
                        <p className="font-semibold text-gray-900 text-sm sm:text-base">{safeSeller.accountHolderName}</p>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-gray-600">Account Number</p>
                        <p className="font-semibold text-gray-900 text-sm sm:text-base">{safeSeller.bankAccountNumber}</p>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-gray-600">IFSC Code</p>
                        <p className="font-semibold text-gray-900 text-sm sm:text-base">{safeSeller.ifscCode}</p>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-gray-600">Bank Name</p>
                        <p className="font-semibold text-gray-900 text-sm sm:text-base">{safeSeller.bankName}</p>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-gray-600">UPI</p>
                        <p className="font-semibold text-gray-900 text-sm sm:text-base">{safeSeller.upi}</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Withdrawal History */}
                  {Array.isArray(safeSeller.withdrawals) && safeSeller.withdrawals.length > 0 && (
                    <div className="bg-white rounded-xl shadow border border-pink-100 p-4 sm:p-6 mt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Withdrawal History</h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-pink-100">
                          <thead>
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Requested At</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-pink-50">
                            {safeSeller.withdrawals.slice().reverse().map((w, idx) => (
                              <tr key={idx}>
                                <td className="px-4 py-2 text-pink-700 font-semibold">₹{w.amount}</td>
                                <td className="px-4 py-2">
                                  <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${w.status === 'completed' ? 'bg-green-100 text-green-700' : w.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{w.status}</span>
                                </td>
                                <td className="px-4 py-2 text-gray-600">{w.requestedAt ? new Date(w.requestedAt).toLocaleString() : ''}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
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
                      className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 sm:p-6 rounded-2xl border border-pink-200"
                    >
                      <div className="flex items-center mb-4">
                        <div className="p-2 sm:p-3 bg-pink-500 rounded-xl mr-3 sm:mr-4">
                          <FiDownload className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Download QR Code</h3>
                          <p className="text-xs sm:text-sm text-gray-600">Share with customers</p>
                        </div>
                      </div>
                      <button
                        onClick={downloadQRCode}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-all duration-300 text-sm sm:text-base"
                      >
                        Download Poster
                      </button>
                    </motion.div>

                    <motion.div
                      whileHover={{ y: -5 }}
                      className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 sm:p-6 rounded-2xl border border-pink-200"
                    >
                      <div className="flex items-center mb-4">
                        <div className="p-2 sm:p-3 bg-pink-500 rounded-xl mr-3 sm:mr-4">
                          <FiLink className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Shop Link</h3>
                          <p className="text-xs sm:text-sm text-gray-600">Copy and share</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(safeSeller.websiteLink);
                          toast.success('Link copied to clipboard!');
                        }}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-all duration-300 text-sm sm:text-base"
                      >
                        Copy Link
                      </button>
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'history' && (
                <motion.div
                  key="history"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6 sm:space-y-8"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Transaction History</h2>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setActiveHistoryTab('withdrawals')}
                        className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 text-sm ${
                          activeHistoryTab === 'withdrawals'
                            ? 'bg-pink-500 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        Withdrawals
                      </button>
                      <button
                        onClick={() => setActiveHistoryTab('commission')}
                        className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 text-sm ${
                          activeHistoryTab === 'commission'
                            ? 'bg-pink-500 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        Commission
                      </button>
                    </div>
                  </div>

                  {historyLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader />
                    </div>
                  ) : (
                    <AnimatePresence mode="wait">
                      {activeHistoryTab === 'withdrawals' && (
                        <motion.div
                          key="withdrawals"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="space-y-6"
                        >
                          {withdrawalHistory.length === 0 ? (
                            <div className="text-center py-12">
                              <FiBarChart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Withdrawal History</h3>
                              <p className="text-gray-500">You haven't made any withdrawal requests yet.</p>
                            </div>
                          ) : (
                            <div className="bg-white rounded-xl shadow border border-pink-100 overflow-hidden">
                              <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-pink-100">
                                  <thead className="bg-pink-50">
                                    <tr>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request Date</th>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Processed Date</th>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white divide-y divide-pink-50">
                                    {withdrawalHistory.map((withdrawal) => (
                                      <tr key={withdrawal._id} className="hover:bg-pink-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                          <div className="text-sm font-semibold text-gray-900">
                                            {historyService.formatAmount(withdrawal.amount)}
                                          </div>
                                          {withdrawal.processingFee > 0 && (
                                            <div className="text-xs text-gray-500">
                                              Fee: {historyService.formatAmount(withdrawal.processingFee)}
                                            </div>
                                          )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${historyService.getStatusColor(withdrawal.status)}`}>
                                            {withdrawal.status}
                                          </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                          {historyService.formatDate(withdrawal.requestDate)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                          {withdrawal.processedDate ? historyService.formatDate(withdrawal.processedDate) : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium">
                                          {withdrawal.status === 'pending' && (
                                            <button
                                              onClick={async () => {
                                                try {
                                                  await historyService.cancelWithdrawal(withdrawal._id);
                                                  toast.success('Withdrawal cancelled successfully');
                                                  loadHistoryData();
                                                } catch (error) {
                                                  toast.error(error.message);
                                                }
                                              }}
                                              className="text-red-600 hover:text-red-900"
                                            >
                                              Cancel
                                            </button>
                                          )}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}

                      {activeHistoryTab === 'commission' && (
                        <motion.div
                          key="commission"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="space-y-6"
                        >
                         

                          {commissionHistory.length === 0 ? (
                            <div className="text-center py-12">
                              <FiBarChart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Commission History</h3>
                              <p className="text-gray-500">You haven't earned any commissions yet.</p>
                            </div>
                          ) : (
                            <div className="bg-white rounded-xl shadow border border-pink-100 overflow-hidden">
                              <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-pink-100">
                                  <thead className="bg-pink-50">
                                    <tr>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white divide-y divide-pink-50">
                                    {commissionHistory.map((commission) => (
                                      <tr key={commission._id} className="hover:bg-pink-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${historyService.getTypeColor(commission.type)}`}>
                                            {commission.type}
                                          </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                          <div className="text-sm font-semibold text-gray-900">
                                            {historyService.formatAmount(commission.amount)}
                                          </div>
                                          {commission.orderAmount > 0 && (
                                            <div className="text-xs text-gray-500">
                                              Order: {historyService.formatAmount(commission.orderAmount)}
                                            </div>
                                          )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${historyService.getStatusColor(commission.status)}`}>
                                            {commission.status}
                                          </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                          {historyService.formatDate(commission.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                          <div className="max-w-xs truncate" title={commission.description}>
                                            {commission.description}
                                          </div>
                                          {commission.orderDetails?.orderNumber && (
                                            <div className="text-xs text-gray-500">
                                              Order: #{commission.orderDetails.orderNumber}
                                            </div>
                                          )}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
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
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm sm:text-base"
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
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm sm:text-base"
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
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm sm:text-base"
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
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm sm:text-base"
                    value={bankDetails.bankName}
                    onChange={e => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">UPI</label>
                  <input
                    type="text"
                    placeholder="Enter UPI ID"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm sm:text-base"
                    value={bankDetails.upi}
                    onChange={e => setBankDetails({ ...bankDetails, upi: e.target.value })}
                  />
                </div>
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-pink-200 text-pink-700 rounded-xl hover:bg-pink-50 transition-all duration-300 text-sm sm:text-base"
                    onClick={() => setShowWithdrawForm(false)}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl hover:from-pink-600 hover:to-pink-700 transition-all duration-300 shadow-lg text-sm sm:text-base"
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