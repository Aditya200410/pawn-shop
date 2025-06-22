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
    
    // If it's a local path starting with /pawnbackend/data/, convert to backend URL
    if (imagePath.startsWith('/pawnbackend/data/')) {
      return `${config.API_BASE_URL}${imagePath}`;
    }
    
    // If it's a relative path, assume it's from the backend
    if (imagePath.startsWith('/')) {
      return `${config.API_BASE_URL}${imagePath}`;
    }
    
    // If it's just a filename, assume it's from the backend data directory
    return `${config.API_BASE_URL}/pawnbackend/data/${imagePath}`;
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
    },
  },
};

export default config; 