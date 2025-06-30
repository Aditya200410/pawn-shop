import env from './env';

// Configuration file for API endpoints and environment settings
// Change this single URL to update all API calls across the application

const config = {
  // Environment variables
  ...env,
  
  // Backend API URL - Change this to switch between environments
  API_BASE_URL: 'https://pawnbackend-xmqa.onrender.com',
  
  // API endpoints
  API_ENDPOINTS: {
    AUTH: '/api/auth',
    CART: '/api/cart',
    SHOP: '/api/shop',
    ORDERS: '/api/orders',
    CATEGORIES: '/api/categories',
    PRODUCTS: '/api/products',
    SELLER: '/api/seller',
    COUPONS: '/api/coupons',
    HERO_CAROUSEL: '/api/hero-carousel',
  },
  
  // Full API URLs (constructed from base URL and endpoints)
  get API_URLS() {
    const urls = {};
    Object.keys(this.API_ENDPOINTS).forEach(key => {
      urls[key] = `${this.API_BASE_URL}${this.API_ENDPOINTS[key]}`;
    });
    return urls;
  },
  
  // Utility function to fix image URLs
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
      return `${config.API_BASE_URL}/${basePath}${cleanPath}`;
    }
    
    // By default, assume it's a frontend public asset
    return `/${cleanPath}`;
  },
  
  // Environment settings
  ENVIRONMENT: {
    IS_PRODUCTION: process.env.NODE_ENV === 'production',
    IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  },
  
  // CORS settings
  CORS: {
    WITH_CREDENTIALS: true,
    HEADERS: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  },
  
  // Development configuration
  get DEV_CONFIG() {
    return {
      API_BASE_URL: 'http://localhost:5000',
      ENABLE_LOGGING: true,
      ENABLE_ANALYTICS: false,
    };
  },
  
  // Production configuration
  get PROD_CONFIG() {
    return {
      API_BASE_URL: 'https://pawnbackend-xmqa.onrender.com',
      ENABLE_LOGGING: false,
      ENABLE_ANALYTICS: true,
    };
  },
  
  // Get current environment config
  getCurrentConfig: () => {
    if (env.IS_DEVELOPMENT) {
      return config.DEV_CONFIG;
    }
    return config.PROD_CONFIG;
  },
  
  // Initialize configuration
  init: () => {
    if (env.IS_DEVELOPMENT) {
      env.log('Initializing development configuration');
      env.log('API Base URL:', config.API_BASE_URL);
      env.log('App Name:', config.APP.NAME);
    }
  },
};

// Initialize configuration on import
config.init();

export default config; 