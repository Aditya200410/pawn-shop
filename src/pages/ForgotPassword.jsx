import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { PaperAirplaneIcon, ArrowLeftIcon } from '@heroicons/react/24/solid';
import { toast } from 'react-hot-toast';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: email, 2: otp+new password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);
    try {
      const response = await authService.forgotPassword(email);
      setMessage(response.message);
      toast.success('OTP sent to your email');
      setStep(2);
    } catch (err) {
      const errorMessage = err.message || 'An error occurred. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);
    try {
      const response = await authService.verifyForgotOtp(email, otp, newPassword);
      setMessage(response.message);
      toast.success('Password reset successful!');
      setStep(3);
    } catch (err) {
      const errorMessage = err.message || 'An error occurred. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-5 p-8 sm:p-10 bg-white shadow-2xl rounded-xl border border-gray-100">
        <div className="text-center">
          <Link to="/">
            <img src="/logo.png" alt="Riko Craft" className="mx-auto h-20 w-auto mb-3" />
          </Link>
          <h2 className="text-3xl font-bold tracking-tight text-primary">
            Reset Your Password
          </h2>
          {step === 1 && (
            <p className="mt-2 text-sm text-gray-600">
              Enter your email address and we'll send you an OTP to reset your password.
            </p>
          )}
        </div>

        {message && (
          <div className="rounded-md bg-green-50 p-3 sm:p-4 ring-1 ring-green-200">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">{message}</h3>
              </div>
            </div>
          </div>
        )}
        {error && (
          <div className="rounded-md bg-red-50 p-3 sm:p-4 ring-1 ring-red-200">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <form className="mt-5 space-y-5" onSubmit={handleSendOtp}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="sr-only">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full px-4 py-2.5 border border-gray-300 bg-white placeholder-gray-400 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2.5 px-5 border border-transparent text-sm font-medium rounded-md text-white overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  backgroundImage: 'url(/footer.png)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300"></div>
                <span className="relative z-10 flex items-center justify-center">
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <PaperAirplaneIcon className="h-5 w-5 text-white mr-2" aria-hidden="true" />
                      Send OTP
                    </span>
                  )}
                </span>
              </button>
            </div>
          </form>
        )}

        {step === 2 && (
          <form className="mt-5 space-y-5" onSubmit={handleVerifyOtp}>
            <div className="space-y-4">
              <div>
                <label htmlFor="otp" className="sr-only">OTP</label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  className="block w-full px-4 py-2.5 border border-gray-300 bg-white placeholder-gray-400 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="Enter OTP from email"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="newPassword" className="sr-only">New Password</label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  required
                  className="block w-full px-4 py-2.5 border border-gray-300 bg-white placeholder-gray-400 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2.5 px-5 border border-transparent text-sm font-medium rounded-md text-white overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  backgroundImage: 'url(/footer.png)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300"></div>
                <span className="relative z-10 flex items-center justify-center">
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Verifying...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <PaperAirplaneIcon className="h-5 w-5 text-white mr-2" aria-hidden="true" />
                      Set New Password
                    </span>
                  )}
                </span>
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <div className="text-center mt-5">
            <p className="text-lg text-green-700 font-semibold mb-4">Password reset successful!</p>
            <Link to="/login" className="font-medium text-primary hover:text-primary-dark flex items-center justify-center">
              <ArrowLeftIcon className="mr-1 h-4 w-4" />
              Back to Sign In
            </Link>
          </div>
        )}

        <div className="text-sm text-center mt-4">
          <Link to="/login" className="font-medium text-primary hover:text-primary-dark flex items-center justify-center">
            <ArrowLeftIcon className="mr-1 h-4 w-4" />
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
