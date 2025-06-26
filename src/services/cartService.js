import axios from 'axios';
import config from '../config/config.js';

const cartService = {
    // Get user's cart
    getCart: async (email) => {
        if (!email) throw new Error('Email is required for cart operations');
        try {
            const response = await axios.get(`${config.API_URLS.CART}?email=${encodeURIComponent(email)}`, {
                withCredentials: config.CORS.WITH_CREDENTIALS
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Add item to cart
    addToCart: async (productId, quantity, email) => {
        if (!email) throw new Error('Email is required for cart operations');
        try {
            const response = await axios.post(
                `${config.API_URLS.CART}/add`,
                { 
                    productId: productId._id || productId.id || productId, 
                    quantity, 
                    email 
                },
                { withCredentials: config.CORS.WITH_CREDENTIALS }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Update item quantity
    updateQuantity: async (productId, quantity, email) => {
        if (!email) throw new Error('Email is required for cart operations');
        try {
            const response = await axios.put(
                `${config.API_URLS.CART}/update`,
                { productId, quantity, email },
                { withCredentials: config.CORS.WITH_CREDENTIALS }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Remove item from cart
    removeFromCart: async (productId, email) => {
        if (!email) throw new Error('Email is required for cart operations');
        try {
            const response = await axios.delete(
                `${config.API_URLS.CART}/remove/${productId}`,
                {
                    data: { email },
                    withCredentials: config.CORS.WITH_CREDENTIALS
                }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Clear cart
    clearCart: async (email) => {
        if (!email) throw new Error('Email is required for cart operations');
        try {
            const response = await axios.delete(`${config.API_URLS.CART}/clear`, {
                data: { email },
                withCredentials: config.CORS.WITH_CREDENTIALS
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

export default cartService; 