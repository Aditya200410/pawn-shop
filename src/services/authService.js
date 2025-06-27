import config from '../config/config.js';

export const authService = {
    async register(userData) {
        try {
        const response = await fetch(`${config.API_URLS.AUTH}/register`, {
            method: 'POST',
            headers: config.CORS.HEADERS,
                credentials: 'include',
            body: JSON.stringify(userData),
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Registration failed');
        }
        
        return response.json();
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    },

    async login(credentials) {
        try {
        const response = await fetch(`${config.API_URLS.AUTH}/login`, {
            method: 'POST',
            headers: config.CORS.HEADERS,
                credentials: 'include',
            body: JSON.stringify({ username: credentials.email, password: credentials.password }),
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Login failed');
        }
        
        return response.json();
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    async getCurrentUser() {
        try {
            const token = localStorage.getItem('token');
            const headers = {
                ...config.CORS.HEADERS,
            };
            
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            
        const response = await fetch(`${config.API_URLS.AUTH}/me`, {
                headers,
                credentials: 'include',
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to get user data');
        }
        
        return response.json();
        } catch (error) {
            console.error('Get current user error:', error);
            throw error;
        }
    },

    async logout() {
        try {
        const response = await fetch(`${config.API_URLS.AUTH}/logout`, {
            method: 'POST',
                credentials: 'include',
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to logout');
        }
        
        return response.json();
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    },

    async updateProfile(userData) {
        try {
            const token = localStorage.getItem('token');
            const headers = {
                ...config.CORS.HEADERS,
            };
            
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            
            const response = await fetch(`${config.API_URLS.AUTH}/update-profile`, {
                method: 'PUT',
                headers,
                credentials: 'include',
                body: JSON.stringify(userData),
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to update profile');
            }
            
            return response.json();
        } catch (error) {
            console.error('Update profile error:', error);
            throw error;
        }
    },

    async forgotPassword(email) {
        try {
            const response = await fetch(`${config.API_URLS.AUTH}/forgot-password`, {
                method: 'POST',
                headers: config.CORS.HEADERS,
                credentials: 'include',
                body: JSON.stringify({ email }),
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to send reset link');
            }
            
            return response.json();
        } catch (error) {
            console.error('Forgot password error:', error);
            throw error;
        }
    },

    isAuthenticated() {
        const token = localStorage.getItem('token');
        return !!token;
    }
}; 