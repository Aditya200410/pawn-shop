import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { toast } from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem('user');
        return stored ? JSON.parse(stored) : null;
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const initAuth = async () => {
            try {
                const data = await authService.getCurrentUser();
                setUser(data.user);
                localStorage.setItem('user', JSON.stringify(data.user));
            } catch (err) {
                setUser(null);
                localStorage.removeItem('user');
            } finally {
                setLoading(false);
            }
        };
        initAuth();
    }, []);

    const login = async (credentials) => {
        try {
            setError(null);
            const data = await authService.login(credentials);
            setUser(data.user);
            localStorage.setItem('user', JSON.stringify(data.user));
            // Store the token in localStorage
            if (data.token) {
                localStorage.setItem('token', data.token);
            }
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const register = async (userData) => {
        try {
            setError(null);
            const data = await authService.register(userData);
            setUser(data.user);
            localStorage.setItem('user', JSON.stringify(data.user));
            // Store the token in localStorage
            if (data.token) {
                localStorage.setItem('token', data.token);
            }
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
        } catch (err) {
            // Optionally handle logout error
        }
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    const updateProfile = async (userData) => {
        try {
            const response = await authService.updateProfile(userData);
            setUser(response.data.user);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to update profile';
            toast.error(errorMessage);
            throw error;
        }
    };

    const forgotPassword = async (email) => {
        try {
            const response = await authService.forgotPassword(email);
            toast.success('Password reset link sent to your email');
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to send reset link';
            toast.error(errorMessage);
            throw error;
        }
    };

    const value = {
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile,
        forgotPassword,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 