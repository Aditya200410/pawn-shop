import React, { createContext, useContext, useState, useEffect } from 'react';
import config from '../config/config';

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
      const response = await fetch(`${config.API_URLS.BASE}/seller/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch seller profile');
      }

      const data = await response.json();
      setSeller(data.seller);
    } catch (err) {
      setError(err.message);
      localStorage.removeItem('seller_token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch(`${config.API_URLS.BASE}/seller/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('seller_token', data.token);
      setSeller(data.seller);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const register = async (sellerData) => {
    try {
      const response = await fetch(`${config.API_URLS.BASE}/seller/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sellerData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      localStorage.setItem('seller_token', data.token);
      setSeller(data.seller);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('seller_token');
    setSeller(null);
  };

  const updateProfile = async (updates) => {
    try {
      const token = localStorage.getItem('seller_token');
      const response = await fetch(`${config.API_URLS.BASE}/seller/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      setSeller(data.seller);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
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