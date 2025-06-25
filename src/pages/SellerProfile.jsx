import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSeller } from '../context/SellerContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Loader from '../components/Loader';

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
                      <p className="text-sm text-gray-500">Coupon Code</p>
                      <p className="text-lg font-medium text-amber-600">{seller.couponToken}</p>
                      <p className="text-xs text-gray-500 mt-1">Share this code with your customers for discounts</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Your Shop Link</p>
                      <a 
                        href={seller.websiteLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg font-medium text-blue-600 hover:underline break-all"
                      >
                        {seller.websiteLink}
                      </a>
                      <p className="text-xs text-gray-500 mt-1">Share this link with your customers</p>
                    </div>
                    {seller.qrCode && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500 mb-2">Shop QR Code</p>
                        <div className="flex flex-col items-center">
                          <img src={seller.qrCode} alt="Shop QR Code" className="w-40 h-40" />
                          <p className="text-xs text-gray-500 mt-2">Scan to visit your shop</p>
                          <a
                            href={seller.qrCode}
                            download="shop-qr-code.png"
                            className="mt-2 text-sm text-blue-600 hover:underline"
                          >
                            Download QR Code
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
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