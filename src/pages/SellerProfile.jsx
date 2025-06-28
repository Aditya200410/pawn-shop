import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSeller } from '../context/SellerContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Loader from '../components/Loader';
import { FiDollarSign, FiShoppingCart, FiLink, FiTag, FiDownload, FiSmartphone } from 'react-icons/fi';

const SellerProfile = () => {
  const { seller, loading, error, updateProfile, logout } = useSeller();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    businessName: seller?.businessName || '',
    phone: seller?.phone || '',
    address: seller?.address || ''
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader />
      </div>
    );
  }

  if (!seller) {
    navigate('/seller/auth');
    return null;
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
      await updateProfile(formData);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/seller/auth');
  };

  const downloadQRCode = () => {
    if (!seller.qrCode) {
      toast.error('QR code not available');
      return;
    }

    try {
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = seller.qrCode;
      link.download = `${seller.businessName}-shop-qr-code.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('QR code downloaded successfully!');
    } catch (error) {
      console.error('Error downloading QR code:', error);
      toast.error('Failed to download QR code');
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-amber-600 px-6 py-8 text-white">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">Seller Dashboard</h1>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-white text-amber-600 rounded-lg hover:bg-amber-50 transition-colors"
              >
                Logout
              </button>
            </div>
            <p className="mt-2 text-amber-100">Welcome back, {seller.businessName}!</p>
          </div>

          {/* Profile Content */}
          <div className="p-6">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Business Information</h2>
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Business Name</label>
                    <input
                      type="text"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows="3"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Business Name</p>
                      <p className="text-lg font-medium text-gray-900">{seller.businessName}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-lg font-medium text-gray-900">{seller.email}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="text-lg font-medium text-gray-900">{seller.phone}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Seller Token</p>
                      <div className="flex items-center">
                        <FiTag className="w-5 h-5 text-amber-600 mr-2" />
                        <span className="text-lg font-medium text-amber-600">{seller.sellerToken}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Your unique identifier for tracking orders</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Your Shop Link</p>
                      <div className="flex items-center">
                        <FiLink className="w-5 h-5 text-blue-600 mr-2" />
                        <a 
                          href={seller.websiteLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-lg font-medium text-blue-600 hover:underline break-all"
                        >
                          View Shop
                        </a>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Share this link with your customers</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Total Orders</p>
                      <div className="flex items-center">
                        <FiShoppingCart className="w-5 h-5 text-green-600 mr-2" />
                        <span className="text-lg font-medium text-green-600">{seller.totalOrders || 0}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Orders through your link</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Total Commission</p>
                      <div className="flex items-center">
                        <FiDollarSign className="w-5 h-5 text-green-600 mr-2" />
                        <span className="text-lg font-medium text-green-600">₹{Math.round(seller.totalCommission || 0)}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">10% commission from orders</p>
                    </div>
                  </div>
                  
                  {/* QR Code Section */}
                  {seller.qrCode && (
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <FiSmartphone className="w-6 h-6 text-amber-600 mr-2" />
                          <h3 className="text-lg font-medium text-gray-900">Shop QR Code</h3>
                        </div>
                        <button
                          onClick={downloadQRCode}
                          className="flex items-center px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
                        >
                          <FiDownload className="w-4 h-4 mr-2" />
                          Download QR Code
                        </button>
                      </div>
                      <div className="flex flex-col items-center">
                        <img 
                          src={seller.qrCode} 
                          alt="Shop QR Code" 
                          className="w-48 h-48 border-4 border-white shadow-lg rounded-lg"
                        />
                        <p className="text-sm text-gray-500 mt-3 text-center">
                          Scan this QR code to visit your shop<br />
                          Customers can scan this to access your products
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="text-lg font-medium text-gray-900">{seller.address}</p>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
                    >
                      Edit Profile
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SellerProfile; 