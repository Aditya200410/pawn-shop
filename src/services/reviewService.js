import config from '../config/config.js';

const API_BASE_URL = config.API_URLS.BASE_URL;

class ReviewService {
  // Get reviews for a product
  static async getProductReviews(productId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/reviews/product/${productId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching product reviews:', error);
      throw error;
    }
  }

  // Get user's review for a product (by email)
  static async getUserReview(productId, userEmail) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/reviews/user/${productId}?userEmail=${encodeURIComponent(userEmail)}`);
      
      if (response.status === 404) {
        return null; // User hasn't reviewed this product
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch user review');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching user review:', error);
      throw error;
    }
  }

  // Create a new review
  static async createReview(reviewData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reviewData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create review');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  }

  // Update a review
  static async updateReview(reviewId, reviewData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reviewData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update review');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating review:', error);
      throw error;
    }
  }

  // Delete a review
  static async deleteReview(reviewId, userEmail) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userEmail })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete review');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  }
}

export default ReviewService; 