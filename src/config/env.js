/**
 * Environment configuration
 * This file loads environment variables from .env files and provides
 * type-safe access to them throughout the application.
 */

const env = {
  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://api.rikocraft.com',
  
  // Feature Flags
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  ENABLE_LOGGING: import.meta.env.VITE_ENABLE_LOGGING === 'true',
  
  // Payment Gateway
  RAZORPAY: {
    KEY_ID: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_1DP5mmOlF5G5ag',
    KEY_SECRET: import.meta.env.VITE_RAZORPAY_KEY_SECRET || '',
  },
  
  // Image CDN
  IMAGE_CDN_URL: import.meta.env.VITE_IMAGE_CDN_URL || 'https://api.rikocraft.com',
  
  // App Configuration
  APP: {
    NAME: import.meta.env.VITE_APP_NAME || 'RIKO CRAFT',
    DESCRIPTION: import.meta.env.VITE_APP_DESCRIPTION || 'Your one-stop shop for unique handcrafted items',
    CONTACT_EMAIL: import.meta.env.VITE_CONTACT_EMAIL || 'support@rikocraft.com',
    SUPPORT_PHONE: import.meta.env.VITE_SUPPORT_PHONE || '+91 98765 43210',
  },
  
  // Social Media Links
  SOCIAL: {
    FACEBOOK: import.meta.env.VITE_FACEBOOK_URL || '',
    INSTAGRAM: import.meta.env.VITE_INSTAGRAM_URL || '',
    TWITTER: import.meta.env.VITE_TWITTER_URL || '',
  },
  
  // Security
  SECURITY: {
    JWT_EXPIRY: import.meta.env.VITE_JWT_EXPIRY || '7d',
    ENABLE_RECAPTCHA: import.meta.env.VITE_ENABLE_RECAPTCHA === 'true',
    RECAPTCHA_SITE_KEY: import.meta.env.VITE_RECAPTCHA_SITE_KEY || '',
  },
  
  // Cache Configuration
  CACHE: {
    DURATION: parseInt(import.meta.env.VITE_CACHE_DURATION || '3600', 10),
    ENABLE_SERVICE_WORKER: import.meta.env.VITE_ENABLE_SERVICE_WORKER === 'true',
  },
  
  // Environment Detection
  IS_DEVELOPMENT: import.meta.env.DEV,
  IS_PRODUCTION: import.meta.env.PROD,
  MODE: import.meta.env.MODE,
  
  // CORS Configuration
  CORS: {
    WITH_CREDENTIALS: true,
    HEADERS: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  },
  
  // Utility Functions
  fixImageUrl: (imagePath) => {
    if (!imagePath) return '';
    
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // Remove any leading slashes and clean the path
    const cleanPath = imagePath.replace(/^\/+/, '').replace(/\/+/g, '/');
    
    // If it's a path to a backend data file
    if (cleanPath.includes('Rikocraft.com') || !cleanPath.includes('/')) {
      // Always use /pawnbackend/data/ prefix for backend files
      const basePath = cleanPath.startsWith('pawnbackend/data/') ? '' : 'pawnbackend/data/';
      return `${env.API_BASE_URL}/${basePath}${cleanPath}`;
    }
    
    // By default, assume it's a frontend public asset
    return `/${cleanPath}`;
  },
  
  // Development helpers
  get isDev() {
    return this.IS_DEVELOPMENT;
  },
  
  get isProd() {
    return this.IS_PRODUCTION;
  },
  
  // API URL builder
  getApiUrl: (endpoint) => {
    return `${env.API_BASE_URL}${endpoint}`;
  },
  
  // Log helper for development
  log: (...args) => {
    if (env.IS_DEVELOPMENT && env.ENABLE_LOGGING) {
      console.log('[ENV]', ...args);
    }
  },
  
  // Error helper for development
  logError: (...args) => {
    if (env.IS_DEVELOPMENT && env.ENABLE_LOGGING) {
      console.error('[ENV ERROR]', ...args);
    }
  },
};

export default env; 