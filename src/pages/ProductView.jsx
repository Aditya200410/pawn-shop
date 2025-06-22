import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartIcon, ShoppingCartIcon, ShareIcon, StarIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import MostLoved from '../components/Products/MostLoved';
import WeeklyBestsellers from '../components/Products/WeeklyBestsellers';
import { useCart } from '../context/CartContext';
import config from '../config/config.js';

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

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(config.API_URLS.SHOP);
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        const found = data.find(p => String(p.id) === String(id));
        setProduct(found);
        if (!found) navigate('/shop');
      } catch (err) {
        setProduct(null);
        navigate('/shop');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  if (loading) return <div>Loading...</div>;
  if (!product) return null;

  // Generate multiple images for the product (in a real app, these would come from the backend)
  const productImages = [
    config.fixImageUrl(product.image),
    config.fixImageUrl(product.image),
    config.fixImageUrl(product.image),
    config.fixImageUrl(product.image),
  ];

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

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
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
                  className="w-full h-full object-cover"
                  onError={e => {
                    e.target.onerror = null;
                    e.target.src = 'https://placehold.co/600x600/e2e8f0/475569?text=Product+Image';
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
                className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-full text-sm font-medium shadow-lg"
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
                  <span className="ml-2 text-sm text-gray-600">
                    {averageRating.toFixed(1)} ({reviews.length} reviews)
                  </span>
                </div>
              </div>
            </div>

            {/* Price Section */}
            <div className="space-y-4">
              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-bold text-gray-900">
                  ₹{product.price.toFixed(2)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className="text-2xl text-gray-400 line-through">
                      ₹{product.originalPrice.toFixed(2)}
                    </span>
                    <span className="px-3 py-1 bg-red-100 text-red-600 text-sm font-medium rounded-full">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>
              
              {product.originalPrice && product.originalPrice > product.price && (
                <p className="text-sm text-gray-600">
                  You save ₹{(product.originalPrice - product.price).toFixed(2)}
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
                {product.font && (
                  <div>
                    <span className="text-sm text-gray-500">Font</span>
                    <p className="font-medium">{product.font}</p>
                  </div>
                )}
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
                  className={`flex-1 flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all ${
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
                  className="p-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <HeartIcon className="h-5 w-5 text-gray-600" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
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
              {[
                { id: 'description', label: 'Description' },
                { id: 'reviews', label: `Reviews (${reviews.length})` },
                { id: 'shipping', label: 'Shipping & Returns' },
              ].map((tab) => (
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
                        <li>• Handcrafted with premium materials</li>
                        <li>• Traditional Indian craftsmanship</li>
                        <li>• Unique design elements</li>
                        <li>• Perfect for home decoration</li>
                      </ul>
                    </div>
                    
                    <div className="bg-gray-50 p-6 rounded-xl">
                      <h4 className="font-semibold text-gray-900 mb-3">Care Instructions</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li>• Dust regularly with a soft cloth</li>
                        <li>• Keep away from direct sunlight</li>
                        <li>• Avoid exposure to moisture</li>
                        <li>• Handle with care</li>
                      </ul>
                    </div>
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
                  className="space-y-8"
                >
                  {/* Review Form */}
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h4 className="font-semibold text-gray-900 mb-4">Write a Review</h4>
                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Your Name"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                          required
                        />
                        <input
                          type="email"
                          placeholder="Your Email"
                          value={userEmail}
                          onChange={(e) => setUserEmail(e.target.value)}
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setUserRating(star)}
                              className="text-2xl"
                            >
                              <StarIconSolid
                                className={`h-6 w-6 ${
                                  star <= userRating ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <textarea
                        placeholder="Write your review..."
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                        required
                      />
                      
                      <button
                        type="submit"
                        className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                      >
                        Submit Review
                      </button>
                    </form>
                  </div>

                  {/* Reviews List */}
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-200 pb-6">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-semibold text-gray-900">{review.name}</h5>
                          <span className="text-sm text-gray-500">{review.date}</span>
                        </div>
                        <div className="flex items-center gap-1 mb-3">
                          {[...Array(5)].map((_, i) => (
                            <StarIconSolid
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-gray-700">{review.text}</p>
                      </div>
                    ))}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MostLoved />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductView; 