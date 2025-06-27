import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import OTPVerificationComponent from '../components/OTPVerification';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

export default function OTPVerification() {
  const navigate = useNavigate();
  const location = useLocation();
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
      if (response.success) {
        toast.success('Account verified successfully! Please login to continue.');
        navigate('/login', { 
          state: { 
            email,
            verified: true,
            message: 'Account verified successfully! Please login to continue.'
          },
          replace: true
        });
      } else {
        throw new Error('Verification failed. Please try again.');
      }
    } catch (error) {
      toast.error(error.message || 'Verification failed');
      throw error;
    }
  };

  const handleResend = async () => {
    try {
      await authService.resendOTP(email);
      toast.success('New OTP has been sent to your email');
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
      <div className="max-w-md w-full mx-auto space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify Your Email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We've sent a verification code to<br/>
            <span className="font-medium text-indigo-600">{email}</span>
          </p>
        </div>

        <OTPVerificationComponent
          email={email}
          onVerify={handleVerify}
          onResend={handleResend}
        />
      </div>
    </div>
  );
} 