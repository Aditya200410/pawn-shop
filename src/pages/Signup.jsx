import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlusIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      toast.error('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      await signup(formData.name, formData.email, formData.password);
      toast.success(`Welcome to Neon Light, ${formData.name}!`);
      navigate('/account');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while creating your account');
      toast.error(err.response?.data?.message || 'An error occurred while creating your account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 py-16 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-5 p-8 sm:p-10 bg-gray-800 shadow-2xl rounded-xl">
        <div className="text-center">
          <Link to="/">
            <img src="/logo.png" alt="Volcanic Neon" className="mx-auto h-20 w-auto mb-3" />
          </Link>
          <h2 className="text-center text-3xl font-bold tracking-tight text-white">
            Create your account
          </h2>
        </div>
        <form className="mt-5 space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-500/20 p-3 sm:p-4 ring-1 ring-red-500/50">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-300">{error}</h3>
                </div>
              </div>
            </div>
          )}
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="name" className="sr-only">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="appearance-none relative block w-full px-4 py-2.5 border border-gray-700 bg-gray-700 placeholder-gray-400 text-white rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full px-4 py-2.5 border border-gray-700 bg-gray-700 placeholder-gray-400 text-white rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none relative block w-full px-4 py-2.5 border border-gray-700 bg-gray-700 placeholder-gray-400 text-white rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none relative block w-full px-4 py-2.5 border border-gray-700 bg-gray-700 placeholder-gray-400 text-white rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="text-sm text-center mt-1 mb-2">
            <Link to="/login" className="font-medium text-pink-500 hover:text-pink-400">
              Already have an account? Sign in
            </Link>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-2.5 px-5 border border-transparent text-sm font-medium rounded-md text-white ${ 
                isLoading 
                  ? 'bg-pink-400/50 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-pink-500 transition-all duration-150 ease-in-out`}
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <UserPlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              )}
              {isLoading ? 'Creating account...' : 'Sign up'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;