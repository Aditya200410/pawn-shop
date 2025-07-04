import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { createURLWithSellerToken } from '../utils/urlUtils';

/**
 * Custom hook for navigation with seller token support
 */
export const useSellerNavigation = () => {
  const navigate = useNavigate();
  const { sellerToken } = useCart();

  /**
   * Navigate to a path with seller token if available
   * @param {string} path - The path to navigate to
   * @param {object} options - Navigation options
   */
  const navigateWithSellerToken = (path, options = {}) => {
    const url = createURLWithSellerToken(path, sellerToken);
    navigate(url, options);
  };

  /**
   * Navigate to home page with seller token
   */
  const navigateToHome = () => {
    navigateWithSellerToken('/');
  };

  /**
   * Navigate to cart with seller token
   */
  const navigateToCart = () => {
    navigateWithSellerToken('/cart');
  };

  /**
   * Navigate to checkout with seller token
   */
  const navigateToCheckout = () => {
    navigateWithSellerToken('/checkout');
  };

  /**
   * Navigate to shop with seller token
   */
  const navigateToShop = () => {
    navigateWithSellerToken('/shop');
  };

  /**
   * Navigate to product page with seller token
   * @param {string} productId - The product ID
   */
  const navigateToProduct = (productId) => {
    navigateWithSellerToken(`/product/${productId}`);
  };

  return {
    navigateWithSellerToken,
    navigateToHome,
    navigateToCart,
    navigateToCheckout,
    navigateToShop,
    navigateToProduct
  };
}; 