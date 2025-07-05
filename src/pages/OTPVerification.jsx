import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { loadMSG91Script, initializeMSG91Widget } from '../utils/msg91Loader';

const OTPVerification = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg91Token, setMsg91Token] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { phone, useMsg91 } = location.state || {};
  const email = location.state?.email;

  // MSG91 Configuration for verification
  const msg91VerifyConfig = {
    widgetId: "356765707a68343736313035",
    tokenAuth: "458779TNIVxOl3qDwI6866bc33P1",
    identifier: phone,
    exposeMethods: "true",
    success: (data) => {
      console.log('MSG91 verification success', data);
      // Extract the access token from the response
      const accessToken = data.token || data.access_token || data.accessToken;
      setMsg91Token(accessToken);
      handleMsg91Verification(accessToken);
    },
    failure: (error) => {
      console.log('MSG91 verification failure', error);
      // Use enhanced error message if available
      const errorMessage = error.userMessage || 'OTP verification failed. Please try again.';
      setError(errorMessage);
      setLoading(false);
      
      // Show toast with specific error message
      if (error.code === '408' || error.message?.includes('IPBlocked')) {
        toast.error('MSG91 service temporarily unavailable. Please try again later.');
      } else if (error.code === '401' || error.message?.includes('Unauthorized')) {
        toast.error('Authentication failed. Please contact support.');
      } else {
        toast.error(errorMessage);
      }
    },
  };

  // Load MSG91 script for verification
  useEffect(() => {
    if (useMsg91 && phone) {
      const initializeWidget = async () => {
        try {
          await loadMSG91Script();
          await initializeMSG91Widget(msg91VerifyConfig);
        } catch (error) {
          console.error('MSG91 initialization error:', error);
          setError('MSG91 widget failed to load. Please try again or contact support.');
        }
      };

      initializeWidget();
    }
  }, [useMsg91, phone]);

  // Handle MSG91 verification
  const handleMsg91Verification = async (token) => {
    setLoading(true);
    try {
      const pendingRegistration = JSON.parse(localStorage.getItem('pendingRegistration'));
      if (!pendingRegistration) {
        throw new Error('Registration data not found');
      }

      console.log('Sending MSG91 token to backend:', token);

      // Call backend to complete registration with MSG91 token
      const response = await fetch('https://pawnbackend-xmqa.onrender.com/api/auth/register-with-msg91', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...pendingRegistration,
          msg91Token: token
        }),
      });

      const responseData = await response.json();
      console.log('Backend response:', responseData);

      if (!response.ok) {
        // Handle specific MSG91 error codes
        if (responseData.code === 'MSG91_IP_BLOCKED') {
          throw new Error('MSG91 service temporarily unavailable. Please try again later or contact support.');
        } else if (responseData.code === 'MSG91_AUTH_ERROR') {
          throw new Error('MSG91 authentication failed. Please contact support.');
        } else if (responseData.code === 'MSG91_VERIFICATION_FAILED') {
          throw new Error('OTP verification failed. Please try again.');
        } else {
          throw new Error(responseData.message || 'Registration failed');
        }
      }

      // Clear pending registration data
      localStorage.removeItem('pendingRegistration');
      
      toast.success('Registration successful! Please login.');
      navigate('/login', { state: { message: 'Registration successful! Please login.' } });
    } catch (err) {
      console.error('MSG91 verification error:', err);
      setError(err.message || 'Verification failed');
      toast.error(err.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  // Handle traditional OTP verification
  const handleTraditionalVerification = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const pendingRegistration = JSON.parse(localStorage.getItem('pendingRegistration'));
      if (!pendingRegistration) {
        throw new Error('Registration data not found');
      }

      // For traditional verification, we'll use email OTP or create user directly
      // Since we don't have email OTP set up, we'll create the user directly
      const response = await fetch('https://pawnbackend-xmqa.onrender.com/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pendingRegistration),
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.message || 'Registration failed');
      }

      // Clear pending registration data
      localStorage.removeItem('pendingRegistration');
      
      toast.success('Registration successful! Please login.');
      navigate('/login', { state: { message: 'Registration successful! Please login.' } });
    } catch (err) {
      setError(err.message || 'Verification failed');
      toast.error(err.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  // Redirect if no phone/email provided
  if (!phone && !email) {
    navigate('/signup');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Form */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full lg:w-1/2 flex items-start lg:items-center justify-center px-4 sm:px-6 lg:px-8 pt-8 lg:pt-0"
      >
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="text-4xl font-light tracking-tight text-gray-900 text-center">
              Verify <span className="font-serif italic">Your Phone</span>
            </h2>
            <p className="mt-2 text-sm text-gray-600 text-center">
              {useMsg91 
                ? `Please verify the OTP sent to ${phone}`
                : 'Please complete your registration'
              }
            </p>
            {!useMsg91 && (
              <p className="mt-2 text-center text-xs text-gray-500">
                MSG91 verification is not available. Using traditional registration.
              </p>
            )}
            <p className="mt-2 text-center text-xs text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary hover:text-primary-dark">
                Sign in
              </Link>
            </p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {useMsg91 ? (
            // MSG91 OTP Widget will be rendered here
            <div className="mt-8 space-y-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">
                  Please verify your phone number using the widget below
                </p>
                <div id="msg91-otp-widget" className="min-h-[300px] border-2 border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading MSG91 verification widget...</p>
                    <p className="text-xs text-gray-400 mt-2">If the widget doesn't load, please refresh the page</p>
                  </div>
                </div>
                {/* Fallback button if widget fails */}
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setError('MSG91 widget is not available. Please contact support or try again later.');
                    }}
                    className="text-sm text-gray-500 hover:text-gray-700 underline"
                  >
                    Having trouble with the widget?
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // Traditional registration completion
            <div className="mt-8 space-y-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">
                  Complete your registration by clicking the button below
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="text-center">
                    <div className="text-blue-600 mb-2">
                      <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-blue-800 font-medium">Registration Ready</p>
                    <p className="text-blue-600 text-sm mt-1">Your account will be created without phone verification</p>
                  </div>
                </div>
              </div>
              
              <form onSubmit={handleTraditionalVerification}>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-white overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ 
                    backgroundImage: 'url(/footer.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300"></div>
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3 z-10">
                    <svg className="h-5 w-5 text-white/80 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                  <span className="relative z-10">
                    {loading ? 'Creating Account...' : 'Complete Registration'}
                  </span>
                </button>
              </form>
            </div>
          )}
        </div>
      </motion.div>

      {/* Mobile Content Section */}
      <div className="lg:hidden w-full bg-gray-50 py-12 px-4">
        <div className="max-w-md mx-auto">
          <h3 className="text-2xl font-semibold text-gray-900 text-center mb-8">
            Secure Phone Verification
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Secure</h4>
              <p className="text-sm text-gray-600">Phone verification for safety</p>
            </div>
            {/* Add more features if needed */}
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="hidden lg:block lg:w-1/2 relative"
      >
        <img src="/footer.png" alt="OTP Verification Banner" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-white text-center">
            <h2 className="text-4xl font-light mb-6">
              Secure <span className="font-serif italic">Phone Verification</span>
            </h2>
            <p className="text-lg text-gray-100 mb-8">
              Verify your phone number to complete your registration and access our platform.
            </p>
            <div className="space-y-4 text-left max-w-md mx-auto">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>Instant OTP verification via SMS</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>Secure and encrypted verification process</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>Protect your account with phone verification</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>Quick and user-friendly verification</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default OTPVerification;