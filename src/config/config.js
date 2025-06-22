// Configuration file for API endpoints and environment settings
// Change this single URL to update all API calls across the application

const config = {
  // Backend API URL - Change this to switch between environments
  API_BASE_URL: 'https://pawnbackend-xmqa.onrender.com',
  
  // API endpoints
  API_ENDPOINTS: {
    AUTH: '/api/auth',
    CART: '/api/cart',
    SHOP: '/api/shop',
    ORDERS: '/api/orders',
    CATEGORIES: '/api/categories',
    FEATURED_PRODUCTS: '/api/featured-products',
    BESTSELLER: '/api/bestseller',
    LOVED: '/api/loved',
  },
  
  // Full API URLs (constructed from base URL and endpoints)
  get API_URLS() {
    return {
      AUTH: `${this.API_BASE_URL}${this.API_ENDPOINTS.AUTH}`,
      CART: `${this.API_BASE_URL}${this.API_ENDPOINTS.CART}`,
      SHOP: `${this.API_BASE_URL}${this.API_ENDPOINTS.SHOP}`,
      ORDERS: `${this.API_BASE_URL}${this.API_ENDPOINTS.ORDERS}`,
      CATEGORIES: `${this.API_BASE_URL}${this.API_ENDPOINTS.CATEGORIES}`,
      FEATURED_PRODUCTS: `${this.API_BASE_URL}${this.API_ENDPOINTS.FEATURED_PRODUCTS}`,
      BESTSELLER: `${this.API_BASE_URL}${this.API_ENDPOINTS.BESTSELLER}`,
      LOVED: `${this.API_BASE_URL}${this.API_ENDPOINTS.LOVED}`,
    };
  },
  
  // Utility function to fix image URLs
  fixImageUrl: (imagePath) => {
    if (!imagePath) return '';
    
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // If it's a path to a backend data file (e.g., in Rikocraft.com or just a filename)
    if (imagePath.includes('Rikocraft.com') || !imagePath.includes('/')) {
      // It's a backend file, so prefix with the backend URL and data path
      const basePath = imagePath.startsWith('/pawnbackend/data/') ? '' : '/pawnbackend/data/';
      return `${config.API_BASE_URL}${basePath}${imagePath}`;
    }
    
    // By default, assume it's a frontend public asset
    return imagePath;
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
};

export default config; 