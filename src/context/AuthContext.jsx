import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { toast } from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const stored = localStorage.getItem('user');
            return stored ? JSON.parse(stored) : null;
        } catch (error) {
            
            localStorage.removeItem('user'); // Clear invalid data
            return null;
        }
    });
    const [loading, setLoading] = useState(false); // Start with false since we have cached user
    const [error, setError] = useState(null);

    useEffect(() => {
        const initAuth = async () => {
            // Only check auth if we have a token but no user, or if we want to refresh
            const token = localStorage.getItem('token');
            let storedUser = null;
            try {
                const stored = localStorage.getItem('user');
                storedUser = stored ? JSON.parse(stored) : null;
            } catch (error) {
               
                localStorage.removeItem('user');
            }
            
            if (token && !storedUser) {
                setLoading(true);
                try {
                    const data = await authService.getCurrentUser();
                    setUser(data.user);
                    localStorage.setItem('user', JSON.stringify(data.user));
                } catch (err) {
                    setUser(null);
                    localStorage.removeItem('user');
                    localStorage.removeItem('token');
                } finally {
                    setLoading(false);
                }
            } else {
                // If we have cached user data, don't make API call
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
            // Do NOT set user or token here; wait for OTP verification
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
            setUser(response.user);
            localStorage.setItem('user', JSON.stringify(response.user));
            return response;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to update profile';
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
            throw error;
        }
    };

    /**
     * Call this after MSG91 OTP widget success to log in and complete registration
     * @param {Object} credentials - { email, password } or { phone, password }
     */
    const completeRegistrationAfterOtp = async (credentials) => {
        return login(credentials);
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
        isAuthenticated: !!user,
        completeRegistrationAfterOtp,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
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