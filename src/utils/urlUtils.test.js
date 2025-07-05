// Test file for URL utilities
import { 
  updateURLWithSellerToken, 
  removeSellerTokenFromURL, 
  getSellerTokenFromURL, 
  createURLWithSellerToken, 
  hasSellerTokenInURL 
} from './urlUtils';

// Mock window.location
const mockLocation = {
  pathname: '/test',
  search: '',
  href: 'http://localhost:3000/test'
};

Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true
});

// Mock window.history
const mockHistory = {
  replaceState: jest.fn()
};

Object.defineProperty(window, 'history', {
  value: mockHistory,
  writable: true
});

describe('URL Utilities', () => {
  beforeEach(() => {
    // Reset mocks
    mockLocation.search = '';
    mockHistory.replaceState.mockClear();
  });

  test('updateURLWithSellerToken should update URL with seller token', () => {
    const sellerToken = 'test-seller-token';
    updateURLWithSellerToken(sellerToken);
    
    expect(mockHistory.replaceState).toHaveBeenCalledWith(
      {},
      '',
      '/test?seller=test-seller-token'
    );
  });

  test('removeSellerTokenFromURL should remove seller token from URL', () => {
    mockLocation.search = '?seller=test-token&other=param';
    removeSellerTokenFromURL();
    
    expect(mockHistory.replaceState).toHaveBeenCalledWith(
      {},
      '',
      '/test?other=param'
    );
  });

  test('getSellerTokenFromURL should return seller token from URL', () => {
    mockLocation.search = '?seller=test-token';
    const token = getSellerTokenFromURL();
    expect(token).toBe('test-token');
  });

  test('createURLWithSellerToken should create URL with seller token', () => {
    const path = '/shop';
    const sellerToken = 'test-token';
    const url = createURLWithSellerToken(path, sellerToken);
    expect(url).toBe('/shop?seller=test-token');
  });

  test('hasSellerTokenInURL should return true when seller token exists', () => {
    mockLocation.search = '?seller=test-token';
    const hasToken = hasSellerTokenInURL();
    expect(hasToken).toBe(true);
  });

  test('hasSellerTokenInURL should return false when seller token does not exist', () => {
    mockLocation.search = '';
    const hasToken = hasSellerTokenInURL();
    expect(hasToken).toBe(false);
  });
}); 