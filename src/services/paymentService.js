import axios from 'axios';
import config from '../config/config';

const API_BASE_URL = config.API_BASE_URL;

class PaymentService {
  // Initiate PhonePe payment
  async initiatePhonePePayment(orderData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/payment/phonepe`, orderData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to initiate PhonePe payment');
    }
  }

  // Check PhonePe payment status
  async checkPhonePeStatus(transactionId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/payment/phonepe/status/${transactionId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to check PhonePe payment status');
    }
  }
}

export default new PaymentService(); 