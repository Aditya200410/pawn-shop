import React, { createContext, useContext, useState, useEffect } from 'react';

const SellerContext = createContext();

export const useSeller = () => useContext(SellerContext);

export const SellerProvider = ({ children }) => {
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load seller from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('seller_token');
    if (token) {
      fetchProfile(token);
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/seller/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success && data.token) {
        localStorage.setItem('seller_token', data.token);
        setSeller(data.seller);
        setError(null);
      } else {
        setError(data.message || 'Login failed');
      }
      setLoading(false);
      return data;
    } catch (err) {
      setError('Login failed');
      setLoading(false);
      return { success: false };
    }
  };

  const register = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/seller/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success && data.token) {
        localStorage.setItem('seller_token', data.token);
        setSeller(data.seller);
        setError(null);
      } else {
        setError(data.message || 'Registration failed');
      }
      setLoading(false);
      return data;
    } catch (err) {
      setError('Registration failed');
      setLoading(false);
      return { success: false };
    }
  };

  const fetchProfile = async (token) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/seller/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setSeller(data.seller);
      } else {
        setError(data.message || 'Failed to fetch profile');
      }
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch profile');
      setLoading(false);
    }
  };

  const updateProfile = async (updateFields) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('seller_token');
      const res = await fetch('/api/seller/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updateFields)
      });
      const data = await res.json();
      if (data.success) {
        setSeller(data.seller);
        setError(null);
      } else {
        setError(data.message || 'Failed to update profile');
      }
      setLoading(false);
      return data;
    } catch (err) {
      setError('Failed to update profile');
      setLoading(false);
      return { success: false };
    }
  };

  const logout = () => {
    localStorage.removeItem('seller_token');
    setSeller(null);
  };

  return (
    <SellerContext.Provider value={{ seller, loading, error, login, register, fetchProfile, updateProfile, logout }}>
      {children}
    </SellerContext.Provider>
  );
}; 