import React from 'react';
import { Link } from 'react-router-dom';
import { HeartIcon } from '@heroicons/react/24/outline';

const Wishlist = () => {
  return (
    <div className="min-h-screen bg-gray-900 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Link to="/">
            <img src="/logo.png" alt="Volcanic Neon" className="mx-auto h-20 w-auto mb-3" />
          </Link>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">My Wishlist</h2>
        </div>

        <div className="bg-gray-800 shadow-2xl rounded-xl p-8">
          <div className="text-center py-12">
            <HeartIcon className="mx-auto h-12 w-12 text-pink-500 mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">Your wishlist is empty</h3>
            <p className="text-gray-400 mb-6">Add items to your wishlist to save them for later</p>
            <Link
              to="/shop"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;