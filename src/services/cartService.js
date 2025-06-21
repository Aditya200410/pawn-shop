import axios from 'axios';
import config from '../config/config.js';

const cartService = {
    // Get user's cart
    getCart: async () => {
        try {
            const response = await axios.get(`${config.API_URLS.CART}`, {
                withCredentials: config.CORS.WITH_CREDENTIALS
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Add item to cart
    addToCart: async (productId, quantity) => {
        try {
            const response = await axios.post(
                `${config.API_URLS.CART}/add`,
                { productId, quantity },
                { withCredentials: config.CORS.WITH_CREDENTIALS }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Update item quantity
    updateQuantity: async (productId, quantity) => {
        try {
            const response = await axios.put(
                `${config.API_URLS.CART}/update`,
                { productId, quantity },
                { withCredentials: config.CORS.WITH_CREDENTIALS }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Remove item from cart
    removeFromCart: async (productId) => {
        try {
            const response = await axios.delete(
                `${config.API_URLS.CART}/remove/${productId}`,
                { withCredentials: config.CORS.WITH_CREDENTIALS }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Clear cart
    clearCart: async () => {
        try {
            const response = await axios.delete(`${config.API_URLS.CART}/clear`, {
                withCredentials: config.CORS.WITH_CREDENTIALS
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

export default cartService; 