// Environment configuration for the frontend
const env = {
  // Razorpay Configuration
  RAZORPAY_KEY_ID: 'rzp_test_1DP5mmOlF5G5ag',
  
  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://pawnbackend-xmqa.onrender.com',
  
  // App Configuration
  APP_NAME: 'Riko Craft',
  APP_VERSION: '1.0.0',
  
  // Feature Flags
  ENABLE_PAYMENTS: true,
  ENABLE_COUPONS: true,
  ENABLE_REVIEWS: true,
};

export default env; 