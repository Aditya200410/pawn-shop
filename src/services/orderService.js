import axios from 'axios';
import config from '../config/config.js';

const orderService = {
  /**
   * Create a new order.
   * @param {object} orderData - The complete order object.
   * @returns {Promise<object>} The server response.
   */
  createOrder: async (orderData) => {
    try {
      const response = await axios.post(config.API_URLS.ORDERS, orderData);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error.response?.data || error.message);
      throw error.response?.data || new Error('Failed to create order');
    }
  },

  /**
   * Fetch a single order by its ID.
   * @param {string} orderId - The ID of the order.
   * @returns {Promise<object>} The server response containing the order.
   */
  getOrderById: async (orderId) => {
    if (!orderId) {
      throw new Error('Order ID is required to fetch an order.');
    }
    try {
      const response = await axios.get(`${config.API_URLS.ORDERS}/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order by ID:', error.response?.data || error.message);
      throw error.response?.data || new Error('Failed to fetch order');
    }
  },

  /**
   * Fetch orders for a specific user by email.
   * @param {string} email - The user's email.
   * @returns {Promise<object>} The server response containing the orders.
   */
  getOrdersByEmail: async (email) => {
    if (!email) {
      throw new Error('Email is required to fetch orders.');
    }
    try {
      const response = await axios.get(`${config.API_URLS.ORDERS}?email=${encodeURIComponent(email)}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error.response?.data || error.message);
      throw error.response?.data || new Error('Failed to fetch orders');
    }
  },
};

export default orderService; 