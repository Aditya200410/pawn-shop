import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HeartIcon, ShoppingCartIcon, ShareIcon, StarIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { products } from '../data/products';
import MostLoved from '../components/Products/MostLoved';
import WeeklyBestsellers from '../components/Products/WeeklyBestsellers';

const ProductView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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

  // Find the product from the products array
  const product = products.find(p => p.id === parseInt(id));

  // If product not found, redirect to shop page
  useEffect(() => {
    if (!product) {
      navigate('/shop');
    }
  }, [product, navigate]);

  if (!product) {
    return null;
  }

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

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <a href="/" className="hover:text-amber-800">Home</a>
            <span>/</span>
            <a href="/shop" className="hover:text-amber-800">Shop</a>
            <span>/</span>
            <span className="text-gray-900">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Product Images - Left Side */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-50 group">
              <img
                src={productImages[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.outOfStock && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Out of Stock
                </div>
              )}
              
              {/* Navigation Arrows */}
              <button
                onClick={handlePreviousImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                aria-label="Previous image"
              >
                <ChevronLeftIcon className="h-6 w-6" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                aria-label="Next image"
              >
                <ChevronRightIcon className="h-6 w-6" />
              </button>

              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/80 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                {selectedImage + 1} / {productImages.length}
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index ? 'border-orange-600' : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info - Right Side */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-gray-500 text-lg">{product.category}</p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <StarIconSolid
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.popularity) ? 'text-orange-500' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600">({product.popularity} rating)</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-baseline space-x-3">
                <span className="text-4xl font-bold text-orange-600">₹{product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">₹{product.originalPrice.toFixed(2)}</span>
                )}
              </div>
              <p className="text-sm text-gray-500">Inclusive of all taxes</p>
            </div>

            {/* Short Description */}
            <div className="border-t border-gray-200 pt-6">
              <p className="text-gray-600 leading-relaxed text-lg">
                {product.shortDescription}
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="px-4 py-2 text-gray-600 hover:text-orange-600 transition-colors"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                    className="w-16 text-center border-x border-gray-300 py-2 focus:outline-none"
                    min="1"
                  />
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="px-4 py-2 text-gray-600 hover:text-orange-600 transition-colors"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-500">
                  {product.outOfStock ? 'Out of Stock' : 'In Stock'}
                </span>
              </div>

              <div className="flex space-x-4">
                <button 
                  className="flex-1 bg-orange-600 text-white py-4 px-8 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2 text-lg font-medium"
                  disabled={product.outOfStock}
                >
                  <ShoppingCartIcon className="h-6 w-6" />
                  <span>{product.outOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
                </button>
                <button className="p-4 border border-gray-300 rounded-lg hover:border-orange-600 hover:text-orange-600 transition-colors">
                  <HeartIcon className="h-6 w-6" />
                </button>
                <button className="p-4 border border-gray-300 rounded-lg hover:border-orange-600 hover:text-orange-600 transition-colors">
                  <ShareIcon className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Product Information Tabs */}
            <div className="mt-12">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8">
                  <button
                    onClick={() => setActiveTab('description')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'description'
                        ? 'border-orange-600 text-orange-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Description
                  </button>
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'details'
                        ? 'border-orange-600 text-orange-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Product Details
                  </button>
                  <button
                    onClick={() => setActiveTab('specifications')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'specifications'
                        ? 'border-orange-600 text-orange-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Specifications
                  </button>
                </nav>
              </div>

              <div className="py-8">
                {activeTab === 'description' && (
                  <div className="prose prose-lg max-w-none">
                    <p className="text-gray-600 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                )}

                {activeTab === 'details' && (
                  <div className="prose prose-lg max-w-none">
                    <p className="text-gray-600 leading-relaxed">
                      {product.productDetails}
                    </p>
                  </div>
                )}

                {activeTab === 'specifications' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex flex-col">
                        <span className="text-sm text-gray-500 capitalize">{key}</span>
                        <span className="text-gray-900 font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Sections */}
        <div className="mt-24 space-y-24">
          {/* Most Loved Section */}
          <div>
            <MostLoved />
          </div>

          {/* Weekly Bestsellers Section */}
          <div>
            <WeeklyBestsellers />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductView; 