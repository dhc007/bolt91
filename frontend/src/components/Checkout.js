import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { useLanguage } from '../contexts/LanguageContext';
import { X, ChevronDown, ChevronUp, Check, Upload, MapPin } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;
const WHATSAPP_NUMBER = '+917709892835';

const Checkout = ({ isOpen, onClose, onSuccess }) => {
  const { cart, getTotal, getSecurityDeposit } = useCart();
  const { language, t } = useLanguage();

  // Form state
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Contact Details
    name: '',
    mobile: '',
    email: '',
    otp: '',
    otpSent: false,
    otpVerified: false,
    
    // Step 2: KYC
    idProof: null,
    selfie: null,
    
    // Step 3: Emergency Contact
    emergencyName: '',
    emergencyMobile: '',
    emergencyRelationship: '',
    
    // Step 4: Rental Duration
    rentalStart: '',
    rentalEnd: '',
    
    // Step 5: Delivery Address
    deliveryAddress: '',
    useGPS: false,
    latitude: null,
    longitude: null
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const steps = [
    { id: 1, name: t('Contact', 'संपर्क'), completed: currentStep > 1 },
    { id: 2, name: t('KYC', 'केवाईसी'), completed: currentStep > 2 },
    { id: 3, name: t('Emergency', 'आपातकालीन'), completed: currentStep > 3 },
    { id: 4, name: t('Duration', 'अवधि'), completed: currentStep > 4 },
    { id: 5, name: t('Delivery', 'डिलीवरी'), completed: currentStep > 5 },
    { id: 6, name: t('Review', 'समीक्षा'), completed: false }
  ];

  const handleSendOTP = async () => {
    if (!formData.mobile || formData.mobile.length < 10) {
      setError(t('Please enter a valid mobile number', 'कृपया एक मान्य मोबाइल नंबर दर्ज करें'));
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await axios.post(`${API}/otp/send`, {
        mobile: formData.mobile
      });
      
      setFormData({ ...formData, otpSent: true });
      alert(t(`OTP sent: ${response.data.otp}`, `OTP भेजा गया: ${response.data.otp}`));
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!formData.otp || formData.otp.length !== 6) {
      setError(t('Please enter 6-digit OTP', 'कृपया 6 अंकों का OTP दर्ज करें'));
      return;
    }

    try {
      setLoading(true);
      setError('');
      await axios.post(`${API}/otp/verify`, {
        mobile: formData.mobile,
        otp: formData.otp
      });
      
      setFormData({ ...formData, otpVerified: true });
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (field, file) => {
    if (file && file.size > 5 * 1024 * 1024) {
      setError(t('File size should be less than 5MB', 'फ़ाइल का आकार 5MB से कम होना चाहिए'));
      return;
    }
    setFormData({ ...formData, [field]: file });
    setError('');
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            useGPS: true
          });
        },
        (error) => {
          setError(t('Unable to get location', 'स्थान प्राप्त करने में असमर्थ'));
        }
      );
    }
  };

  const validateStep = () => {
    setError('');
    
    switch (currentStep) {
      case 1:
        if (!formData.name || !formData.mobile) {
          setError(t('Please fill all required fields', 'कृपया सभी आवश्यक फ़ील्ड भरें'));
          return false;
        }
        if (!formData.otpVerified) {
          setError(t('Please verify your mobile number', 'कृपया अपना मोबाइल नंबर सत्यापित करें'));
          return false;
        }
        break;
      case 2:
        if (!formData.idProof || !formData.selfie) {
          setError(t('Please upload both ID proof and selfie', 'कृपया आईडी प्रूफ और सेल्फी दोनों अपलोड करें'));
          return false;
        }
        break;
      case 3:
        if (!formData.emergencyName || !formData.emergencyMobile || !formData.emergencyRelationship) {
          setError(t('Please fill all emergency contact details', 'कृपया सभी आपातकालीन संपर्क विवरण भरें'));
          return false;
        }
        break;
      case 4:
        if (!formData.rentalStart || !formData.rentalEnd) {
          setError(t('Please select rental dates', 'कृपया किराये की तारीखें चुनें'));
          return false;
        }
        const start = new Date(formData.rentalStart);
        const end = new Date(formData.rentalEnd);
        if (start >= end) {
          setError(t('End date must be after start date', 'समाप्ति तिथि प्रारंभ तिथि के बाद होनी चाहिए'));
          return false;
        }
        if (start < new Date(new Date().toDateString())) {
          setError(t('Start date cannot be in the past', 'प्रारंभ तिथि पिछली नहीं हो सकती'));
          return false;
        }
        break;
      case 5:
        if (!formData.deliveryAddress) {
          setError(t('Please enter delivery address', 'कृपया डिलीवरी पता दर्ज करें'));
          return false;
        }
        break;
    }
    
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
    setError('');
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    try {
      setLoading(true);
      setError('');

      // Prepare booking data
      const bookingData = {
        name: formData.name,
        mobile: formData.mobile,
        email: formData.email || null,
        cart_items: cart.map(item => ({
          product_id: item.id,
          quantity: item.quantity
        })),
        emergency_contact: {
          name: formData.emergencyName,
          mobile: formData.emergencyMobile,
          relationship: formData.emergencyRelationship
        },
        rental_start: new Date(formData.rentalStart).toISOString(),
        rental_end: new Date(formData.rentalEnd).toISOString(),
        delivery_address: formData.deliveryAddress,
        delivery_latitude: formData.latitude,
        delivery_longitude: formData.longitude
      };

      // Create booking
      const response = await axios.post(`${API}/booking/create`, bookingData);
      const booking = response.data;

      // Upload KYC documents
      if (formData.idProof && formData.selfie) {
        const kycFormData = new FormData();
        kycFormData.append('booking_id', booking.booking_id);
        kycFormData.append('id_proof', formData.idProof);
        kycFormData.append('selfie', formData.selfie);

        await axios.post(`${API}/kyc/upload`, kycFormData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      // Success - redirect to WhatsApp with payment link
      const whatsappMessage = encodeURIComponent(
        `Hello! I'd like to complete my booking\n\nBooking ID: ${booking.booking_id}\nName: ${booking.name}\n\nPayment Link: ${booking.payment_link || 'Will be shared shortly'}`
      );
      const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, '')}?text=${whatsappMessage}`;

      // Call success callback
      onSuccess(booking, whatsappURL);
      
    } catch (err) {
      console.error('Booking error:', err);
      setError(err.response?.data?.detail || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
        data-testid="checkout-backdrop"
      ></div>

      {/* Checkout Modal */}
      <div className="fixed inset-4 sm:inset-10 bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden" data-testid="checkout-modal">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {t('Complete Your Booking', 'अपनी बुकिंग पूरी करें')}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            data-testid="close-checkout-button"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Dots */}
        <div className="flex items-center justify-center space-x-2 py-4 border-b border-gray-200">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`flex items-center ${step.id < steps.length ? 'flex-1 max-w-32' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step.completed
                    ? 'bg-green-500 text-white'
                    : currentStep === step.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step.completed ? <Check className="w-5 h-5" /> : step.id}
              </div>
              {step.id < steps.length && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    step.completed ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4" data-testid="error-message">
              {error}
            </div>
          )}

          {/* Step 1: Contact Details */}
          {currentStep === 1 && (
            <div className="space-y-4" data-testid="step-contact">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('Full Name', 'पूरा नाम')} *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder={t('Enter your name', 'अपना नाम दर्ज करें')}
                  data-testid="input-name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('Mobile Number', 'मोबाइल नंबर')} *
                </label>
                <div className="flex space-x-2">
                  <input
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value, otpSent: false, otpVerified: false })}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="+91 98765 43210"
                    disabled={formData.otpVerified}
                    data-testid="input-mobile"
                  />
                  {!formData.otpVerified && (
                    <button
                      onClick={handleSendOTP}
                      disabled={loading || formData.otpSent}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
                      data-testid="send-otp-button"
                    >
                      {formData.otpSent ? t('Resend', 'पुनः भेजें') : t('Send OTP', 'OTP भेजें')}
                    </button>
                  )}
                </div>
              </div>

              {formData.otpSent && !formData.otpVerified && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('Enter OTP', 'OTP दर्ज करें')} *
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={formData.otp}
                      onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      placeholder="123456"
                      maxLength={6}
                      data-testid="input-otp"
                    />
                    <button
                      onClick={handleVerifyOTP}
                      disabled={loading}
                      className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                      data-testid="verify-otp-button"
                    >
                      {t('Verify', 'सत्यापित करें')}
                    </button>
                  </div>
                </div>
              )}

              {formData.otpVerified && (
                <div className="bg-green-50 text-green-600 p-4 rounded-lg flex items-center space-x-2">
                  <Check className="w-5 h-5" />
                  <span>{t('Mobile verified successfully', 'मोबाइल सफलतापूर्वक सत्यापित')}</span>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('Email (Optional)', 'ईमेल (वैकल्पिक)')}
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="your@email.com"
                  data-testid="input-email"
                />
              </div>
            </div>
          )}

          {/* Step 2: KYC */}
          {currentStep === 2 && (
            <div className="space-y-6" data-testid="step-kyc">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('ID Proof (Aadhaar/PAN/License)', 'आईडी प्रूफ (आधार/पैन/लाइसेंस)')} *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-600 transition-colors">
                  <Upload className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange('idProof', e.target.files[0])}
                    className="hidden"
                    id="idProof"
                    data-testid="input-id-proof"
                  />
                  <label
                    htmlFor="idProof"
                    className="cursor-pointer text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    {formData.idProof ? formData.idProof.name : t('Click to upload', 'अपलोड करने के लिए क्लिक करें')}
                  </label>
                  <p className="text-sm text-gray-500 mt-2">
                    {t('PNG, JPG up to 5MB', 'PNG, JPG 5MB तक')}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('Selfie with ID', 'आईडी के साथ सेल्फी')} *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-600 transition-colors">
                  <Upload className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange('selfie', e.target.files[0])}
                    className="hidden"
                    id="selfie"
                    data-testid="input-selfie"
                  />
                  <label
                    htmlFor="selfie"
                    className="cursor-pointer text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    {formData.selfie ? formData.selfie.name : t('Click to upload', 'अपलोड करने के लिए क्लिक करें')}
                  </label>
                  <p className="text-sm text-gray-500 mt-2">
                    {t('Hold ID next to your face', 'अपने चेहरे के पास आईडी रखें')}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Emergency Contact */}
          {currentStep === 3 && (
            <div className="space-y-4" data-testid="step-emergency">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('Emergency Contact Name', 'आपातकालीन संपर्क नाम')} *
                </label>
                <input
                  type="text"
                  value={formData.emergencyName}
                  onChange={(e) => setFormData({ ...formData, emergencyName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  data-testid="input-emergency-name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('Emergency Contact Mobile', 'आपातकालीन संपर्क मोबाइल')} *
                </label>
                <input
                  type="tel"
                  value={formData.emergencyMobile}
                  onChange={(e) => setFormData({ ...formData, emergencyMobile: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  data-testid="input-emergency-mobile"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('Relationship', 'संबंध')} *
                </label>
                <select
                  value={formData.emergencyRelationship}
                  onChange={(e) => setFormData({ ...formData, emergencyRelationship: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  data-testid="input-emergency-relationship"
                >
                  <option value="">{t('Select relationship', 'संबंध चुनें')}</option>
                  <option value="parent">{t('Parent', 'माता-पिता')}</option>
                  <option value="spouse">{t('Spouse', 'जीवनसाथी')}</option>
                  <option value="sibling">{t('Sibling', 'भाई-बहन')}</option>
                  <option value="friend">{t('Friend', 'मित्र')}</option>
                  <option value="other">{t('Other', 'अन्य')}</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 4: Rental Duration */}
          {currentStep === 4 && (
            <div className="space-y-4" data-testid="step-duration">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('Start Date & Time', 'प्रारंभ तिथि और समय')} *
                </label>
                <input
                  type="datetime-local"
                  value={formData.rentalStart}
                  onChange={(e) => setFormData({ ...formData, rentalStart: e.target.value })}
                  min={new Date().toISOString().slice(0, 16)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  data-testid="input-rental-start"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('End Date & Time', 'समाप्ति तिथि और समय')} *
                </label>
                <input
                  type="datetime-local"
                  value={formData.rentalEnd}
                  onChange={(e) => setFormData({ ...formData, rentalEnd: e.target.value })}
                  min={formData.rentalStart || new Date().toISOString().slice(0, 16)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  data-testid="input-rental-end"
                />
              </div>

              {formData.rentalStart && formData.rentalEnd && (
                <div className="bg-blue-50 text-blue-900 p-4 rounded-lg">
                  <strong>{t('Duration', 'अवधि')}:</strong>{' '}
                  {Math.max(1, Math.ceil((new Date(formData.rentalEnd) - new Date(formData.rentalStart)) / (1000 * 60 * 60 * 24)))}{' '}
                  {t('days', 'दिन')}
                </div>
              )}
            </div>
          )}

          {/* Step 5: Delivery Address */}
          {currentStep === 5 && (
            <div className="space-y-4" data-testid="step-delivery">
              <div>
                <button
                  onClick={handleGetLocation}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors mb-4"
                  data-testid="get-location-button"
                >
                  <MapPin className="w-5 h-5" />
                  <span>{t('Use Current Location', 'वर्तमान स्थान का उपयोग करें')}</span>
                </button>
                {formData.useGPS && (
                  <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm mb-4">
                    {t('Location captured', 'स्थान कैप्चर किया गया')}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('Delivery Address', 'डिलीवरी पता')} *
                </label>
                <textarea
                  value={formData.deliveryAddress}
                  onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder={t('Enter complete address with landmark', 'लैंडमार्क के साथ पूरा पता दर्ज करें')}
                  data-testid="input-delivery-address"
                />
              </div>
            </div>
          )}

          {/* Step 6: Review */}
          {currentStep === 6 && (
            <div className="space-y-6" data-testid="step-review">
              <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                <h3 className="font-bold text-lg text-gray-900">
                  {t('Booking Summary', 'बुकिंग सारांश')}
                </h3>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('Name', 'नाम')}:</span>
                    <span className="font-semibold">{formData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('Mobile', 'मोबाइल')}:</span>
                    <span className="font-semibold">{formData.mobile}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('Rental Period', 'किराये की अवधि')}:</span>
                    <span className="font-semibold">
                      {new Date(formData.rentalStart).toLocaleDateString()} - {new Date(formData.rentalEnd).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="space-y-2">
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>
                          {language === 'en' ? item.name : item.name_hi}
                          {item.selectedPlan && ` (${item.selectedPlan.name})`}
                        </span>
                        <span>₹{item.displayPrice || item.discounted_price} × {item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('Rental Amount', 'किराया राशि')}:</span>
                    <span className="font-semibold">₹{getTotal()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('Security Deposit', 'सुरक्षा जमा')}:</span>
                    <span className="font-semibold">₹{getSecurityDeposit()}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                    <span>{t('Total', 'कुल')}:</span>
                    <span>₹{getTotal() + getSecurityDeposit()}</span>
                  </div>
                </div>
              </div>

              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-600"
                  required
                  data-testid="terms-checkbox"
                />
                <span className="text-sm text-gray-700">
                  {t(
                    'I agree to the terms and conditions and authorize Blue Bolt Electric to process my booking.',
                    'मैं नियमों और शर्तों से सहमत हूं और ब्लू बोल्ट इलेक्ट्रिक को अपनी बुकिंग प्रोसेस करने के लिए अधिकृत करता हूं।'
                  )}
                </span>
              </label>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 flex justify-between">
          {currentStep > 1 && (
            <button
              onClick={handlePrevious}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              data-testid="previous-button"
            >
              {t('Previous', 'पिछला')}
            </button>
          )}
          
          {currentStep < 6 ? (
            <button
              onClick={handleNext}
              disabled={loading}
              className="ml-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
              data-testid="next-button"
            >
              {t('Next', 'अगला')}
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="ml-auto px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
              data-testid="confirm-booking-button"
            >
              {loading ? t('Processing...', 'प्रोसेस हो रहा है...') : t('Confirm Booking', 'बुकिंग की पुष्टि करें')}
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Checkout;
