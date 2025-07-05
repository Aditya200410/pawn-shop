/**
 * Environment configuration
 * This file loads environment variables from .env files and provides
 * type-safe access to them throughout the application.
 */

const env = {
  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://pawnbackend-xmqa.onrender.com',
  
  // Feature Flags
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  ENABLE_LOGGING: import.meta.env.VITE_ENABLE_LOGGING === 'true',
  
  // PhonePe Payment Gateway
  PHONEPE: {
    CLIENT_ID: import.meta.env.VITE_PHONEPE_CLIENT_ID || '',
    CLIENT_SECRET: import.meta.env.VITE_PHONEPE_CLIENT_SECRET || '',
    CLIENT_VERSION: import.meta.env.VITE_PHONEPE_CLIENT_VERSION || '1',
    ENV: import.meta.env.VITE_PHONEPE_ENV || 'production',
    FRONTEND_URL: import.meta.env.VITE_FRONTEND_URL || 'https://pawn-shop-git-local-host-api-used-aditya200410s-projects.vercel.app',
    BACKEND_URL: import.meta.env.VITE_BACKEND_URL || 'https://pawnbackend-xmqa.onrender.com',
  },
  
  // Image CDN
  IMAGE_CDN_URL: import.meta.env.VITE_IMAGE_CDN_URL || 'https://pawnbackend-xmqa.onrender.com',
  
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
  IS_TESTING: import.meta.env.MODE === 'test',
  
  // Performance Monitoring
  PERFORMANCE: {
    ENABLE_METRICS: import.meta.env.VITE_ENABLE_PERFORMANCE_METRICS === 'true',
    SAMPLE_RATE: parseFloat(import.meta.env.VITE_PERFORMANCE_SAMPLE_RATE || '0.1'),
  },
  
  // Error Reporting
  ERROR_REPORTING: {
    ENABLE_SENTRY: import.meta.env.VITE_ENABLE_SENTRY === 'true',
    SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN || '',
    SENTRY_ENVIRONMENT: import.meta.env.VITE_SENTRY_ENVIRONMENT || 'development',
  },
  
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

// Required PhonePe env variables:
// VITE_PHONEPE_CLIENT_ID - Your PhonePe client ID
// VITE_PHONEPE_CLIENT_SECRET - Your PhonePe client secret
// VITE_PHONEPE_CLIENT_VERSION - Your PhonePe client version (default: 1.0)
// VITE_PHONEPE_ENV - Environment (sandbox or production)
// VITE_FRONTEND_URL - Your frontend base URL
// VITE_BACKEND_URL - Your backend base URL

export default env; 