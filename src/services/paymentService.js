import axios from 'axios';
import config from '../config/config';

const API_BASE_URL = config.API_BASE_URL;

class PaymentService {
  // Initiate PhonePe payment according to official API documentation
  async initiatePhonePePayment(orderData) {
    try {
      console.log('PaymentService - Initiating PhonePe payment with data:', orderData);
      
      // Prepare order data according to PhonePe API requirements
      const phonePeOrderData = {
        amount: orderData.amount,
        customerName: orderData.customerName,
        email: orderData.email,
        phone: orderData.phone,
        address: orderData.address,
        city: orderData.city,
        state: orderData.state,
        pincode: orderData.pincode,
        country: orderData.country,
        items: orderData.items,
        totalAmount: orderData.totalAmount,
        shippingCost: orderData.shippingCost,
        codExtraCharge: orderData.codExtraCharge,
        finalTotal: orderData.finalTotal,
        paymentMethod: 'phonepe',
        sellerToken: orderData.sellerToken,
        couponCode: orderData.couponCode
      };
      
      console.log('PaymentService - PhonePe order data:', phonePeOrderData);
      
      const response = await axios.post(`${API_BASE_URL}/api/payment/phonepe`, phonePeOrderData, {
        timeout: 30000, // 30 second timeout
        headers: {
          'Content-Type': 'application/json'
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

  // Check PhonePe payment status
  async checkPhonePeStatus(transactionId) {
    try {
      console.log('PaymentService - Checking PhonePe status for:', transactionId);
      
      const response = await axios.get(`${API_BASE_URL}/api/payment/phonepe/status/${transactionId}`, {
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json'
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

  // Handle PhonePe callback verification
  async verifyPhonePeCallback(callbackData) {
    try {
      console.log('PaymentService - Verifying PhonePe callback:', callbackData);
      
      const response = await axios.post(`${API_BASE_URL}/api/payment/phonepe/callback`, callbackData, {
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json'
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