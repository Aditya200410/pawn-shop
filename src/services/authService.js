const API_URL = '/api';

export const authService = {
    async register(userData) {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(userData),
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Registration failed');
        }
        
        return response.json();
    },

    async login(credentials) {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ username: credentials.email, password: credentials.password }),
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Login failed');
        }
        
        return response.json();
    },

    async getCurrentUser() {
        const response = await fetch(`${API_URL}/auth/me`, {
            credentials: 'include',
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to get user data');
        }
        
        return response.json();
    },

    async logout() {
        const response = await fetch(`${API_URL}/auth/logout`, {
            method: 'POST',
            credentials: 'include',
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to logout');
        }
        
        return response.json();
    },

    isAuthenticated() {
        return document.cookie.includes('token=');
    }
}; 