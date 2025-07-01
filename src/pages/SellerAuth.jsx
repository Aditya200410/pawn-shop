import React, { useState } from 'react';
import { useSeller } from '../context/SellerContext';
import { useNavigate } from 'react-router-dom';

const SellerAuth = () => {
  const { login, register, loading, error } = useSeller();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    businessName: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    businessType: '',
    accountHolderName: '',
    bankAccountNumber: '',
    ifscCode: '',
    bankName: ''
  });
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    // Trim all fields to avoid whitespace issues
    const trimmedForm = Object.fromEntries(
      Object.entries(form).map(([k, v]) => [k, typeof v === 'string' ? v.trim() : v])
    );
    console.log('Submitting seller registration/login:', trimmedForm);
    if (isLogin) {
      const res = await login(trimmedForm.email, trimmedForm.password);
      if (res.success) navigate('/seller/profile');
      else console.error('Login failed:', res);
    } else {
      const res = await register(trimmedForm);
      if (res.success) navigate('/seller/profile');
      else console.error('Registration failed:', res);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">{isLogin ? 'Seller Login' : 'Seller Registration'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <input name="businessName" placeholder="Business Name" value={form.businessName} onChange={handleChange} className="w-full px-3 py-2 border rounded" required />
              <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} className="w-full px-3 py-2 border rounded" required />
              <input name="address" placeholder="Address" value={form.address} onChange={handleChange} className="w-full px-3 py-2 border rounded" required />
              <input name="businessType" placeholder="Business Type" value={form.businessType} onChange={handleChange} className="w-full px-3 py-2 border rounded" required />
              <input name="accountHolderName" placeholder="Account Holder Name" value={form.accountHolderName} onChange={handleChange} className="w-full px-3 py-2 border rounded" required />
              <input name="bankAccountNumber" placeholder="Bank Account Number" value={form.bankAccountNumber} onChange={handleChange} className="w-full px-3 py-2 border rounded" required />
              <input name="ifscCode" placeholder="IFSC Code" value={form.ifscCode} onChange={handleChange} className="w-full px-3 py-2 border rounded" required />
              <input name="bankName" placeholder="Bank Name" value={form.bankName} onChange={handleChange} className="w-full px-3 py-2 border rounded" required />
            </>
          )}
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full px-3 py-2 border rounded" required />
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} className="w-full px-3 py-2 border rounded" required />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button type="submit" className="w-full bg-pink-500 text-white py-2 rounded hover:bg-pink-600 transition" disabled={loading}>
            {loading ? 'Please wait...' : isLogin ? 'Login' : 'Register'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <button onClick={() => setIsLogin(!isLogin)} className="text-pink-600 hover:underline">
            {isLogin ? 'New seller? Register here' : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerAuth; 