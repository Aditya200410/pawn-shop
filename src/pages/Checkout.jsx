import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ArrowLeft, CreditCard, Lock, MapPin, Phone, User, Mail, Building, Truck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import orderService from '../services/orderService';
import { toast } from 'react-hot-toast';
import config from '../config/config.js';
import apiService from '../services/api';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice, clearCart, getItemImage } = useCart();
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState('shipping');
  const [formData, setFormData] = useState({
    // Shipping Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    
    // Billing Information
    billingSameAsShipping: true,
    billingFirstName: '',
    billingLastName: '',
    billingEmail: '',
    billingPhone: '',
    billingAddress: '',
    billingCity: '',
    billingState: '',
    billingZipCode: '',
    billingCountry: 'India',
    
    // Payment Information
    paymentMethod: 'credit',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCVC: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Pre-fill form with user data if logged in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName || user.name?.split(' ')[0] || '',
        lastName: user.lastName || user.name?.split(' ').slice(1).join(' ') || '',
        email: user.email || '',
        phone: user.phone || '',
      }));
    }
  }, [user]);

  // Copy shipping address to billing when checkbox is checked
  useEffect(() => {
    if (formData.billingSameAsShipping) {
      setFormData(prev => ({
        ...prev,
        billingFirstName: prev.firstName,
        billingLastName: prev.lastName,
        billingEmail: prev.email,
        billingPhone: prev.phone,
        billingAddress: prev.address,
        billingCity: prev.city,
        billingState: prev.state,
        billingZipCode: prev.zipCode,
        billingCountry: prev.country,
      }));
    }
  }, [formData.billingSameAsShipping, formData.firstName, formData.lastName, formData.email, formData.phone, formData.address, formData.city, formData.state, formData.zipCode, formData.country]);

  const validateForm = () => {
    const errors = {};
    
    // Shipping information validation
    const shippingFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode'];
    shippingFields.forEach(field => {
      if (!formData[field] || formData[field].trim() === '') {
        errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });

    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Phone validation
    if (formData.phone && !/^\d{10,}$/.test(formData.phone.replace(/\D/g, ''))) {
      errors.phone = 'Please enter a valid phone number (at least 10 digits)';
    }

    // Payment method validation
    if (formData.paymentMethod === 'credit') {
      const paymentFields = ['cardNumber', 'cardName', 'cardExpiry', 'cardCVC'];
      paymentFields.forEach(field => {
        if (!formData[field] || formData[field].trim() === '') {
          errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')} is required`;
        }
      });

      // Card number validation
      if (formData.cardNumber && !/^\d{13,19}$/.test(formData.cardNumber.replace(/\D/g, ''))) {
        errors.cardNumber = 'Please enter a valid card number';
      }

      // CVC validation
      if (formData.cardCVC && !/^\d{3,4}$/.test(formData.cardCVC)) {
        errors.cardCVC = 'Please enter a valid CVC (3-4 digits)';
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Basic validation
    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      setLoading(false);
      return;
    }

    // Validate form fields
    if (!validateForm()) {
      setError("Please fill in all required fields correctly.");
      setLoading(false);
      return;
    }

    const orderData = {
      customerName: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      pincode: formData.zipCode,
      country: formData.country,
      items: cartItems.map(item => ({
        productId: item.product?._id || item.id,
        name: item.product?.name || item.name,
        quantity: item.quantity,
        price: item.product?.price || item.price,
        image: getItemImage(item)
      })),
      totalAmount: getTotalPrice(),
      paymentMethod: formData.paymentMethod,
      paymentStatus: formData.paymentMethod === 'cod' ? 'Pending' : 'Processing',
    };
    
    try {
      const response = await orderService.createOrder(orderData);

      if (response.success) {
        toast.success('Order placed successfully!');
        clearCart(); // Clear cart on successful order
        navigate('/account?tab=orders');
      } else {
        setError(response.message || "Failed to create order. Please try again.");
        toast.error(response.message || "Failed to create order.");
      }
    } catch (err) {
      const errorMessage = err.message || "An error occurred while placing your order. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Order submission error:", err);
    } finally {
      setLoading(false);
    }
  };

  const subtotal = cartItems.reduce((total, item) => total + (item.product?.price || item.price) * item.quantity, 0);
  const discount = appliedCoupon ? (subtotal * appliedCoupon.discountPercentage) / 100 : 0;
  const total = subtotal - discount;

  const handleCouponSubmit = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setLoading(true);
    setCouponError('');

    try {
      const response = await apiService.validateCoupon({
        code: couponCode,
        orderAmount: subtotal
      });

      if (response.data.valid) {
        setAppliedCoupon({
          code: couponCode,
          discountPercentage: response.data.discountPercentage,
          discountAmount: response.data.discountAmount
        });
        setCouponError('');
        toast.success('Coupon applied successfully!');
      }
    } catch (error) {
      setCouponError(error.response?.data?.message || 'Invalid coupon code');
      setAppliedCoupon(null);
      toast.error(error.response?.data?.message || 'Invalid coupon code');
    } finally {
      setLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
    toast.success('Coupon removed');
  };

  if (cartItems.length === 0) {
    return (
      <div className="container px-4 py-16 text-center mt-15">
        <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-8">Please add items to your cart before proceeding to checkout.</p>
        <button
          onClick={() => navigate('/shop')}
          className="bg-orange-600 text-white px-6 py-3 rounded-full hover:bg-orange-700 transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 mt-20 sm:mt-24">
      {/* Checkout Steps */}
      <div className="flex flex-col sm:flex-row items-center justify-center mb-8 sm:mb-12">
        <div className="flex items-center w-full max-w-2xl">
          {/* Step 1: Shopping Cart */}
          <div className="flex items-center">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-600 text-white flex items-center justify-center text-sm sm:text-lg font-medium shrink-0">
              <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="ml-2 sm:ml-3 text-xs sm:text-sm text-green-600 font-medium whitespace-nowrap">Shopping cart</div>
          </div>
          <div className="flex-auto border-t-2 border-gray-300 mx-2 sm:mx-4"></div>
          
          {/* Step 2: Checkout */}
          <div className="flex items-center">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-orange-600 text-white flex items-center justify-center text-sm sm:text-lg font-medium shrink-0">2</div>
            <div className="ml-2 sm:ml-3 text-xs sm:text-sm text-orange-600 font-medium whitespace-nowrap">Checkout</div>
          </div>
          <div className="flex-auto border-t-2 border-gray-300 mx-2 sm:mx-4"></div>
          
          {/* Step 3: Order Complete */}
          <div className="flex items-center">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-sm sm:text-lg font-medium shrink-0">3</div>
            <div className="ml-2 sm:ml-3 text-xs sm:text-sm text-gray-600 whitespace-nowrap">Order complete</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 sm:gap-12">
        {/* Checkout Form */}
        <div className="w-full lg:w-2/3">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 md:p-8">
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <span className="text-red-500 font-semibold">*</span> indicates required fields. Please ensure all required fields are filled before placing your order.
              </p>
            </div>
            <form onSubmit={handleSubmit}>
              {/* Shipping Information */}
              <div className="mb-6 sm:mb-8">
                <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 flex items-center">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-orange-600" />
                  Shipping Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent text-sm sm:text-base ${
                        fieldErrors.firstName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                    />
                    {fieldErrors.firstName && (
                      <p className="text-red-500 text-xs mt-1">{fieldErrors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent text-sm sm:text-base ${
                        fieldErrors.lastName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                    />
                    {fieldErrors.lastName && (
                      <p className="text-red-500 text-xs mt-1">{fieldErrors.lastName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent text-sm sm:text-base ${
                        fieldErrors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                    />
                    {fieldErrors.email && (
                      <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent text-sm sm:text-base ${
                        fieldErrors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                    />
                    {fieldErrors.phone && (
                      <p className="text-red-500 text-xs mt-1">{fieldErrors.phone}</p>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent text-sm sm:text-base ${
                        fieldErrors.address ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                    />
                    {fieldErrors.address && (
                      <p className="text-red-500 text-xs mt-1">{fieldErrors.address}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent text-sm sm:text-base ${
                        fieldErrors.city ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                    />
                    {fieldErrors.city && (
                      <p className="text-red-500 text-xs mt-1">{fieldErrors.city}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      State <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent text-sm sm:text-base ${
                        fieldErrors.state ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                    />
                    {fieldErrors.state && (
                      <p className="text-red-500 text-xs mt-1">{fieldErrors.state}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      ZIP Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent text-sm sm:text-base ${
                        fieldErrors.zipCode ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                    />
                    {fieldErrors.zipCode && (
                      <p className="text-red-500 text-xs mt-1">{fieldErrors.zipCode}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent text-sm sm:text-base ${
                        fieldErrors.country ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                    >
                      <option value="India">India</option>
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Canada">Canada</option>
                    </select>
                    {fieldErrors.country && (
                      <p className="text-red-500 text-xs mt-1">{fieldErrors.country}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Billing Information */}
              <div className="mb-6 sm:mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
                  <h3 className="text-lg sm:text-xl font-semibold flex items-center mb-2 sm:mb-0">
                    <Building className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-orange-600" />
                    Billing Information
                  </h3>
                  <div>
                    <input
                      type="checkbox"
                      id="billingSameAsShipping"
                      name="billingSameAsShipping"
                      checked={formData.billingSameAsShipping}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500"
                    />
                    <label htmlFor="billingSameAsShipping" className="ml-2 block text-sm text-gray-900">
                      Billing address is the same as shipping
                    </label>
                  </div>
                </div>

                {!formData.billingSameAsShipping && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">First Name</label>
                      <input
                        type="text"
                        name="billingFirstName"
                        value={formData.billingFirstName}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent text-sm sm:text-base"
                        required={!formData.billingSameAsShipping}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">Last Name</label>
                      <input
                        type="text"
                        name="billingLastName"
                        value={formData.billingLastName}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent text-sm sm:text-base"
                        required={!formData.billingSameAsShipping}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">Email</label>
                      <input
                        type="email"
                        name="billingEmail"
                        value={formData.billingEmail}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent text-sm sm:text-base"
                        required={!formData.billingSameAsShipping}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">Phone</label>
                      <input
                        type="tel"
                        name="billingPhone"
                        value={formData.billingPhone}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent text-sm sm:text-base"
                        required={!formData.billingSameAsShipping}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">Address</label>
                      <input
                        type="text"
                        name="billingAddress"
                        value={formData.billingAddress}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent text-sm sm:text-base"
                        required={!formData.billingSameAsShipping}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">City</label>
                      <input
                        type="text"
                        name="billingCity"
                        value={formData.billingCity}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent text-sm sm:text-base"
                        required={!formData.billingSameAsShipping}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">State</label>
                      <input
                        type="text"
                        name="billingState"
                        value={formData.billingState}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent text-sm sm:text-base"
                        required={!formData.billingSameAsShipping}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">ZIP Code</label>
                      <input
                        type="text"
                        name="billingZipCode"
                        value={formData.billingZipCode}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent text-sm sm:text-base"
                        required={!formData.billingSameAsShipping}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">Country</label>
                      <select
                        name="billingCountry"
                        value={formData.billingCountry}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent text-sm sm:text-base"
                        required={!formData.billingSameAsShipping}
                      >
                        <option value="India">India</option>
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Canada">Canada</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Information */}
              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 flex items-center">
                  <Lock className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-orange-600" />
                  Payment Details
                </h3>
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="credit"
                        checked={formData.paymentMethod === 'credit'}
                        onChange={handleInputChange}
                        className="text-orange-600 focus:ring-orange-600"
                      />
                      <span className="text-sm sm:text-base">Credit Card</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={formData.paymentMethod === 'cod'}
                        onChange={handleInputChange}
                        className="text-orange-600 focus:ring-orange-600"
                      />
                      <span className="text-sm sm:text-base">Cash on Delivery</span>
                    </label>
                  </div>

                  {formData.paymentMethod === 'credit' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                          Card Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent text-sm sm:text-base ${
                            fieldErrors.cardNumber ? 'border-red-500' : 'border-gray-300'
                          }`}
                          required={formData.paymentMethod === 'credit'}
                        />
                        {fieldErrors.cardNumber && (
                          <p className="text-red-500 text-xs mt-1">{fieldErrors.cardNumber}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                          Cardholder Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="cardName"
                          value={formData.cardName}
                          onChange={handleInputChange}
                          className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent text-sm sm:text-base ${
                            fieldErrors.cardName ? 'border-red-500' : 'border-gray-300'
                          }`}
                          required={formData.paymentMethod === 'credit'}
                        />
                        {fieldErrors.cardName && (
                          <p className="text-red-500 text-xs mt-1">{fieldErrors.cardName}</p>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                            Expiry Date <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="cardExpiry"
                            value={formData.cardExpiry}
                            onChange={handleInputChange}
                            placeholder="MM/YY"
                            className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent text-sm sm:text-base ${
                              fieldErrors.cardExpiry ? 'border-red-500' : 'border-gray-300'
                            }`}
                            required={formData.paymentMethod === 'credit'}
                          />
                          {fieldErrors.cardExpiry && (
                            <p className="text-red-500 text-xs mt-1">{fieldErrors.cardExpiry}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                            CVC <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="cardCVC"
                            value={formData.cardCVC}
                            onChange={handleInputChange}
                            className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent text-sm sm:text-base ${
                              fieldErrors.cardCVC ? 'border-red-500' : 'border-gray-300'
                            }`}
                            required={formData.paymentMethod === 'credit'}
                          />
                          {fieldErrors.cardCVC && (
                            <p className="text-red-500 text-xs mt-1">{fieldErrors.cardCVC}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Coupon Section */}
              <div className="border-t border-gray-200 mt-4 pt-4">
                <h3 className="font-medium mb-2">Apply Coupon</h3>
                {!appliedCoupon ? (
                  <form onSubmit={handleCouponSubmit} className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter coupon code"
                      className="flex-1 p-2 border rounded"
                      disabled={loading}
                    />
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                      disabled={loading}
                    >
                      {loading ? 'Applying...' : 'Apply'}
                    </button>
                  </form>
                ) : (
                  <div className="flex justify-between items-center bg-green-50 p-2 rounded">
                    <div>
                      <p className="text-green-700 font-medium">{appliedCoupon.code}</p>
                      <p className="text-sm text-green-600">{appliedCoupon.discountPercentage}% off</p>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                )}
                {couponError && (
                  <p className="text-red-500 text-sm mt-1">{couponError}</p>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 sticky top-24">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 border-b pb-4">Order Summary</h3>
            <div className="space-y-4">
              {cartItems.map(item => (
                <div key={item.id} className="flex items-center space-x-4">
                  <div className="relative">
                    <img 
                      src={config.fixImageUrl(getItemImage(item))} 
                      alt={item.product?.name || item.name} 
                      className="w-16 h-16 rounded-lg object-cover" 
                      onError={e => {
                        e.target.onerror = null;
                        // Try fallback images
                        if (item.product?.images && item.product.images.length > 0) {
                          const nextImage = item.product.images.find(img => img !== e.target.src);
                          if (nextImage) {
                            e.target.src = config.fixImageUrl(nextImage);
                            return;
                          }
                        }
                        // Final fallback
                        e.target.src = 'https://placehold.co/150x150/e2e8f0/475569?text=Product';
                      }}
                    />
                    <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{item.quantity}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900 line-clamp-2">{item.product?.name || item.name}</h4>
                    <p className="text-sm text-gray-500">₹{(item.product?.price || item.price).toFixed(2)}</p>
                  </div>
                  <p className="text-sm font-semibold">₹{((item.product?.price || item.price) * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="border-t mt-4 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>₹{getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span className="text-green-600">FREE</span>
              </div>
              <div className="flex justify-between text-base sm:text-lg font-semibold">
                <span>Total</span>
                <span>₹{getTotalPrice().toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full mt-6 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Truck className="w-5 h-5 mr-2" />
                  Place Order
                </>
              )}
            </button>
            {error && <p className="text-red-600 text-sm mt-4 text-center">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 