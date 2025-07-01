import React, { createContext, useContext, useState, useEffect } from 'react';
import config from '../config/config';
import { toast } from 'react-hot-toast';

export const SellerContext = createContext();

export const useSeller = () => {
  const context = useContext(SellerContext);
  if (!context) {
    throw new Error('useSeller must be used within a SellerProvider');
  }
  return context;
};

export const SellerProvider = ({ children }) => {
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const sellerEmail = localStorage.getItem('seller_email');
    if (sellerEmail) {
      fetchSellerProfile(sellerEmail);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchSellerProfile = async (email) => {
    try {
      setLoading(true);
      const response = await fetch(`${config.API_URLS.SELLER}/profile?email=${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      console.log('Profile data:', data); // Debug log

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to fetch seller profile');
      }

      // Ensure all required fields are present
      const sellerData = {
        id: data.seller.id || data.seller._id || '',
        businessName: data.seller.businessName || '',
        email: data.seller.email || '',
        phone: data.seller.phone || '',
        address: data.seller.address || '',
        businessType: data.seller.businessType || '',
        accountHolderName: data.seller.accountHolderName || '',
        bankAccountNumber: data.seller.bankAccountNumber || '',
        ifscCode: data.seller.ifscCode || '',
        bankName: data.seller.bankName || '',
        sellerToken: data.seller.sellerToken || '',
        websiteLink: data.seller.websiteLink || '',
        qrCode: data.seller.qrCode || '',
        images: data.seller.images || [],
        profileImage: data.seller.profileImage || null,
        totalOrders: data.seller.totalOrders || 0,
        totalCommission: data.seller.totalCommission || 0,
        availableCommission: data.seller.availableCommission || 0,
        bankDetails: data.seller.bankDetails || {},
        withdrawals: data.seller.withdrawals || [],
        createdAt: data.seller.createdAt || new Date().toISOString()
      };

      setSeller(sellerData);
    } catch (err) {
      setError(err.message);
      localStorage.removeItem('seller_email');
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await fetch(`${config.API_URLS.SELLER}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      console.log('Login data:', data); // Debug log

      if (!response.ok) {
        if (response.status === 500) {
          throw new Error('Server error. Please try again later.');
        }
        throw new Error(data.message || 'Login failed');
      }

      if (!data.success) {
        throw new Error(data.message || 'Login failed');
      }

      // Ensure all required fields are present with fallbacks
      const sellerData = {
        id: data.seller.id || data.seller._id || '',
        businessName: data.seller.businessName || '',
        email: data.seller.email || '',
        phone: data.seller.phone || '',
        address: data.seller.address || '',
        businessType: data.seller.businessType || '',
        accountHolderName: data.seller.accountHolderName || '',
        bankAccountNumber: data.seller.bankAccountNumber || '',
        ifscCode: data.seller.ifscCode || '',
        bankName: data.seller.bankName || '',
        sellerToken: data.seller.sellerToken || '',
        websiteLink: data.seller.websiteLink || '',
        qrCode: data.seller.qrCode || '',
        images: data.seller.images || [],
        profileImage: data.seller.profileImage || null,
        totalOrders: data.seller.totalOrders || 0,
        totalCommission: data.seller.totalCommission || 0,
        availableCommission: data.seller.availableCommission || 0,
        bankDetails: data.seller.bankDetails || {},
        withdrawals: data.seller.withdrawals || [],
        createdAt: data.seller.createdAt || new Date().toISOString()
      };

      localStorage.setItem('seller_email', email);
      setSeller(sellerData);
      toast.success('Login successful!');
      return data;
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (sellerData) => {
    try {
      setLoading(true);
      
      // Check if sellerData is FormData (for image uploads) or regular object
      const isFormData = sellerData instanceof FormData;
      
      const response = await fetch(`${config.API_URLS.SELLER}/register`, {
        method: 'POST',
        headers: isFormData ? {} : {
          'Content-Type': 'application/json'
        },
        body: isFormData ? sellerData : JSON.stringify(sellerData)
      });

      const data = await response.json();
      console.log('Register data:', data); // Debug log

      if (!response.ok) {
        if (response.status === 500) {
          throw new Error('Server error. Please try again later.');
        }
        throw new Error(data.message || 'Registration failed');
      }

      if (!data.success) {
        let msg = data.message || 'Registration failed';
        if (msg.toLowerCase().includes('email already registered')) {
          msg = 'This email is already registered. Please sign in or use a different email.';
        }
        throw new Error(msg);
      }

      // Ensure all required fields are present with fallbacks
      const newSellerData = {
        id: data.seller.id || data.seller._id || '',
        businessName: data.seller.businessName || '',
        email: data.seller.email || '',
        phone: data.seller.phone || '',
        address: data.seller.address || '',
        businessType: data.seller.businessType || '',
        accountHolderName: data.seller.accountHolderName || '',
        bankAccountNumber: data.seller.bankAccountNumber || '',
        ifscCode: data.seller.ifscCode || '',
        bankName: data.seller.bankName || '',
        sellerToken: data.seller.sellerToken || '',
        websiteLink: data.seller.websiteLink || '',
        qrCode: data.seller.qrCode || '',
        images: data.seller.images || [],
        profileImage: data.seller.profileImage || null,
        totalOrders: data.seller.totalOrders || 0,
        totalCommission: data.seller.totalCommission || 0,
        availableCommission: data.seller.availableCommission || 0,
        bankDetails: data.seller.bankDetails || {},
        withdrawals: data.seller.withdrawals || [],
        createdAt: data.seller.createdAt || new Date().toISOString()
      };

      localStorage.setItem('seller_email', data.seller.email);
      setSeller(newSellerData);
      toast.success('Registration successful!');
      return data;
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('seller_email');
    setSeller(null);
    toast.success('Logged out successfully');
    window.location.href = '/'; // Redirect to home page
  };

  const updateProfile = async (updates) => {
    try {
      setLoading(true);
      const email = localStorage.getItem('seller_email');
      const response = await fetch(`${config.API_URLS.SELLER}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });

      const data = await response.json();
      console.log('Update profile data:', data); // Debug log

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to update profile');
      }

      // Ensure all required fields are present
      const updatedSellerData = {
        id: data.seller.id || data.seller._id || '',
        businessName: data.seller.businessName || '',
        email: data.seller.email || '',
        phone: data.seller.phone || '',
        address: data.seller.address || '',
        businessType: data.seller.businessType || '',
        accountHolderName: data.seller.accountHolderName || '',
        bankAccountNumber: data.seller.bankAccountNumber || '',
        ifscCode: data.seller.ifscCode || '',
        bankName: data.seller.bankName || '',
        sellerToken: data.seller.sellerToken || '',
        websiteLink: data.seller.websiteLink || '',
        qrCode: data.seller.qrCode || '',
        images: data.seller.images || [],
        profileImage: data.seller.profileImage || null,
        totalOrders: data.seller.totalOrders || 0,
        totalCommission: data.seller.totalCommission || 0,
        availableCommission: data.seller.availableCommission || 0,
        bankDetails: data.seller.bankDetails || {},
        withdrawals: data.seller.withdrawals || [],
        createdAt: data.seller.createdAt || new Date().toISOString()
      };

      setSeller(updatedSellerData);
      toast.success('Profile updated successfully');
      return data;
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    seller,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile
  };

  return (
    <SellerContext.Provider value={value}>
      {children}
    </SellerContext.Provider>
  );
}; 