import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { ArrowRight, Zap, Shield, MapPin } from 'lucide-react';

const Hero = ({ onBookNow }) => {
  const { t } = useLanguage();

  return (
    <section
      className="relative min-h-screen flex items-center bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1717070882156-108ae2c5c343?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwyfHx2YXJhbmFzaSUyMGdoYXRzfGVufDB8fHx8MTc2MjE3MTY4OXww&ixlib=rb-4.1.0&q=85)'
      }}
      data-testid="hero-section"
    >
      {/* Sophisticated Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-white"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-40 left-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      {/* Content */}
      <div className="relative container mx-auto px-4 sm:px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full mb-8 shadow-lg animate-fade-in">
            <Zap className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-semibold text-gray-900">
              {t('Eco-Friendly Electric Rides', 'पर्यावरण के अनुकूल इलेक्ट्रिक सवारी')}
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl sm:text-7xl font-bold mb-6 animate-fade-in" data-testid="hero-headline">
            <span className="text-white drop-shadow-2xl">
              {t('Explore Yourself?', 'खुद को खोजें?')}
            </span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              {t('Explore Kashi!', 'काशी को खोजें!')}
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl sm:text-2xl text-white/90 mb-12 max-w-2xl mx-auto drop-shadow-lg font-light" data-testid="hero-subheadline">
            {t(
              'Experience the spiritual heart of India on our premium e-bikes',
              'हमारी प्रीमियम ई-बाइक पर भारत के आध्यात्मिक हृदय का अनुभव करें'
            )}
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12 max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <Zap className="w-8 h-8 text-blue-400 mb-3 mx-auto" />
              <h3 className="text-white font-semibold mb-1">{t('40 km Range', '40 किमी रेंज')}</h3>
              <p className="text-white/70 text-sm">{t('All-day exploration', 'पूरे दिन की खोज')}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <Shield className="w-8 h-8 text-green-400 mb-3 mx-auto" />
              <h3 className="text-white font-semibold mb-1">{t('Safe & Secure', 'सुरक्षित')}</h3>
              <p className="text-white/70 text-sm">{t('Full insurance', 'पूर्ण बीमा')}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <MapPin className="w-8 h-8 text-purple-400 mb-3 mx-auto" />
              <h3 className="text-white font-semibold mb-1">{t('Doorstep Delivery', 'डोरस्टेप डिलीवरी')}</h3>
              <p className="text-white/70 text-sm">{t('We come to you', 'हम आपके पास आते हैं')}</p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            {/* Price Badge */}
            <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-8 py-4 rounded-2xl shadow-2xl">
              <div className="flex items-center space-x-3">
                <div>
                  <div className="text-sm font-medium opacity-90">{t('Starting from', 'से शुरू')}</div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-bold">₹449</span>
                    <span className="text-sm line-through opacity-70">₹499</span>
                  </div>
                  <div className="text-xs opacity-90">{t('per day', 'प्रति दिन')}</div>
                </div>
                <div className="bg-white/20 rounded-full px-3 py-1 text-xs font-bold">
                  10% OFF
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={onBookNow}
              className="group bg-white hover:bg-gray-50 text-gray-900 font-bold px-10 py-5 rounded-2xl text-lg transition-all duration-300 hover:scale-105 shadow-2xl flex items-center space-x-2"
              data-testid="book-now-button"
            >
              <span>{t('Book Your Ride', 'अपनी सवारी बुक करें')}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 flex items-center justify-center space-x-8 text-white/80 text-sm">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>{t('5★ Rated', '5★ रेटेड')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>{t('100% Safe', '100% सुरक्षित')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5" />
              <span>{t('500+ Happy Riders', '500+ खुश सवार')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-white/50 rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
