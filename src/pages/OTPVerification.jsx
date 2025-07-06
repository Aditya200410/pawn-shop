import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import OtpWidget from '../components/OtpWidget';
import { toast } from 'react-hot-toast';

const OTPVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [phone, setPhone] = useState('');
  const [showWidget, setShowWidget] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Get registration data from location state or localStorage
  const [registrationData, setRegistrationData] = useState(null);

  useEffect(() => {
    console.log('🔍 OTP Verification Page Loaded');
    console.log('📍 Location state:', location.state);
    
    // Get phone from location state or localStorage
    let phoneNumber = '';
    let userData = null;

    if (location.state?.phone) {
      phoneNumber = location.state.phone;
      console.log('📱 Phone from location state:', phoneNumber);
    } else {
      // Try to get from localStorage
      const storedData = localStorage.getItem('pendingRegistration');
      if (storedData) {
        try {
          userData = JSON.parse(storedData);
          phoneNumber = userData.phone;
          console.log('📱 Phone from localStorage:', phoneNumber);
        } catch (err) {
          console.error('❌ Error parsing stored registration data:', err);
        }
      }
    }

    if (phoneNumber) {
      setPhone(phoneNumber);
      setRegistrationData(userData);
      console.log('✅ Phone number set:', phoneNumber);
    } else {
      console.warn('⚠️ No phone number found, redirecting to signup');
      toast.error('Please complete registration first');
      navigate('/signup');
    }
  }, [location.state, navigate]);

  const handleOtpSuccess = async (msg91Token) => {
    console.log('🎉 OTP Success - Token received:', msg91Token ? '✅' : '❌');
    
    if (!msg91Token) {
      const error = 'No verification token received';
      console.error('❌', error);
      setError(error);
      toast.error(error);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      console.log('📤 Sending registration data to backend...');
      console.log('📋 Registration data:', {
        name: registrationData?.name || 'N/A',
        email: registrationData?.email || 'N/A',
        phone: phone,
        hasPassword: !!registrationData?.password
      });

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register-with-msg91`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: registrationData?.name || 'User',
          email: registrationData?.email || '',
          password: registrationData?.password || 'defaultPassword123',
          phone: phone,
          msg91Token: msg91Token
        })
      });

      console.log('📥 Backend response status:', response.status);
      
      const data = await response.json();
      console.log('📥 Backend response data:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      console.log('✅ Registration successful!');
      toast.success('Registration successful! Please login.');
      
      // Clear stored data
      localStorage.removeItem('pendingRegistration');
      
      // Redirect to login
      navigate('/login');
      
    } catch (err) {
      console.error('❌ Registration error:', err);
      const errorMessage = err.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpFailure = (error) => {
    console.error('❌ MSG91 OTP Failed:', {
      error: error,
      message: error?.message || 'Unknown error',
      code: error?.code || 'No code'
    });
    
    const errorMessage = error?.message || 'OTP verification failed. Please try again.';
    setError(errorMessage);
    toast.error(errorMessage);
  };

  const handleStartVerification = () => {
    console.log('🚀 Starting OTP verification for phone:', phone);
    setError('');
    setShowWidget(true);
  };

  const handleBackToSignup = () => {
    console.log('⬅️ Going back to signup');
    navigate('/signup');
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-start lg:items-center justify-center px-4 sm:px-6 lg:px-8 pt-8 lg:pt-0">
        <div className="w-full max-w-md space-y-5 p-8 sm:p-10 bg-white shadow-2xl rounded-xl border border-gray-100">
          <div className="text-center">
            <img src="/logo.png" alt="Riko Craft" className="mx-auto h-20 w-auto mb-3" />
            <h2 className="text-3xl font-bold tracking-tight text-primary">
              Verify Your Phone
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              We'll send you a verification code to your phone number
            </p>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-3 sm:p-4 ring-1 ring-red-200">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="block w-full px-4 py-2.5 border border-gray-300 bg-white placeholder-gray-400 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Enter phone number"
                disabled={isLoading}
              />
            </div>

            {!showWidget && (
              <button
                onClick={handleStartVerification}
                disabled={isLoading || !phone}
                className="group relative w-full flex justify-center py-2.5 px-5 border border-transparent text-sm font-medium rounded-md text-white overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  backgroundImage: 'url(/footer.png)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300"></div>
                <span className="relative z-10 flex items-center justify-center">
                  {isLoading ? 'Verifying...' : 'Verify with OTP'}
                </span>
              </button>
            )}

            <button
              onClick={handleBackToSignup}
              disabled={isLoading}
              className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
            >
              Back to Signup
            </button>
          </div>

          {showWidget && (
            <div className="mt-6">
              <OtpWidget
                phone={phone}
                onSuccess={handleOtpSuccess}
                onFailure={handleOtpFailure}
              />
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img src="/footer.png" alt="OTP Verification Banner" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-white text-center">
            <h2 className="text-4xl font-light mb-6">
              Verify Your <span className="font-serif italic">Phone</span>
            </h2>
            <p className="text-lg text-gray-100 mb-8">
              Secure verification via SMS OTP to protect your account.
            </p>
            <div className="space-y-4 text-left max-w-md mx-auto">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <span>Secure SMS verification</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span>Instant verification</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span>Protect your account</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
