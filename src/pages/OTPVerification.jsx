import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import config from '../config/config';

const OTPVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Get phone from location state
    let phoneNumber = '';
    if (location.state?.phone) {
      phoneNumber = location.state.phone;
    } else {
      toast.error('Please complete registration first');
      navigate('/signup');
      return;
    }
    if (phoneNumber) {
      setPhone(phoneNumber);
    }
  }, [location.state, navigate]);

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (!otp || otp.length < 4) {
      const error = 'Please enter a valid OTP';
      setError(error);
      toast.error(error);
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const apiUrl = `${config.API_BASE_URL}/api/msg91/verify-otp`;
      const requestBody = {
        phone: phone,
        otp: otp
      };
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || data.message || `HTTP ${response.status}: OTP verification failed`);
      }
      toast.success('Phone verified! Logging you in...');
      await autoLogin();
    } catch (err) {
      const errorMessage = err.message || 'OTP verification failed. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const autoLogin = async () => {
    try {
      // Get the password from the registration data (we'll need to store it temporarily)
      const registrationData = localStorage.getItem('tempRegistrationData');
      let password = 'defaultPassword123'; // fallback
      let email = '';
      if (registrationData) {
        try {
          const data = JSON.parse(registrationData);
          password = data.password;
          email = data.email || '';
        } catch (e) {}
      }
      // Try to get email from location.state as fallback
      if (!email && location.state?.email) {
        email = location.state.email;
      }
      const loginResponse = await fetch(`${config.API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });
      const loginData = await loginResponse.json();
      if (!loginResponse.ok) {
        throw new Error(loginData.message || 'Auto-login failed');
      }
      // Store the token
      localStorage.setItem('token', loginData.token);
      localStorage.setItem('user', JSON.stringify(loginData.user));
      // Clear temporary registration data
      localStorage.removeItem('tempRegistrationData');
      toast.success('Welcome! You are now logged in.');
      navigate('/');
    } catch (err) {
      toast.error('Registration successful! Please login with your credentials.');
      navigate('/login');
    }
  };

  const handleResendOtp = async () => {
    if (!phone) {
      toast.error('Phone number is required');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const apiUrl = `${config.API_BASE_URL}/api/msg91/send-otp`;
      const requestBody = { phone: phone };
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(requestBody)
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || data.message || 'Failed to resend OTP');
      }
      toast.success('OTP resent to your phone');
      setOtp('');
    } catch (err) {
      const errorMessage = err.message || 'Failed to resend OTP';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToSignup = () => {
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
              Enter the OTP sent to <span className="font-semibold">{phone}</span>
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

          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                Verification Code
              </label>
              <input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="block w-full px-4 py-2.5 border border-gray-300 bg-white placeholder-gray-400 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Enter OTP"
                maxLength={4}
                disabled={isLoading}
              />
              <p className="mt-1 text-xs text-gray-500">
                Enter the 4-digit code sent to your phone
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading || !otp || otp.length < 4}
              className="group relative w-full flex justify-center py-2.5 px-5 border border-transparent text-sm font-medium rounded-md text-white overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ 
                backgroundImage: 'url(/footer.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300"></div>
              <span className="relative z-10 flex items-center justify-center">
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </span>
            </button>

            <button
              type="button"
              onClick={handleResendOtp}
              disabled={isLoading}
              className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
            >
              Resend OTP
            </button>

            <button
              type="button"
              onClick={handleBackToSignup}
              disabled={isLoading}
              className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
            >
              Back to Signup
            </button>
          </form>
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
              Secure verification via phone OTP to protect your account.
            </p>
            <div className="space-y-4 text-left max-w-md mx-auto">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span>Secure phone verification</span>
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
