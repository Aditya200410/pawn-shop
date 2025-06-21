import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ArrowLeft, CreditCard, Lock, MapPin, Phone, User, Mail, Building, Truck } from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice } = useCart();
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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
    // Navigate to order confirmation
    navigate('/order-confirmation');
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
    <div className="container mx-15 px-4 py-4 sm:py-8 mt-20 sm:mt-24">
      {/* Checkout Steps */}
      <div className="flex items-center justify-center mb-8 sm:mb-12 overflow-x-auto  mx-15">
        <div className="flex items-center min-w-max px-4">
          <div className="flex items-center">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-600 text-white flex items-center justify-center text-sm sm:text-lg font-medium">
              <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="ml-2 sm:ml-3 text-sm sm:text-base text-green-600 font-medium">Shopping cart</div>
          </div>
          <div className="w-16 sm:w-24 h-0.5 bg-gray-300 mx-2 sm:mx-4"></div>
          <div className="flex items-center">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-orange-600 text-white flex items-center justify-center text-sm sm:text-lg font-medium">2</div>
            <div className="ml-2 sm:ml-3 text-sm sm:text-base text-orange-600 font-medium">Checkout</div>
          </div>
          <div className="w-16 sm:w-24 h-0.5 bg-gray-300 mx-2 sm:mx-4"></div>
          <div className="flex items-center">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-sm sm:text-lg font-medium">3</div>
            <div className="ml-2 sm:ml-3 text-sm sm:text-base text-gray-600">Order complete</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6">
            <form onSubmit={handleSubmit}>
              {/* Shipping Information */}
              <div className="mb-6 sm:mb-8">
                <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 flex items-center">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-orange-600" />
                  Shipping Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent text-sm sm:text-base"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent text-sm sm:text-base"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent text-sm sm:text-base"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent text-sm sm:text-base"
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent text-sm sm:text-base"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent text-sm sm:text-base"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent text-sm sm:text-base"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">ZIP Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent text-sm sm:text-base"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">Country</label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent text-sm sm:text-base"
                      required
                    >
                      <option value="India">India</option>
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Canada">Canada</option>
                    </select>
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
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="billingSameAsShipping"
                      checked={formData.billingSameAsShipping}
                      onChange={handleInputChange}
                      className="rounded text-orange-600 focus:ring-orange-600"
                    />
                    <span className="text-sm text-gray-600">Same as shipping</span>
                  </label>
                </div>

                {!formData.billingSameAsShipping && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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
              <div className="mb-6 sm:mb-8">
                <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 flex items-center">
                  <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-orange-600" />
                  Payment Information
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
                        <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">Card Number</label>
                        <input
                          type="text"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent text-sm sm:text-base"
                          required={formData.paymentMethod === 'credit'}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">Cardholder Name</label>
                        <input
                          type="text"
                          name="cardName"
                          value={formData.cardName}
                          onChange={handleInputChange}
                          className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent text-sm sm:text-base"
                          required={formData.paymentMethod === 'credit'}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">Expiry Date</label>
                          <input
                            type="text"
                            name="cardExpiry"
                            value={formData.cardExpiry}
                            onChange={handleInputChange}
                            placeholder="MM/YY"
                            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent text-sm sm:text-base"
                            required={formData.paymentMethod === 'credit'}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">CVC</label>
                          <input
                            type="text"
                            name="cardCVC"
                            value={formData.cardCVC}
                            onChange={handleInputChange}
                            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent text-sm sm:text-base"
                            required={formData.paymentMethod === 'credit'}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => navigate('/cart')}
                  className="w-full sm:w-auto flex items-center justify-center px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm sm:text-base"
                >
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Back to Cart
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto flex items-center justify-center px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm sm:text-base"
                >
                  <Lock className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Place Order
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Order Summary</h3>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm sm:text-base font-medium text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    <p className="text-sm sm:text-base font-medium text-orange-600">₹{item.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 mt-4 sm:mt-6 pt-4 sm:pt-6 space-y-2">
              <div className="flex justify-between text-sm sm:text-base">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₹{getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">Free</span>
              </div>
              <div className="flex justify-between text-base sm:text-lg font-semibold">
                <span>Total</span>
                <span className="text-orange-600">₹{getTotalPrice().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 