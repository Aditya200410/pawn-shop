import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HeartIcon, ShoppingCartIcon, ShareIcon, StarIcon, ChevronLeftIcon, ChevronRightIcon, XMarkIcon,
  DocumentTextIcon, CogIcon, TruckIcon 
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import MostLoved from '../components/Products/MostLoved';
import WeeklyBestsellers from '../components/Products/WeeklyBestsellers';
import { useCart } from '../context/CartContext';
import config from '../config/config.js';
import { toast } from 'react-hot-toast';
import Loader from '../components/Loader';

const ProductView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [modalSelectedImage, setModalSelectedImage] = useState(0);
  const [reviews, setReviews] = useState([
    {
      id: 1,
      name: 'John Doe',
      rating: 5,
      date: '2024-03-15',
      text: 'Excellent product quality and craftsmanship. The attention to detail is remarkable.',
    },
    {
      id: 2,
      name: 'Jane Smith',
      rating: 4,
      date: '2024-03-10',
      text: 'Beautiful design and very comfortable. Would recommend to others.',
    },
  ]);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const tabs = [
    { id: 'description', label: 'Description', icon: DocumentTextIcon },
    { id: 'specifications', label: 'Specifications', icon: CogIcon },
  
    { id: 'shipping', label: 'Shipping & Returns', icon: TruckIcon },
  ];

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        
        // Try fetching from each collection until we find the product
        const endpoints = [
          `${config.API_URLS.PRODUCTS}/${id}`,
          `${config.API_URLS.LOVED}/${id}`,
          `${config.API_URLS.BESTSELLER}/${id}`,
          `${config.API_URLS.FEATURED_PRODUCTS}/${id}`
        ];

        let foundProduct = null;
        let fetchError = null;

        for (const endpoint of endpoints) {
          try {
            console.log('Trying endpoint:', endpoint);
            const response = await fetch(endpoint);
            const data = await response.json();
            
            // Check for both the new MongoDB format and old format
            if (response.ok) {
              // Try to get the product from the response
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
                console.log('Found product:', foundProduct);
                break;
              }
            }
          } catch (error) {
            fetchError = error;
            console.log(`Error fetching from ${endpoint}:`, error);
          }
        }

        if (!foundProduct) {
          throw new Error(fetchError || 'Product not found in any collection');
        }

        setProduct(foundProduct);
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to load product details');
        // Don't navigate away, let user try again or navigate manually
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) return <Loader />;
  if (!product) return null;

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
      
      // Debug logging
      console.log('Product:', product.name);
      console.log('Original images array:', product.images);
      console.log('Valid images after filtering:', validImages);
      console.log('Using images array:', validImages.length > 0);
      console.log('Fallback image would be:', config.fixImageUrl(product.image));
      
      // If we have valid images, use them; otherwise fallback to single image
      if (validImages.length > 0) {
        console.log('✅ Using images array for:', product.name);
        return validImages;
      }
    }
    
    // Debug logging for fallback case
    console.log('Product:', product.name);
    console.log('No valid images array, using fallback image:', product.image);
    console.log('❌ Using fallback image for:', product.name);
    
    // Use the single image field as fallback
    const fallbackImage = config.fixImageUrl(product.image);
    return [fallbackImage];
  })();

  // Debug logging to check images
  console.log('Product:', product.name);
  console.log('Product images array:', product.images);
  console.log('Processed productImages:', productImages);

  const handleQuantityChange = (value) => {
    if (value >= 1) {
      setQuantity(value);
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    const newReview = {
      id: reviews.length + 1,
      name: userName,
      rating: userRating,
      date: new Date().toISOString().split('T')[0],
      text: reviewText,
    };
    setReviews([newReview, ...reviews]);
    setUserRating(0);
    setReviewText('');
    setUserName('');
    setUserEmail('');
  };

  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

  const handlePreviousImage = () => {
    setSelectedImage((prev) => (prev === 0 ? productImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImage((prev) => (prev === productImages.length - 1 ? 0 : prev + 1));
  };

  const handleAddToCart = async () => {
    try {
      const productId = product._id || product.id;
      if (!productId) {
        console.error('Product ID is missing');
        toast.error('Failed to add item to cart');
        return;
      }
      await addToCart(productId, quantity);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  const handleShare = async () => {
    try {
      const currentUrl = window.location.href;
      await navigator.clipboard.writeText(currentUrl);
      toast.success('Product link copied to clipboard! Ready to share.');
    } catch (err) {
      // Fallback for older browsers or when clipboard API is not available
      const textArea = document.createElement('textarea');
      textArea.value = window.location.href;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        toast.success('Product link copied to clipboard! Ready to share.');
      } catch (fallbackErr) {
        toast.error('Failed to copy link. Please copy manually.');
      }
      document.body.removeChild(textArea);
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
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <a href="/" className="hover:text-amber-800 transition-colors">Home</a>
            <span>/</span>
            <a href="/shop" className="hover:text-amber-800 transition-colors">Shop</a>
            <span>/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Product Images - Left Side */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 group shadow-lg">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  src={productImages[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={handleImageClick}
                  onError={e => {
                    console.log('Image failed to load:', productImages[selectedImage]);
                    e.target.onerror = null;
                    // Try fallback to product.image if different from current image
                    if (productImages[selectedImage] !== config.fixImageUrl(product.image)) {
                      e.target.src = config.fixImageUrl(product.image);
                    } else {
                      // Final fallback to placeholder
                      e.target.src = 'https://placehold.co/600x600/e2e8f0/475569?text=Product+Image';
                    }
                  }}
                />
              </AnimatePresence>
              {product.outOfStock && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg"
                >
                  Out of Stock
                </motion.div>
              )}
              
              {/* Navigation Arrows */}
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                whileHover={{ x: -5 }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                onClick={handlePreviousImage}
                aria-label="Previous image"
              >
                <ChevronLeftIcon className="h-6 w-6" />
              </motion.button>
              <motion.button
                initial={{ opacity: 0, x: 10 }}
                whileHover={{ x: 5 }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                onClick={handleNextImage}
                aria-label="Next image"
              >
                <ChevronRightIcon className="h-6 w-6" />
              </motion.button>

              {/* Image Counter */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-4 left-0 right-0 mx-auto w-fit bg-white/90 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-full text-sm font-medium shadow-lg"
              >
                {selectedImage + 1} / {productImages.length}
              </motion.div>
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              {productImages.map((image, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === index 
                      ? 'border-amber-600 shadow-lg' 
                      : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img 
                    src={image} 
                    alt={`${product.name} - Image ${index + 1}`}
                    className="w-full h-full object-cover" 
                    onError={e => {
                      e.target.onerror = null;
                      e.target.src = 'https://placehold.co/150x150/e2e8f0/475569?text=Image';
                    }}
                  />
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Product Details - Right Side */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-7 space-y-8"
          >
            {/* Product Header */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 bg-amber-100 text-amber-800 text-sm font-medium rounded-full">
                  {product.category}
                </span>
                {product.isNew && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                    New Arrival
                  </span>
                )}
            </div>

              <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <StarIconSolid
                    key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(averageRating) ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
                </div>
                {/* Show average rating as a number with one decimal */}
                <span className="text-gray-700 font-medium text-lg">{Number(averageRating).toFixed(1)}</span>
              </div>
            </div>

            {/* Price Section */}
            <div className="space-y-4">
              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-bold text-gray-900">
                  ₹{product.price.toFixed(2)}
                </span>
                {product.regularPrice && product.regularPrice > product.price && (
                  <>
                    <span className="text-2xl text-gray-400 line-through">
                      ₹{product.regularPrice.toFixed(2)}
                    </span>
                    <span className="px-3 py-1 bg-red-100 text-red-600 text-sm font-medium rounded-full">
                      {Math.round(((product.regularPrice - product.price) / product.regularPrice) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>
              
              {product.regularPrice && product.regularPrice > product.price && (
                <p className="text-sm text-gray-600">
                  You save ₹{(product.regularPrice - product.price).toFixed(2)}
                </p>
              )}
            </div>

            {/* Product Description */}
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
              
              {/* Product Details */}
              <div className="grid grid-cols-2 gap-4 py-4 border-t border-gray-100">
                <div>
                  <span className="text-sm text-gray-500">Color</span>
                  <p className="font-medium">{product.color}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Size</span>
                  <p className="font-medium">{product.size}</p>
                </div>
               
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700">Quantity:</label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="px-3 py-2 hover:bg-gray-100 transition-colors"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="px-3 py-2 hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-4">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  disabled={product.outOfStock}
                  className={`flex-1 flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold transition-all ${
                    product.outOfStock
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-amber-600 text-white hover:bg-amber-700 shadow-lg hover:shadow-xl'
                  }`}
                >
                  <ShoppingCartIcon className="h-5 w-5" />
                  {product.outOfStock ? 'Out of Stock' : 'Add to Cart'}
                </motion.button>
                
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-4 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                >
                  <HeartIcon className="h-5 w-5 text-gray-600" />
                </motion.button>
                
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-4 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                  onClick={handleShare}
                >
                  <ShareIcon className="h-5 w-5 text-gray-600" />
                </motion.button>
              </div>
            </div>
          </motion.div>
            </div>

        {/* Product Tabs */}
        <div className="mt-16">
          <div className="border-b border-gray-200">
                <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                          ? 'border-amber-600 text-amber-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                  {tab.label}
                </button>
                  ))}
                </nav>
              </div>

          <div className="py-8">
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
                  <p className="text-gray-700 leading-relaxed">
                        {product.description}
                      </p>
                  
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-6 rounded-xl">
                      <h4 className="font-semibold text-gray-900 mb-3">Features</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li>• Material: {product.material || 'N/A'}</li>
                        <li>• Weight: {product.weight || 'N/A'}</li>
                        <li>• Utility: {product.utility || 'N/A'}</li>
                        <li>• Traditional Indian craftsmanship</li>
                      </ul>
                    </div>
                    
                    <div className="bg-gray-50 p-6 rounded-xl">
                      <h4 className="font-semibold text-gray-900 mb-3">Care Instructions</h4>
                      <p className="text-gray-700 whitespace-pre-line">
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
                  className="space-y-8"
                >
                  {/* Basic Information */}
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h4 className="font-semibold text-gray-900 mb-4">Basic Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     
                      <div>
                        <span className="text-sm text-gray-500">Product Name</span>
                        <p className="font-medium text-gray-900">{product.name}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Category</span>
                        <p className="font-medium text-gray-900">{product.category}</p>
                      </div>
                      <div>
                        
                      </div>
                     
                    </div>
                  </div>

                  {/* Pricing Information */}
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h4 className="font-semibold text-gray-900 mb-4">Pricing Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <span className="text-sm text-gray-500">Current Price</span>
                        <p className="font-bold text-2xl text-gray-900">₹{product.price?.toFixed(2) || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Regular Price</span>
                        <p className="font-medium text-lg text-gray-600 line-through">₹{product.regularPrice?.toFixed(2) || 'N/A'}</p>
                      </div>
                      {product.regularPrice && product.regularPrice > product.price && (
                        <div>
                          <span className="text-sm text-gray-500">Discount</span>
                          <p className="font-medium text-lg text-red-600">
                            {Math.round(((product.regularPrice - product.price) / product.regularPrice) * 100)}% OFF
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Physical Specifications */}
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h4 className="font-semibold text-gray-900 mb-4">Physical Specifications</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-500">Material</span>
                        <p className="font-medium text-gray-900">{product.material || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Size</span>
                        <p className="font-medium text-gray-900">{product.size || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Colour</span>
                        <p className="font-medium text-gray-900">{product.colour || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Weight</span>
                        <p className="font-medium text-gray-900">{product.weight || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h4 className="font-semibold text-gray-900 mb-4">Additional Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-500">Utility</span>
                        <p className="font-medium text-gray-900">{product.utility || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Care Instructions</span>
                        <p className="font-medium text-gray-900">{product.care || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Stock Information */}
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h4 className="font-semibold text-gray-900 mb-4">Stock Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-500">Stock Status</span>
                        <div className="flex items-center gap-2">
                          {product.inStock ? (
                            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                              In Stock
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
                              Out of Stock
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                       </div>
                    </div>
                  </div>

                  {/* Product Description */}
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h4 className="font-semibold text-gray-900 mb-4">Product Description</h4>
                    <p className="text-gray-700 leading-relaxed">{product.description || 'No description available.'}</p>
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
                  className="grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Shipping Information</h4>
                    <ul className="space-y-3 text-gray-700">
                      <li>• Free shipping on orders above ₹2000</li>
                      <li>• Standard delivery: 3-5 business days</li>
                      <li>• Express delivery: 1-2 business days</li>
                      <li>• International shipping available</li>
                      <li>• Tracking number provided</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Return Policy</h4>
                    <ul className="space-y-3 text-gray-700">
                      <li>• 30-day return policy</li>
                      <li>• Must be in original condition</li>
                      <li>• Return shipping costs apply</li>
                      <li>• Refund processed within 5-7 days</li>
                      <li>• Contact customer service for returns</li>
                    </ul>
                    </div>
                </motion.div>
              )}
              </AnimatePresence>
            </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">You Might Also Like</h3>
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
              <div className="relative">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={modalSelectedImage}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.3 }}
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
                </AnimatePresence>

                {/* Navigation Arrows */}
                {productImages.length > 1 && (
                  <>
                    <button
                      onClick={handleModalPreviousImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-4 rounded-full transition-all duration-200"
                      aria-label="Previous image"
                    >
                      <ChevronLeftIcon className="h-8 w-8" />
                    </button>
                    <button
                      onClick={handleModalNextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-4 rounded-full transition-all duration-200"
                      aria-label="Next image"
                    >
                      <ChevronRightIcon className="h-8 w-8" />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                {productImages.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
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
                        className="w-full h-full object-cover"
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
    </motion.div>
  );
};

export default ProductView; 