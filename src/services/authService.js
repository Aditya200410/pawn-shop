import config from '../config/config.js';

export const authService = {
    async register(userData) {
        const response = await fetch(`${config.API_URLS.AUTH}/register`, {
            method: 'POST',
            headers: config.CORS.HEADERS,
            credentials: config.CORS.WITH_CREDENTIALS ? 'include' : 'omit',
            body: JSON.stringify(userData),
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Registration failed');
        }
        
        return response.json();
    },

    async login(credentials) {
        const response = await fetch(`${config.API_URLS.AUTH}/login`, {
            method: 'POST',
            headers: config.CORS.HEADERS,
            credentials: config.CORS.WITH_CREDENTIALS ? 'include' : 'omit',
            body: JSON.stringify({ username: credentials.email, password: credentials.password }),
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Login failed');
        }
        
        return response.json();
    },

    async getCurrentUser() {
        const response = await fetch(`${config.API_URLS.AUTH}/me`, {
            credentials: config.CORS.WITH_CREDENTIALS ? 'include' : 'omit',
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to get user data');
        }
        
        return response.json();
    },

    async logout() {
        const response = await fetch(`${config.API_URLS.AUTH}/logout`, {
            method: 'POST',
            credentials: config.CORS.WITH_CREDENTIALS ? 'include' : 'omit',
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