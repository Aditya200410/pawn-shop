// Utility functions for handling URLs with seller tokens

/**
 * Updates the current URL to include seller token without causing a page reload
 * @param {string} sellerToken - The seller token to add to URL
 * @param {string} pathname - The current pathname (optional, defaults to current location)
 */
export const updateURLWithSellerToken = (sellerToken, pathname = null) => {
  if (!sellerToken) return;

  const currentPath = pathname || window.location.pathname;
  const currentSearch = window.location.search;
  const urlParams = new URLSearchParams(currentSearch);
  
  // Add or update seller token
  urlParams.set('seller', sellerToken);
  
  const newURL = `${currentPath}?${urlParams.toString()}`;
  
  // Update URL without reloading the page
  window.history.replaceState({}, '', newURL);
};

/**
 * Removes seller token from URL without causing a page reload
 * @param {string} pathname - The current pathname (optional, defaults to current location)
 */
export const removeSellerTokenFromURL = (pathname = null) => {
  const currentPath = pathname || window.location.pathname;
  const currentSearch = window.location.search;
  const urlParams = new URLSearchParams(currentSearch);
  
  // Remove seller token
  urlParams.delete('seller');
  
  const newURL = urlParams.toString() ? `${currentPath}?${urlParams.toString()}` : currentPath;
  
  // Update URL without reloading the page
  window.history.replaceState({}, '', newURL);
};

/**
 * Gets seller token from URL parameters
 * @returns {string|null} The seller token if present, null otherwise
 */
export const getSellerTokenFromURL = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('seller');
};

/**
 * Creates a URL with seller token for navigation
 * @param {string} path - The path to navigate to
 * @param {string} sellerToken - The seller token to include
 * @returns {string} The complete URL with seller token
 */
export const createURLWithSellerToken = (path, sellerToken) => {
  if (!sellerToken) return path;
  return `${path}?seller=${sellerToken}`;
};

/**
 * Checks if current URL has a seller token
 * @returns {boolean} True if seller token is present in URL
 */
export const hasSellerTokenInURL = () => {
  return getSellerTokenFromURL() !== null;
}; 