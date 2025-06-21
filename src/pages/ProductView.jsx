import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartIcon, ShoppingCartIcon, ShareIcon, StarIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import MostLoved from '../components/Products/MostLoved';
import WeeklyBestsellers from '../components/Products/WeeklyBestsellers';
import { useCart } from '../context/CartContext';

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
        const res = await fetch('https://pawnbackend-xmqa.onrender.com/api/shop');
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
    product.image,
    product.image,
    product.image,
    product.image,
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
                    alt={`${product.name} ${index + 1}`} 
                    className="w-full h-full object-cover" 
                  />
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Product Info - Right Side */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-7 space-y-8"
          >
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3 font-serif">{product.name}</h1>
              <p className="text-gray-500 text-lg font-medium">{product.category}</p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <StarIconSolid
                    key={i}
                    className={`h-6 w-6 ${
                      i < Math.floor(product.popularity) ? 'text-amber-500' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600 font-medium">({product.popularity} rating)</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-baseline space-x-3">
                <span className="text-4xl font-bold text-amber-600">₹{product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">₹{product.originalPrice.toFixed(2)}</span>
                )}
              </div>
              <p className="text-sm text-gray-500">Inclusive of all taxes</p>
            </div>

            {/* Short Description */}
            <div className="border-t border-gray-100 pt-6">
              <p className="text-gray-600 leading-relaxed text-lg font-serif">
                {product.shortDescription}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden w-fit">
                  <motion.button
                    whileHover={{ backgroundColor: '#FEF3C7' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="px-3 py-2 text-gray-600 hover:text-amber-600 transition-colors"
                  >
                    -
                  </motion.button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                    className="w-12 text-center border-x border-gray-200 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    min="1"
                  />
                  <motion.button
                    whileHover={{ backgroundColor: '#FEF3C7' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="px-3 py-2 text-gray-600 hover:text-amber-600 transition-colors"
                  >
                    +
                  </motion.button>
                </div>
                <span className="text-sm text-gray-500">
                  {product.outOfStock ? 'Out of Stock' : 'In Stock'}
                </span>
              </div>

              <div className="flex space-x-4">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 bg-amber-600 text-white py-4 px-8 rounded-xl hover:bg-amber-700 transition-colors flex items-center justify-center space-x-2 text-lg font-medium disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg"
                  onClick={handleAddToCart}
                  disabled={product.outOfStock}
                >
                  <ShoppingCartIcon className="h-6 w-6" />
                  <span>{product.outOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-4 border border-gray-200 rounded-xl hover:border-amber-600 hover:text-amber-600 transition-colors shadow-md"
                >
                  <HeartIcon className="h-6 w-6" />
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-4 border border-gray-200 rounded-xl hover:border-amber-600 hover:text-amber-600 transition-colors shadow-md"
                >
                  <ShareIcon className="h-6 w-6" />
                </motion.button>
              </div>
            </div>

            {/* Product Information Tabs */}
            <div className="mt-12">
              <div className="border-b border-gray-100">
                <nav className="flex space-x-8">
                  {['description', 'details', 'specifications'].map((tab) => (
                    <motion.button
                      key={tab}
                      whileHover={{ y: -2 }}
                      onClick={() => setActiveTab(tab)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                        activeTab === tab
                          ? 'border-amber-600 text-amber-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab}
                    </motion.button>
                  ))}
                </nav>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="py-8"
                >
                  {activeTab === 'description' && (
                    <div className="prose prose-lg max-w-none">
                      <p className="text-gray-600 leading-relaxed font-serif">
                        {product.description}
                      </p>
                    </div>
                  )}

                  {activeTab === 'details' && (
                    <div className="prose prose-lg max-w-none">
                      <p className="text-gray-600 leading-relaxed font-serif">
                        {product.productDetails}
                      </p>
                    </div>
                  )}

                  {activeTab === 'specifications' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <motion.div 
                          key={key}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex flex-col p-4 bg-white rounded-xl shadow-sm"
                        >
                          <span className="text-sm text-gray-500 capitalize font-medium">{key}</span>
                          <span className="text-gray-900 font-medium">{value}</span>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Additional Sections */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-24 space-y-24"
        >
          {/* Most Loved Section */}
          <div>
            <MostLoved />
          </div>

          {/* Weekly Bestsellers Section */}
          <div>
            <WeeklyBestsellers />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProductView; 