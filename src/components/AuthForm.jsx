import React, { useState } from "react";
import { motion } from "framer-motion";
import OTPVerification from "./OTPVerification";
import { authService } from "../services/authService";

export default function AuthForm({ fields, handleChange, handleSubmit, loading, buttonText, isRegister }) {
  const [showOTP, setShowOTP] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isRegister) {
        // Get email from fields
        const emailField = fields.find(f => f.name === 'email');
        if (emailField) {
          setEmail(emailField.value);
        }

        // Call register endpoint
        const response = await handleSubmit(e);
        if (response) {
          setShowOTP(true);
        }
      } else {
        // Normal login flow
        await handleSubmit(e);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleVerifyOTP = async (otp) => {
    try {
      const response = await authService.verifyOTP(email, otp);
      // Handle successful verification (usually handled by auth context)
      if (response.token) {
        localStorage.setItem('token', response.token);
        window.location.reload();
      }
    } catch (err) {
      throw err;
    }
  };

  const handleResendOTP = async () => {
    try {
      await authService.resendOTP(email);
    } catch (err) {
      throw err;
    }
  };

  if (showOTP) {
    return (
      <OTPVerification
        email={email}
        onVerify={handleVerifyOTP}
        onResend={handleResendOTP}
      />
    );
  }

  return (
    <motion.div
      className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6 mt-12"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-2xl font-bold text-center mb-4">
        {isRegister ? 'Sign Up' : 'Login'}
      </h2>
      {error && (
        <p className="text-red-500 text-center mb-4">{error}</p>
      )}
      <form onSubmit={handleFormSubmit} className="space-y-4">
        {fields.map((field, index) => (
          <input
            key={index}
            type={field.type}
            name={field.name}
            placeholder={field.placeholder}
            value={field.value}
            required={field.required}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:border-blue-500 focus:outline-none"
          />
        ))}
        <button
          type="submit"
          disabled={loading}
          className="w-full p-2 rounded relative overflow-hidden group"
          style={{ 
            backgroundImage: 'url(/footer.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300"></div>
          <span className="relative z-10 text-white font-medium">
            {loading ? 'Loading...' : buttonText}
          </span>
        </button>
      </form>
    </motion.div>
  );
}
