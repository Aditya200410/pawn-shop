import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const cartService = {
    // Get user's cart
    getCart: async () => {
        try {
            const response = await axios.get(`${API_URL}/cart`, {
                withCredentials: true
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
                `${API_URL}/cart/add`,
                { productId, quantity },
                { withCredentials: true }
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
                `${API_URL}/cart/update`,
                { productId, quantity },
                { withCredentials: true }
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
                `${API_URL}/cart/remove/${productId}`,
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Clear cart
    clearCart: async () => {
        try {
            const response = await axios.delete(`${API_URL}/cart/clear`, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

export default cartService; 