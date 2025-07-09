import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import config from '../config/config';

const Signup = () => {
  const navigate = useNavigate();
  const { register, completeRegistrationAfterOtp, error: contextError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [otpSuccess, setOtpSuccess] = useState("");
  const [registrationData, setRegistrationData] = useState(null);
  const [otpWidgetShown, setOtpWidgetShown] = useState(false); // NEW
  const widgetScriptLoaded = useRef(false);

  useEffect(() => {
    // Dynamically load MSG91 widget script once
    if (!widgetScriptLoaded.current) {
      const script = document.createElement('script');
      script.src = 'https://verify.msg91.com/otp-provider.js';
      script.async = true;
      script.onload = () => {
        widgetScriptLoaded.current = true;
      };
      document.body.appendChild(script);
    }
  }, []);

  // Show OTP widget as soon as phone is valid and widget not shown
  useEffect(() => {
    if (
      phone.match(/^\d{12}$/) &&
      !otpVerified &&
      !otpWidgetShown &&
      widgetScriptLoaded.current
    ) {
      triggerOtpWidget();
      setOtpWidgetShown(true);
    }
    // Reset widget shown if phone changes to invalid
    if (!phone.match(/^\d{12}$/) && otpWidgetShown) {
      setOtpWidgetShown(false);
    }
  }, [phone, otpVerified, otpWidgetShown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      const error = 'Passwords do not match';
      setError(error);
      setIsLoading(false);
      return;
    }

    // Require 12 digits (country code + number)
    if (!phone.match(/^\d{12}$/)) {
      const error = 'Please enter your full 12-digit phone number with country code (e.g., 91XXXXXXXXXX)';
      setError(error);
      setIsLoading(false);
      return;
    }

    if (!otpVerified) {
      setError('Please verify your phone number with OTP before signing up.');
      setIsLoading(false);
      return;
    }

    // Do not register here; registration is now handled after OTP verification
    setIsLoading(false);
  };

  const triggerOtpWidget = () => {
    setOtpError("");
    setOtpSuccess("");
    setOtpLoading(true);
    
    if (!window.initSendOTP) {
      setOtpError("OTP widget not loaded. Please try again.");
      setOtpLoading(false);
      return;
    }

    const configuration = {
      widgetId: "3567686d316c363335313136",
      tokenAuth: "458779TNIVxOl3qDwI6866bc33P1",
      identifier: phone,
      success: async (data) => {
        setOtpVerified(true);
        setOtpSuccess("Phone verified successfully!");
        setOtpLoading(false);

        // Send the access token to the backend for verification
        const accessToken = data['access-token'] || data.accessToken || data.token;
        if (accessToken) {
          fetch('/api/msg91/verify-otp-access-token', {
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
            },
            body: JSON.stringify({
              accessToken
            })
          })
          .then(response => response.json())
          .then(async json => {
            console.log('Backend verification result:', json);
            // If backend verification is successful, register the user
            if (json && (json.status === 'success' || json.valid || json.verified)) {
              try {
                setIsLoading(true);
                await register({
                  name: formData.name,
                  email: formData.email,
                  password: formData.password,
                  phone: phone,
                });
                // Immediately log in the user after registration
                const loginResult = await completeRegistrationAfterOtp({
                  email: formData.email,
                  password: formData.password,
                });
                toast.success(`Welcome, ${loginResult.user?.name || formData.name}!`);
                navigate('/');
              } catch (err) {
                const errorMessage = err.message || contextError || 'Failed to create account';
                setError(errorMessage);
              } finally {
                setIsLoading(false);
              }
            } else {
              setError('OTP verification failed on server. Please try again.');
            }
          })
          .catch(err => {
            console.error('Backend verification failed:', err);
            setError('OTP verification failed on server. Please try again.');
          });
        }
      },
      failure: (error) => {
        setOtpError(error?.message || "OTP verification failed");
        setOtpVerified(false);
        setOtpLoading(false);
      },
    };
    window.initSendOTP(configuration);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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
            <h2 className="text-4xl font-light tracking-tight text-gray-900">
              Create <span className="font-serif italic">Account</span>
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary hover:text-primary-dark">
                Sign in
              </Link>
            </p>
          </div>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          {otpError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{otpError}</span>
            </div>
          )}
          {otpSuccess && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{otpSuccess}</span>
            </div>
          )}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-500 focus:outline-none"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-gray-400 hover:text-gray-500 focus:outline-none"
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    pattern="[0-9]{12}"
                    className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                    placeholder="Phone Number (e.g., 91XXXXXXXXXX)"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    disabled={isLoading || otpVerified}
                  />
                </div>
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-white overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  backgroundImage: 'url(/footer.png)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
                disabled={isLoading || otpLoading}
              >
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300"></div>
                <span className="absolute left-0 inset-y-0 flex items-center pl-3 z-10">
                  <ArrowRight className="h-5 w-5 text-white/80 group-hover:text-white" />
                </span>
                <span className="relative z-10">
                  {isLoading || otpLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {otpLoading ? 'Verifying OTP...' : 'Creating Account...'}
                    </span>
                  ) : (
                    'Create Account'
                  )}
                </span>
              </button>
            </div>
          </form>
        </div>
      </motion.div>

      {/* Right Side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img src="/footer.png" alt="Signup Banner" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-white text-center">
            <h2 className="text-4xl font-light mb-6">
              Join <span className="font-serif italic">Riko Craft</span>
            </h2>
            <p className="text-lg text-gray-100 mb-8">
              Create your account and discover amazing handmade products.
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span>Quick and easy setup</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span>Access to exclusive products</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;