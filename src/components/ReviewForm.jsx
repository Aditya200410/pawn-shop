import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import ReviewService from '../services/reviewService';
import { useAuth } from '../context/AuthContext';

const ReviewForm = ({ productId, onReviewSubmitted, onReviewUpdated, onReviewDeleted, existingReview = null }) => {
  const { user } = useAuth();
  const token = localStorage.getItem('token');
  const [stars, setStars] = useState(existingReview?.stars || 0);
  const [reviewTitle, setReviewTitle] = useState(existingReview?.reviewTitle || '');
  const [reviewDescription, setReviewDescription] = useState(existingReview?.reviewDescription || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (existingReview) {
      setStars(existingReview.stars);
      setReviewTitle(existingReview.reviewTitle);
      setReviewDescription(existingReview.reviewDescription);
    }
  }, [existingReview]);

  const handleStarClick = (starValue) => {
    setStars(starValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user || !token) {
      toast.error('Please login to submit a review');
      return;
    }

    if (stars === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (!reviewTitle.trim()) {
      toast.error('Please enter a review title');
      return;
    }

    if (!reviewDescription.trim()) {
      toast.error('Please enter a review description');
      return;
    }

    setIsSubmitting(true);

    try {
      const reviewData = {
        productId,
        stars,
        reviewTitle: reviewTitle.trim(),
        reviewDescription: reviewDescription.trim()
      };

      if (existingReview) {
        // Update existing review
        const result = await ReviewService.updateReview(existingReview._id, reviewData, token);
        toast.success('Review updated successfully!');
        onReviewUpdated && onReviewUpdated(result.review);
        setIsEditing(false);
      } else {
        // Create new review
        const result = await ReviewService.createReview(reviewData, token);
        toast.success('Review submitted successfully!');
        onReviewSubmitted && onReviewSubmitted(result.review);
        
        // Reset form
        setStars(0);
        setReviewTitle('');
        setReviewDescription('');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!existingReview) return;

    if (!confirm('Are you sure you want to delete your review?')) {
      return;
    }

    setIsSubmitting(true);

    try {
      await ReviewService.deleteReview(existingReview._id, token);
      toast.success('Review deleted successfully!');
      onReviewDeleted && onReviewDeleted();
    } catch (error) {
      toast.error(error.message || 'Failed to delete review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (existingReview) {
      setStars(existingReview.stars);
      setReviewTitle(existingReview.reviewTitle);
      setReviewDescription(existingReview.reviewDescription);
    } else {
      setStars(0);
      setReviewTitle('');
      setReviewDescription('');
    }
  };

  if (!user) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Write a Review</h3>
        <p className="text-gray-600">Please login to write a review for this product.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-200 rounded-lg p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {existingReview ? 'Your Review' : 'Write a Review'}
        </h3>
        {existingReview && !isEditing && (
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={isSubmitting}
              className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {existingReview && !isEditing ? (
        // Display existing review
        <div className="space-y-3">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, index) => (
              <StarIcon
                key={index}
                className={`h-5 w-5 ${
                  index < existingReview.stars ? 'text-yellow-400' : 'text-gray-300'
                }`}
              />
            ))}
            <span className="ml-2 text-sm text-gray-600">({existingReview.stars}/5)</span>
          </div>
          <h4 className="font-medium text-gray-900">{existingReview.reviewTitle}</h4>
          <p className="text-gray-700">{existingReview.reviewDescription}</p>
          <p className="text-xs text-gray-500">
            Reviewed on {new Date(existingReview.createdAt).toLocaleDateString()}
          </p>
        </div>
      ) : (
        // Review form
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Star Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating *
            </label>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleStarClick(index + 1)}
                  className="focus:outline-none"
                >
                  {index < stars ? (
                    <StarIcon className="h-6 w-6 text-yellow-400 hover:text-yellow-500 transition-colors" />
                  ) : (
                    <StarIconOutline className="h-6 w-6 text-gray-300 hover:text-yellow-400 transition-colors" />
                  )}
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-600">
                {stars > 0 ? `(${stars}/5)` : '(Click to rate)'}
              </span>
            </div>
          </div>

          {/* Review Title */}
          <div>
            <label htmlFor="reviewTitle" className="block text-sm font-medium text-gray-700 mb-2">
              Review Title *
            </label>
            <input
              type="text"
              id="reviewTitle"
              value={reviewTitle}
              onChange={(e) => setReviewTitle(e.target.value)}
              maxLength={100}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Summarize your experience"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {reviewTitle.length}/100 characters
            </p>
          </div>

          {/* Review Description */}
          <div>
            <label htmlFor="reviewDescription" className="block text-sm font-medium text-gray-700 mb-2">
              Review Description *
            </label>
            <textarea
              id="reviewDescription"
              value={reviewDescription}
              onChange={(e) => setReviewDescription(e.target.value)}
              maxLength={1000}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Share your detailed experience with this product..."
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {reviewDescription.length}/1000 characters
            </p>
          </div>

          {/* Submit/Cancel Buttons */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting || stars === 0}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : (existingReview ? 'Update Review' : 'Submit Review')}
            </button>
            {existingReview && (
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}
    </motion.div>
  );
};

export default ReviewForm; 