import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HeartIcon, ShoppingCartIcon, ShareIcon, StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { products } from '../data/products';

const ProductView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

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

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-lg overflow-hidden">
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
              </div>
              <div className="grid grid-cols-4 gap-4">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-amber-800' : 'border-transparent'
                    }`}
                  >
                    <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <p className="text-gray-500">{product.category}</p>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarIconSolid
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.popularity) ? 'text-amber-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">({product.popularity} rating)</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-baseline space-x-3">
                  <span className="text-3xl font-bold text-amber-800">₹{product.price.toFixed(2)}</span>
                </div>
                <p className="text-sm text-gray-500">Inclusive of all taxes</p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Description</h3>
                <p className="text-gray-600">
                  Experience the perfect blend of traditional craftsmanship and modern design with our {product.name}. 
                  This exquisite piece is crafted with attention to detail and premium materials, making it a perfect 
                  addition to your home decor collection.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Specifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Category</span>
                    <span className="text-gray-900">{product.category}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Subcategory</span>
                    <span className="text-gray-900">{product.subcategory}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Date Added</span>
                    <span className="text-gray-900">{new Date(product.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Availability</span>
                    <span className="text-gray-900">{product.outOfStock ? 'Out of Stock' : 'In Stock'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      className="px-4 py-2 text-gray-600 hover:text-amber-800"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                      className="w-16 text-center border-x border-gray-300 py-2"
                      min="1"
                    />
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      className="px-4 py-2 text-gray-600 hover:text-amber-800"
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
                    className="flex-1 bg-amber-800 text-white py-3 px-6 rounded-lg hover:bg-amber-900 transition-colors flex items-center justify-center space-x-2"
                    disabled={product.outOfStock}
                  >
                    <ShoppingCartIcon className="h-5 w-5" />
                    <span>{product.outOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
                  </button>
                  <button className="p-3 border border-gray-300 rounded-lg hover:border-amber-800 hover:text-amber-800 transition-colors">
                    <HeartIcon className="h-5 w-5" />
                  </button>
                  <button className="p-3 border border-gray-300 rounded-lg hover:border-amber-800 hover:text-amber-800 transition-colors">
                    <ShareIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductView; 