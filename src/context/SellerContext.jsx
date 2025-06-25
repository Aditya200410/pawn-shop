import React, { createContext, useContext, useState, useEffect } from 'react';
import config from '../config/config';
import { toast } from 'react-hot-toast';

const SellerContext = createContext();

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

      if (!response.ok) {
        throw new Error('Failed to fetch seller profile');
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch seller profile');
      }
      setSeller(data.seller);
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

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('seller_token', data.token);
      setSeller(data.seller);
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

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Registration failed');
      }

      localStorage.setItem('seller_token', data.token);
      setSeller(data.seller);
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

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to update profile');
      }

      setSeller(data.seller);
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