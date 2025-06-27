import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import OTPVerificationComponent from '../components/OTPVerification';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function OTPVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const email = location.state?.email;

  useEffect(() => {
    // If no email in state, redirect to signup
    if (!email) {
      navigate('/signup', { replace: true });
    }
  }, [email, navigate]);

  const handleVerify = async (otp) => {
    try {
      const response = await authService.verifyOTP(email, otp);
      if (response.token) {
        // Log the user in
        await login(response.token);
        toast.success('Account verified successfully!');
        navigate('/', { replace: true });
      }
    } catch (error) {
      toast.error(error.message || 'Verification failed');
      throw error;
    }
  };

  const handleResend = async () => {
    try {
      await authService.resendOTP(email);
      toast.success('OTP resent successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to resend OTP');
      throw error;
    }
  };

  if (!email) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <OTPVerificationComponent
        email={email}
        onVerify={handleVerify}
        onResend={handleResend}
      />
    </div>
  );
} 