import axios from 'axios';
import config from '../config/config';

const API_BASE_URL = config.API_BASE_URL;

class PaymentService {
  // Initiate PhonePe payment with latest 2025 API support
  async initiatePhonePePayment(orderData) {
    try {
      console.log('PaymentService - Initiating PhonePe payment with data:', orderData);
      
      // Enhanced order data for 2025 PhonePe API
      const enhancedOrderData = {
        ...orderData,
        // Additional fields for better tracking and 2025 features
        timestamp: new Date().toISOString(),
        source: 'web',
        // Enhanced customer data
        customerData: {
          name: orderData.customerName,
          email: orderData.email,
          phone: orderData.phone,
          address: orderData.address
        }
      };
      
      console.log('PaymentService - Enhanced order data for 2025 API:', enhancedOrderData);
      
      const response = await axios.post(`${API_BASE_URL}/api/payment/phonepe`, enhancedOrderData, {
        timeout: 30000, // 30 second timeout
        headers: {
          'Content-Type': 'application/json',
          'X-Client-Version': '2025.1.0', // Indicate we're using 2025 API features
        }
      });
      
      console.log('PaymentService - PhonePe response:', response.data);
      return response.data;
    } catch (error) {
      console.error('PaymentService - PhonePe initiation error:', error);
      
      let errorMessage = 'Failed to initiate PhonePe payment';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error?.message) {
        errorMessage = error.response.data.error.message;
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Payment gateway timeout. Please try again.';
      } else if (error.code === 'ENOTFOUND') {
        errorMessage = 'Payment gateway not reachable. Please try again.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Payment service not found. Please contact support.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Payment gateway error. Please try again later.';
      }
      
      throw new Error(errorMessage);
    }
  }

  // Check PhonePe payment status with enhanced error handling
  async checkPhonePeStatus(transactionId) {
    try {
      console.log('PaymentService - Checking PhonePe status for:', transactionId);
      
      const response = await axios.get(`${API_BASE_URL}/api/payment/phonepe/status/${transactionId}`, {
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json',
          'X-Client-Version': '2025.1.0',
        }
      });
      
      console.log('PaymentService - PhonePe status response:', response.data);
      return response.data;
    } catch (error) {
      console.error('PaymentService - PhonePe status check error:', error);
      
      let errorMessage = 'Failed to check PhonePe payment status';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error?.message) {
        errorMessage = error.response.data.error.message;
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Payment verification timeout. Please try again.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Transaction not found. Please contact support.';
      }
      
      throw new Error(errorMessage);
    }
  }

  // New method to handle PhonePe callback verification
  async verifyPhonePeCallback(callbackData) {
    try {
      console.log('PaymentService - Verifying PhonePe callback:', callbackData);
      
      const response = await axios.post(`${API_BASE_URL}/api/payment/phonepe/callback`, callbackData, {
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json',
          'X-Client-Version': '2025.1.0',
        }
      });
      
      console.log('PaymentService - Callback verification response:', response.data);
      return response.data;
    } catch (error) {
      console.error('PaymentService - Callback verification error:', error);
      throw new Error('Failed to verify payment callback');
    }
  }
}

export default new PaymentService(); 