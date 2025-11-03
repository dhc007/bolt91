import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Hero = ({ onBookNow }) => {
  const { t } = useLanguage();

  return (
    <section
      className="relative h-[600px] bg-cover bg-center"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1717070882156-108ae2c5c343?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwyfHx2YXJhbmFzaSUyMGdoYXRzfGVufDB8fHx8MTc2MjE3MTY4OXww&ixlib=rb-4.1.0&q=85)'
      }}
      data-testid="hero-section"
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/60 to-transparent"></div>

      {/* Content */}
      <div className="relative container mx-auto px-4 sm:px-6 h-full flex items-end pb-20">
        <div className="max-w-2xl">
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-4" data-testid="hero-headline">
            {t('Explore Yourself? Explore Kashi!', 'खुद को खोजें? काशी को खोजें!')}
          </h1>
          <p className="text-xl text-gray-700 mb-8" data-testid="hero-subheadline">
            {t(
              'Premium e-bikes with cutting-edge accessories',
              'आधुनिक एक्सेसरीज़ के साथ प्रीमियम ई-बाइक'
            )}
          </p>

          {/* Price Badge */}
          <div className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-lg mb-6" data-testid="price-badge">
            <span className="line-through text-gray-500 mr-2">₹499</span>
            <span className="text-2xl font-bold">₹449</span>
            <span className="text-sm ml-2">{t('/day', '/दिन')}</span>
          </div>

          {/* CTA Button */}
          <div>
            <button
              onClick={onBookNow}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 hover:-translate-y-1 shadow-lg hover:shadow-xl"
              data-testid="book-now-button"
            >
              {t('Book Your Ride', 'अपनी सवारी बुक करें')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
