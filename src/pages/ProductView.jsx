import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HeartIcon, ShoppingCartIcon, ShareIcon, StarIcon, ChevronLeftIcon, ChevronRightIcon, XMarkIcon,
  DocumentTextIcon, CogIcon, TruckIcon, ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import MostLoved from '../components/Products/MostLoved';
import WeeklyBestsellers from '../components/Products/WeeklyBestsellers';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import config from '../config/config.js';
import { toast } from 'react-hot-toast';
import Loader from '../components/Loader';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';
import ReviewService from '../services/reviewService';

const ProductView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [modalSelectedImage, setModalSelectedImage] = useState(0);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState(null);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const { user } = useAuth();
  const token = localStorage.getItem('token');
  const [isEditingReview, setIsEditingReview] = useState(false);
  const [error, setError] = useState(null);

  const tabs = [
    { id: 'description', label: 'Description', icon: DocumentTextIcon },
    { id: 'specifications', label: 'Specifications', icon: CogIcon },
    { id: 'shipping', label: 'Shipping', icon: TruckIcon },
    { id: 'reviews', label: 'Reviews', icon: ChatBubbleLeftRightIcon },
  ];

  // Load reviews for the product
  const loadReviews = async () => {
    if (!product?._id) return;
    
    setReviewsLoading(true);
    try {
      const reviewsData = await ReviewService.getProductReviews(product._id);
      setReviews(reviewsData.reviews || []);
      
      // Check if current user has reviewed this product
      if (user && user.email) {
        try {
          const userReviewData = await ReviewService.getUserReview(product._id, user.email);
          setUserReview(userReviewData);
        } catch (error) {
          // User hasn't reviewed this product
          setUserReview(null);
        }
      } else {
        setUserReview(null);
      }
    } catch (error) {
      toast.error('Failed to load reviews');
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try fetching from each collection until we find the product
        const endpoints = [
          `${config.API_URLS.SHOP}/${id}`, // Try shop first (most reliable)
          `${config.API_URLS.PRODUCTS}/${id}`, // Then products endpoint
          `${config.API_URLS.LOVED}/${id}`,
          `${config.API_URLS.BESTSELLER}/${id}`,
          `${config.API_URLS.FEATURED_PRODUCTS}/${id}`
        ];

        let foundProduct = null;
        let fetchError = null;

        for (const endpoint of endpoints) {
          try {
            const response = await fetch(endpoint);
            
            if (!response.ok) {
              continue;
            }
            
            const data = await response.json();
            
            // Check for both the new MongoDB format and old format
            foundProduct = data.product || // New MongoDB format
                         (Array.isArray(data.products) ? data.products[0] : null) || // Array format
                         (data._id ? data : null); // Direct object format
            
            if (foundProduct) {
              // Ensure consistent ID field
              foundProduct = {
                ...foundProduct,
                id: foundProduct._id || foundProduct.id,
                // Ensure price and regularPrice are numbers
                price: parseFloat(foundProduct.price) || 0,
                regularPrice: parseFloat(foundProduct.regularPrice) || 0,
                // Ensure images array exists
                images: foundProduct.images || [foundProduct.image],
              };
              break;
            }
          } catch (error) {
            fetchError = error;
          }
        }

        if (!foundProduct) {
          throw new Error(fetchError || 'Product not found in any collection');
        }

        setProduct(foundProduct);
      } catch (error) {
        setError(error.message || 'Failed to load product details');
        toast.error('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Load reviews when product is loaded or user changes
  useEffect(() => {
    if (product?._id) {
      loadReviews();
    }
  }, [product?._id, user?.email]);

  // Keyboard navigation for image gallery - MUST be before any conditional returns
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!product) return;
      
      // Get product images dynamically to avoid initialization issues
      const images = product.images && Array.isArray(product.images) && product.images.length > 0
        ? product.images
            .filter(img => {
              if (!img || typeof img !== 'string') return false;
              const ext = img.toLowerCase().split('.').pop();
              return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
            })
            .map(img => config.fixImageUrl(img))
        : [config.fixImageUrl(product.image)];
      
      if (images.length <= 1) return;
      
      if (e.key === 'ArrowLeft') {
        setSelectedImage(prev => prev === 0 ? images.length - 1 : prev - 1);
      } else if (e.key === 'ArrowRight') {
        setSelectedImage(prev => prev === images.length - 1 ? 0 : prev + 1);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [product]);

  if (loading) return <Loader fullScreen={true} withHeaderFooter={true} size="large" text="Loading product details..."  />;
  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h2 className="text-2xl font-bold text-red-600 mb-2">Product Not Found</h2>
      <p className="text-gray-700 mb-4">{error}</p>
      <button onClick={() => window.location.href = '/shop'} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Back to Shop</button>
    </div>
  );
  if (!product) return null;

  // Consistent out-of-stock logic
  const isOutOfStock = product.outOfStock === true || product.inStock === false;

  // Use product.images array if available, otherwise fallback to single image
  const productImages = (() => {
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      // Filter out any non-image files and empty/undefined strings, and map to fixed URLs
      const validImages = product.images
        .filter(img => {
          if (!img || typeof img !== 'string') return false;
          const ext = img.toLowerCase().split('.').pop();
          return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
        })
        .map(img => config.fixImageUrl(img));
      
      // If we have valid images, use them; otherwise fallback to single image
      if (validImages.length > 0) {
        return validImages;
      }
    }
    
    // Use the single image field as fallback
    const fallbackImage = config.fixImageUrl(product.image);
    return [fallbackImage];
  })();

  const handleQuantityChange = (value) => {
    if (value >= 1) {
      setQuantity(value);
    }
  };

  // Calculate average rating
  const averageRating = reviews.length > 0 
    ? reviews.reduce((acc, review) => acc + review.stars, 0) / reviews.length 
    : 0;

  // Handle review submission
  const handleReviewSubmitted = (newReview) => {
    setReviews(prev => [newReview, ...prev]);
    setUserReview(newReview);
  };

  // Handle review update
  const handleReviewUpdated = (updatedReview) => {
    setReviews(prev => prev.map(review => 
      review._id === updatedReview._id ? updatedReview : review
    ));
    setUserReview(updatedReview);
  };

  // Handle review deletion
  const handleReviewDeleted = () => {
    setUserReview(null);
    // Reload all reviews to get updated counts
    loadReviews();
  };

  const handlePreviousImage = () => {
    setSelectedImage((prev) => (prev === 0 ? productImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImage((prev) => (prev === productImages.length - 1 ? 0 : prev + 1));
  };

  const handleAddToCart = async () => {
    try {
      await addToCart(product, quantity);
      toast.success('Added to cart successfully!');
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  const handleShare = async () => {
    setIsShareModalOpen(true);
  };

  const handleShareOption = async (option) => {
    try {
      const shareData = {
        title: product.name,
        text: `Check out this amazing product: ${product.name}`,
        url: window.location.href,
      };

      switch (option) {
        case 'native':
          if (navigator.share) {
            await navigator.share(shareData);
          } else {
            await navigator.clipboard.writeText(window.location.href);
            toast.success('Link copied to clipboard!');
          }
          break;
        case 'whatsapp':
          const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareData.text} ${shareData.url}`)}`;
          window.open(whatsappUrl, '_blank');
          break;
        case 'facebook':
          const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}`;
          window.open(facebookUrl, '_blank');
          break;
        case 'twitter':
          const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(shareData.url)}`;
          window.open(twitterUrl, '_blank');
          break;
        case 'copy':
          await navigator.clipboard.writeText(window.location.href);
          toast.success('Link copied to clipboard!');
          break;
        default:
          break;
      }
      setIsShareModalOpen(false);
    } catch (error) {
      toast.error('Failed to share product');
      setIsShareModalOpen(false);
    }
  };

  const handleImageClick = () => {
    setModalSelectedImage(selectedImage);
    setIsImageModalOpen(true);
  };

  const handleModalPreviousImage = () => {
    setModalSelectedImage((prev) => (prev === 0 ? productImages.length - 1 : prev - 1));
  };

  const handleModalNextImage = () => {
    setModalSelectedImage((prev) => (prev === productImages.length - 1 ? 0 : prev + 1));
  };

  const handleModalClose = () => {
    setIsImageModalOpen(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-white to-gray-50"
    >
      {/* Breadcrumb */}
      <div className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <a href="/" className="hover:text-pink-800 transition-colors">Home</a>
            <span>/</span>
            <a href="/shop" className="hover:text-pink-800 transition-colors">Shop</a>
            <span>/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-start">
          {/* Product Images - Left Side */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 space-y-3 lg:space-y-4 flex flex-col"
          >
            <div className="relative w-full flex items-center justify-center rounded-xl overflow-hidden bg-gray-50 group shadow-lg" style={{ maxHeight: '60vh' }}>
              <img
                src={productImages[selectedImage]}
                alt={product.name}
                className="max-w-full max-h-[60vh] object-contain"
                onClick={handleImageClick}
                onError={e => {
                  e.target.onerror = null;
                  if (productImages[selectedImage] !== config.fixImageUrl(product.image)) {
                    e.target.src = config.fixImageUrl(product.image);
                  } else {
                    e.target.src = 'https://placehold.co/600x600/e2e8f0/475569?text=Product+Image';
                  }
                }}
              />
              
              {/* Gallery indicator overlay */}
              {productImages.length > 1 && (
                <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium">
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                    {productImages.length} photos
                  </span>
                </div>
              )}
              {isOutOfStock && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-red-500 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-medium shadow-lg z-20"
                >
                  Out of Stock
                </motion.div>
              )}
              
              {/* Navigation Arrows - Always Visible */}
              {productImages.length > 1 && (
                <>
                  <motion.button
                    initial={{ opacity: 0, x: -10 }}
                    whileHover={{ x: -5, scale: 1.1 }}
                    className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-[#8f3a61] p-3 sm:p-4 rounded-full shadow-lg transition-all opacity-100 focus:opacity-100 z-10 border-2 border-[#8f3a61]/30 backdrop-blur-sm"
                    onClick={handlePreviousImage}
                    aria-label="Previous image"
                  >
                    <ChevronLeftIcon className="h-6 w-6 sm:h-7 sm:w-7" />
                  </motion.button>
                  <motion.button
                    initial={{ opacity: 0, x: 10 }}
                    whileHover={{ x: 5, scale: 1.1 }}
                    className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-[#8f3a61] p-3 sm:p-4 rounded-full shadow-lg transition-all opacity-100 focus:opacity-100 z-10 border-2 border-[#8f3a61]/30 backdrop-blur-sm"
                    onClick={handleNextImage}
                    aria-label="Next image"
                  >
                    <ChevronRightIcon className="h-6 w-6 sm:h-7 sm:w-7" />
                  </motion.button>
                </>
              )}

              {/* Image Counter */}
              {productImages.length > 1 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-2 sm:bottom-3 left-0 right-0 mx-auto w-fit bg-black/50 backdrop-blur-sm text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-medium shadow-lg"
                >
                  {selectedImage + 1} / {productImages.length}
                </motion.div>
              )}
            </div>
            
            {productImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {productImages.map((image, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all relative ${
                      selectedImage === index 
                        ? 'border-[#8f3a61] shadow-lg' 
                        : 'border-transparent hover:border-[#8f3a61]/30'
                    }`}
                  >
                    <img 
                      src={image} 
                      alt={`${product.name} - Image ${index + 1}`}
                      className="w-full h-full object-fit bg-white" 
                      onError={e => {
                        e.target.onerror = null;
                        e.target.src = 'https://placehold.co/150x150/e2e8f0/475569?text=Image';
                      }}
                    />
                    {selectedImage === index && (
                      <div className="absolute inset-0 bg-[#8f3a61]/20 flex items-center justify-center">
                        <div className="w-2 h-2 bg-[#8f3a61] rounded-full"></div>
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Details - Right Side */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-7 space-y-4 lg:space-y-6 flex flex-col justify-start"
          >
            {/* Product Header */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="px-2 py-1 bg-pink text-pink-800 text-xs font-medium rounded-full">
                  {product.category}
                </span>
                {product.isNew && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    New Arrival
                  </span>
                )}
                {typeof product.codAvailable !== 'undefined' && (
                  product.codAvailable ? (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      COD Available
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs font-medium rounded-full">
                      COD Not Available
                    </span>
                  )
                )}
              </div>

              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Rating Display */}
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, index) => (
                    <StarIcon
                      key={index}
                      className={`h-4 w-4 ${
                        index < Math.floor(averageRating) ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-xs text-gray-600">
                    {averageRating > 0 ? `${averageRating.toFixed(1)} (${reviews.length} reviews)` : 'No reviews yet'}
                  </span>
                </div>

                {/* Stock Available Indicator */}
                {typeof product.stock === 'number' ? (
                  product.stock > 0 ? (
                    <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-full">
                      {product.stock} in stock
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-red-700 bg-red-100 px-2 py-1 rounded-full">
                      Out of Stock
                    </span>
                  )
                ) : (
                  <span className="text-xs font-semibold text-gray-500">Stock unknown</span>
                )}
              </div>
            </div>

            {/* Price Section */}
            <div className="space-y-2 sm:space-y-3">
              <div className="flex flex-wrap items-baseline gap-2 sm:gap-3">
                <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                  ₹{product.price.toFixed(2)}
                </span>
                {product.regularPrice && product.regularPrice > product.price && (
                  <>
                    <span className="text-lg sm:text-xl text-gray-400 line-through">
                      ₹{product.regularPrice.toFixed(2)}
                    </span>
                    <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full">
                      {Math.round(((product.regularPrice - product.price) / product.regularPrice) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>
              
              {product.regularPrice && product.regularPrice > product.price && (
                <p className="text-xs text-gray-600">
                  You save ₹{(product.regularPrice - product.price).toFixed(2)}
                </p>
              )}
            </div>

            {/* Product Description */}
            <div className="space-y-3">
              <p className="text-sm text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Quantity, Add to Cart, and Share in One Line */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-gray-700">Qty:</label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="px-2 py-2 hover:bg-gray-100 transition-colors"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-3 py-2 border-x border-gray-300 text-sm">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="px-2 py-2 hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                disabled={typeof product.stock === 'number' ? product.stock <= 0 : isOutOfStock}
                className={`w-36 sm:w-36 flex items-center justify-center gap-2 px-4 py-4 rounded-full font-semibold transition-all text-sm ${
                  typeof product.stock === 'number'
                    ? (product.stock <= 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-[#8f3a61] text-white hover:bg-[#8f3a61] shadow-lg hover:shadow-xl')
                    : (isOutOfStock
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-[#8f3a61] text-white hover:bg-[#8f3a61] shadow-lg hover:shadow-xl')
                }`}
              >
                <ShoppingCartIcon className="h-4 w-6 sm:h-5 sm:w-5" />
                {typeof product.stock === 'number'
                  ? (product.stock <= 0 ? 'Out of Stock' : 'Add to Cart')
                  : (isOutOfStock ? 'Out of Stock' : 'Add to Cart')}
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-3 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                onClick={handleShare}
              >
                <ShareIcon className="h-4 w-4 text-gray-600" />
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Product Tabs */}
        <div className="mt-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-pink-600 text-pink-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-6">
            <AnimatePresence mode="wait">
              {activeTab === 'description' && (
                <motion.div
                  key="description"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="prose max-w-none"
                >
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {product.description}
                  </p>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2 text-sm">Features</h4>
                      <ul className="space-y-1 text-xs text-gray-700">
                        <li>• Material: {product.material || 'N/A'}</li>
                        <li>• Weight: {product.weight || 'N/A'}</li>
                        <li>• Utility: {product.utility || 'N/A'}</li>
                        <li>• Traditional Indian craftsmanship</li>
                      </ul>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2 text-sm">Care Instructions</h4>
                      <p className="text-xs text-gray-700 whitespace-pre-line">
                        {product.care || 'Care instructions not available'}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'specifications' && (
                <motion.div 
                  key="specifications"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {/* Basic Information */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3 text-sm">Basic Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <span className="text-xs text-gray-500">Product Name</span>
                        <p className="text-sm font-medium text-gray-900">{product.name}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">Category</span>
                        <p className="text-sm font-medium text-gray-900">{product.category}</p>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Information */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3 text-sm">Pricing Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <span className="text-xs text-gray-500">Current Price</span>
                        <p className="font-bold text-lg text-gray-900">₹{product.price?.toFixed(2) || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">Regular Price</span>
                        <p className="font-medium text-base text-gray-600 line-through">₹{product.regularPrice?.toFixed(2) || 'N/A'}</p>
                      </div>
                      {product.regularPrice && product.regularPrice > product.price && (
                        <div>
                          <span className="text-xs text-gray-500">Discount</span>
                          <p className="font-medium text-base text-red-600">
                            {Math.round(((product.regularPrice - product.price) / product.regularPrice) * 100)}% OFF
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Physical Specifications */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3 text-sm">Physical Specifications</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <span className="text-xs text-gray-500">Material</span>
                        <p className="text-sm font-medium text-gray-900">{product.material || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">Size</span>
                        <p className="text-sm font-medium text-gray-900">{product.size || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">Colour</span>
                        <p className="text-sm font-medium text-gray-900">{product.colour || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">Weight</span>
                        <p className="text-sm font-medium text-gray-900">{product.weight || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3 text-sm">Additional Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <span className="text-xs text-gray-500">Utility</span>
                        <p className="text-sm font-medium text-gray-900">{product.utility || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">Care Instructions</span>
                        <p className="text-sm font-medium text-gray-900">{product.care || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Stock Information */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3 text-sm">Stock Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <span className="text-xs text-gray-500">Stock Status</span>
                        <div className="flex items-center gap-2">
                          {product.inStock ? (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                              In Stock
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                              Out of Stock
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Product Description */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3 text-sm">Product Description</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">{product.description || 'No description available.'}</p>
                  </div>
                </motion.div>
              )}

              {activeTab === 'shipping' && (
                <motion.div
                  key="shipping"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 text-sm">Shipping Information</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li>• Free shipping on orders above ₹2000</li>
                      <li>• Standard delivery: 3-5 business days</li>
                      <li>• Express delivery: 1-2 business days</li>
                      <li>• International shipping available</li>
                      <li>• Tracking number provided</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 text-sm">Return Policy</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li>• 30-day return policy</li>
                      <li>• Must be in original condition</li>
                      <li>• Return shipping costs apply</li>
                      <li>• Refund processed within 5-7 days</li>
                      <li>• Contact customer service for returns</li>
                    </ul>
                  </div>
                </motion.div>
              )}

              {activeTab === 'reviews' && (
                <motion.div
                  key="reviews"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {reviewsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                      <span className="ml-2 text-gray-600">Loading reviews...</span>
                    </div>
                  ) : (
                    <>
                      {/* Review Form */}
                      <ReviewForm
                        productId={product._id}
                        existingReview={userReview}
                        isEditing={isEditingReview}
                        onStartEdit={() => setIsEditingReview(true)}
                        onCancelEdit={() => setIsEditingReview(false)}
                        onReviewSubmitted={(review) => {
                          handleReviewSubmitted(review);
                          setIsEditingReview(false);
                        }}
                        onReviewUpdated={(review) => {
                          handleReviewUpdated(review);
                          setIsEditingReview(false);
                        }}
                        onReviewDeleted={() => {
                          handleReviewDeleted();
                          setIsEditingReview(false);
                        }}
                      />

                      {/* Review List */}
                      <ReviewList
                        reviews={reviews}
                        averageRating={averageRating}
                        totalReviews={reviews.length}
                      />
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">You Might Also Like</h3>
          <div>
            <MostLoved />
          </div>
        </div>
      </div>

      {/* Full Size Image Modal */}
      <AnimatePresence>
        {isImageModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleModalClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-7xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={handleModalClose}
                className="absolute top-4 right-4 z-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-200"
                aria-label="Close modal"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>

              {/* Main Image */}
              <div className="relative w-full flex items-center justify-center" style={{ maxHeight: '90vh' }}>
                <img
                  src={productImages[modalSelectedImage]}
                  alt={`${product.name} - Full size view`}
                  className="max-w-full max-h-[90vh] object-contain rounded-lg"
                  onError={e => {
                    e.target.onerror = null;
                    if (productImages[modalSelectedImage] !== config.fixImageUrl(product.image)) {
                      e.target.src = config.fixImageUrl(product.image);
                    } else {
                      e.target.src = 'https://placehold.co/800x600/e2e8f0/475569?text=Product+Image';
                    }
                  }}
                />

                {/* Navigation Arrows */}
                {productImages.length > 1 && (
                  <>
                    <button
                      onClick={handleModalPreviousImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white text-[#8f3a61] p-4 rounded-full transition-all duration-200 shadow-lg border-2 border-[#8f3a61]/30"
                      aria-label="Previous image"
                    >
                      <ChevronLeftIcon className="h-8 w-8" />
                    </button>
                    <button
                      onClick={handleModalNextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white text-[#8f3a61] p-4 rounded-full transition-all duration-200 shadow-lg border-2 border-[#8f3a61]/30"
                      aria-label="Next image"
                    >
                      <ChevronRightIcon className="h-8 w-8" />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                {productImages.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                    {modalSelectedImage + 1} / {productImages.length}
                  </div>
                )}
              </div>

              {/* Thumbnail Navigation */}
              {productImages.length > 1 && (
                <div className="mt-4 flex justify-center gap-2">
                  {productImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setModalSelectedImage(index)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        modalSelectedImage === index 
                          ? 'border-white shadow-lg' 
                          : 'border-white/30 hover:border-white/60'
                      }`}
                    >
                      <img 
                        src={image} 
                        alt={`${product.name} - Thumbnail ${index + 1}`}
                        className="w-full h-full object-fit bg-white"
                        onError={e => {
                          e.target.onerror = null;
                          e.target.src = 'https://placehold.co/64x64/e2e8f0/475569?text=Image';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Modal */}
      <AnimatePresence>
        {isShareModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsShareModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Share Product</h3>
                <button
                  onClick={() => setIsShareModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <XMarkIcon className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {/* Share Options */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  {/* Native Share */}
                  <button
                    onClick={() => handleShareOption('native')}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                      <ShareIcon className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Share</span>
                  </button>

                  {/* WhatsApp */}
                  <button
                    onClick={() => handleShareOption('whatsapp')}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700">WhatsApp</span>
                  </button>

                  {/* Facebook */}
                  <button
                    onClick={() => handleShareOption('facebook')}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                      <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700">Facebook</span>
                  </button>

                  {/* Twitter */}
                  <button
                    onClick={() => handleShareOption('twitter')}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center">
                      <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700">Twitter</span>
                  </button>

                  {/* Copy Link */}
                  <button
                    onClick={() => handleShareOption('copy')}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-12 h-12 bg-gray-500 rounded-full flex items-center justify-center">
                      <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700">Copy Link</span>
                  </button>

                  {/* Cancel */}
                  <button
                    onClick={() => setIsShareModalOpen(false)}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                      <XMarkIcon className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Cancel</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProductView; 