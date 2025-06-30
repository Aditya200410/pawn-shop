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
    const token = localStorage.getItem('seller_token');
    if (token) {
      fetchSellerProfile(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchSellerProfile = async (token) => {
    try {
      const response = await fetch(`${config.API_URLS.SELLER}/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      console.log('Profile data:', data); // Debug log

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to fetch seller profile');
      }

      // Ensure all required fields are present
      const sellerData = {
        id: data.seller.id,
        businessName: data.seller.businessName,
        email: data.seller.email,
        phone: data.seller.phone || '',
        address: data.seller.address || '',
        status: data.seller.status,
        createdAt: data.seller.createdAt,
        couponToken: data.seller.couponToken,
        websiteLink: data.seller.websiteLink,
        qrCode: data.seller.qrCode
      };

      setSeller(sellerData);
    } catch (err) {
      setError(err.message);
      localStorage.removeItem('seller_token');
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

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Login failed');
      }

      // Ensure all required fields are present
      const sellerData = {
        id: data.seller.id,
        businessName: data.seller.businessName,
        email: data.seller.email,
        phone: data.seller.phone || '',
        address: data.seller.address || '',
        status: data.seller.status,
        createdAt: data.seller.createdAt,
        couponToken: data.seller.couponToken,
        websiteLink: data.seller.websiteLink,
        qrCode: data.seller.qrCode
      };

      localStorage.setItem('seller_token', data.token);
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
      const response = await fetch(`${config.API_URLS.SELLER}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sellerData)
      });

      const data = await response.json();
      console.log('Register data:', data); // Debug log

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Registration failed');
      }

      // Ensure all required fields are present
      const newSellerData = {
        id: data.seller.id,
        businessName: data.seller.businessName,
        email: data.seller.email,
        phone: data.seller.phone || '',
        address: data.seller.address || '',
        status: data.seller.status,
        createdAt: data.seller.createdAt,
        couponToken: data.seller.couponToken,
        websiteLink: data.seller.websiteLink,
        qrCode: data.seller.qrCode
      };

      localStorage.setItem('seller_token', data.token);
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
    localStorage.removeItem('seller_token');
    setSeller(null);
    toast.success('Logged out successfully');
  };

  const updateProfile = async (updates) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('seller_token');
      const response = await fetch(`${config.API_URLS.SELLER}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
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
        id: data.seller.id,
        businessName: data.seller.businessName,
        email: data.seller.email,
        phone: data.seller.phone || '',
        address: data.seller.address || '',
        status: data.seller.status,
        createdAt: data.seller.createdAt,
        couponToken: data.seller.couponToken,
        websiteLink: data.seller.websiteLink,
        qrCode: data.seller.qrCode
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