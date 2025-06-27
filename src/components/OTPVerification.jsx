import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function OTPVerification({ email, onVerify, onResend }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Move to next input
    if (element.value && index < 5) {
      const nextInput = element.parentElement.nextElementSibling?.querySelector('input');
      if (nextInput) {
        nextInput.focus();
      }
    }

    // Submit when all digits are entered
    if (index === 5 && element.value) {
      handleSubmit();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Move to previous input on backspace
      const prevInput = e.target.parentElement.previousElementSibling?.querySelector('input');
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  const handleSubmit = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter all digits');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onVerify(otpString);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await onResend();
      setTimer(60);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <motion.div
      className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6 mt-12"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-2xl font-bold text-center mb-4">Verify Your Email</h2>
      <p className="text-center text-gray-600 mb-6">
        We've sent a verification code to<br />
        <span className="font-medium text-gray-800">{email}</span>
      </p>

      <div className="flex justify-center gap-2 mb-6">
        {otp.map((digit, index) => (
          <div key={index} className="w-12 h-14">
            <input
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e.target, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-full h-full text-center text-2xl font-bold border-2 rounded-lg
                focus:border-blue-500 focus:outline-none"
            />
          </div>
        ))}
      </div>

      {error && (
        <p className="text-red-500 text-center mb-4">{error}</p>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading || otp.join('').length !== 6}
        className="w-full p-3 rounded bg-blue-600 text-white font-medium
          hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50
          disabled:cursor-not-allowed mb-4"
      >
        {loading ? 'Verifying...' : 'Verify OTP'}
      </button>

      <div className="text-center">
        <p className="text-gray-600 mb-2">
          Didn't receive the code?
        </p>
        {timer > 0 ? (
          <p className="text-gray-500">
            Resend code in {timer} seconds
          </p>
        ) : (
          <button
            onClick={handleResend}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Resend Code
          </button>
        )}
      </div>
    </motion.div>
  );
} 