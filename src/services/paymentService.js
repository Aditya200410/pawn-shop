import axios from 'axios';
import config from '../config/config';
import env from '../config/env';

const API_BASE_URL = config.API_BASE_URL;

class PaymentService {
  // Create Razorpay order
  async createOrder(amount, currency = 'INR') {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/payment/create-order`, {
        amount,
        currency,
        receipt: `receipt_${Date.now()}`
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create payment order');
    }
  }

  // Verify payment
  async verifyPayment(paymentData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/payment/verify-payment`, paymentData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Payment verification failed');
    }
  }

  // Get payment details
  async getPaymentDetails(paymentId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/payment/payment/${paymentId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch payment details');
    }
  }

  // Initialize Razorpay payment
  async initiatePayment(orderData, userData) {
    try {
      // Create order on backend
      const orderResponse = await this.createOrder(orderData.amount);
      
      if (!orderResponse.success) {
        throw new Error('Failed to create payment order');
      }

      // Configure Razorpay options
      const options = {
        key: env.RAZORPAY_KEY_ID,
        amount: orderResponse.order.amount,
        currency: orderResponse.order.currency,
        name: env.APP_NAME,
        description: 'Order Payment',
        order_id: orderResponse.order.id,
        handler: async (response) => {
          try {
            // Verify payment on backend
            const verificationResponse = await this.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verificationResponse.success) {
              return {
                success: true,
                payment_id: response.razorpay_payment_id,
                order_id: response.razorpay_order_id,
                signature: response.razorpay_signature
              };
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            throw new Error('Payment verification failed: ' + error.message);
          }
        },
        prefill: {
          name: userData.name || `${userData.firstName} ${userData.lastName}`,
          email: userData.email,
          contact: userData.phone
        },
        notes: {
          address: userData.address,
          order_id: orderData.orderId
        },
        theme: {
          color: '#FF6B35'
        },
        modal: {
          ondismiss: () => {
            // Handle modal dismissal
            console.log('Payment modal dismissed');
          }
        }
      };

      return new Promise((resolve, reject) => {
        // Load Razorpay script if not already loaded
        if (!window.Razorpay) {
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = () => {
            this.openRazorpayModal(options, resolve, reject);
          };
          script.onerror = () => {
            reject(new Error('Failed to load Razorpay script'));
          };
          document.head.appendChild(script);
        } else {
          this.openRazorpayModal(options, resolve, reject);
        }
      });
    } catch (error) {
      throw error;
    }
  }

  // Open Razorpay modal
  openRazorpayModal(options, resolve, reject) {
    try {
      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', (response) => {
        reject(new Error('Payment failed: ' + response.error.description));
      });

      rzp.on('payment.cancelled', () => {
        reject(new Error('Payment was cancelled'));
      });

      rzp.open();
      
      // Store the handler to resolve the promise
      const originalHandler = options.handler;
      options.handler = async (response) => {
        try {
          const result = await originalHandler(response);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      };
    } catch (error) {
      reject(new Error('Failed to initialize Razorpay: ' + error.message));
    }
  }
}

export default new PaymentService(); 