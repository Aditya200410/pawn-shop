import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { PaperAirplaneIcon, ArrowLeftIcon } from '@heroicons/react/24/solid';
import { toast } from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const response = await authAPI.forgotPassword({ email });
      setMessage(response.data.message);
      toast.success('Password reset link sent to your email');
      setIsSubmitted(true);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'An error occurred. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black py-16 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-5 p-8 sm:p-10 bg-gray-900 shadow-2xl rounded-xl">
        <div className="text-center">
          <Link to="/">
            <img src="/logo.png" alt="Volcanic Neon" className="mx-auto h-20 w-auto mb-3" />
          </Link>
          <h2 className="text-3xl font-bold tracking-tight text-lime-400">
            Reset Your Password
          </h2>
          {!isSubmitted && (
            <p className="mt-2 text-sm text-lime-200">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          )}
        </div>

        {message && (
          <div className="rounded-md bg-lime-500/20 p-3 sm:p-4 ring-1 ring-lime-500/50">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-lime-300">{message}</h3>
              </div>
            </div>
          </div>
        )}
        {error && (
          <div className="rounded-md bg-red-500/20 p-3 sm:p-4 ring-1 ring-red-500/50">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-300">{error}</h3>
              </div>
            </div>
          </div>
        )}

        {!isSubmitted ? (
          <form className="mt-5 space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="sr-only">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full px-4 py-2.5 border border-gray-700 bg-gray-800 placeholder-gray-400 text-lime-300 rounded-md focus:outline-none focus:ring-lime-400 focus:border-lime-400 sm:text-sm"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2.5 px-5 border border-transparent text-sm font-medium rounded-md text-black bg-gradient-to-r from-lime-400 to-lime-300 hover:from-lime-300 hover:to-lime-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-lime-400 transition-all duration-150 ease-in-out"
              >
                <PaperAirplaneIcon className="-ml-1 mr-2 h-5 w-5 text-black" aria-hidden="true" />
                Send Reset Link
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center mt-5">
            <p className="text-sm text-lime-200">
              If you don't see the email, check your spam folder or{' '}
              <button
                onClick={() => { setIsSubmitted(false); setMessage(''); setError(''); }}
                className="font-medium text-lime-400 hover:text-lime-300"
              >
                try again
              </button>
              .
            </p>
          </div>
        )}

        <div className="text-sm text-center mt-4">
          <Link to="/login" className="font-medium text-lime-400 hover:text-lime-300 flex items-center justify-center">
            <ArrowLeftIcon className="mr-1 h-4 w-4" />
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
