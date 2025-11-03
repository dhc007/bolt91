import React, { useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { CheckCircle, ExternalLink } from 'lucide-react';

const Success = ({ booking, whatsappURL, onClose }) => {
  const { t } = useLanguage();

  useEffect(() => {
    // Auto-redirect to WhatsApp after 3 seconds
    const timer = setTimeout(() => {
      window.open(whatsappURL, '_blank');
    }, 3000);

    return () => clearTimeout(timer);
  }, [whatsappURL]);

  if (!booking) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-600 to-purple-600 z-50 flex items-center justify-center p-4" data-testid="success-screen">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center animate-fade-in">
        {/* Confetti Effect - Simple CSS animation */}
        <div className="mb-6">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto animate-bounce" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {t('Booking Confirmed!', 'बुकिंग कन्फर्म!')}
        </h1>

        <div className="bg-blue-50 rounded-lg p-6 mb-6">
          <p className="text-sm text-gray-600 mb-2">
            {t('Your Booking ID', 'आपकी बुकिंग आईडी')}
          </p>
          <p className="text-3xl font-bold text-blue-600" data-testid="booking-id">
            {booking.booking_id}
          </p>
        </div>

        <div className="space-y-3 mb-6">
          <p className="text-gray-700">
            {t('Opening WhatsApp...', 'WhatsApp खोल रहे हैं...')}
          </p>
          
          {booking.payment_link && (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2">
                {t('Payment Link', 'पेमेंट लिंक')}
              </p>
              <a
                href={booking.payment_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 font-semibold text-sm break-all flex items-center justify-center space-x-1"
                data-testid="payment-link"
              >
                <span>{t('Click here to pay', 'भुगतान के लिए यहां क्लिक करें')}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <a
            href={whatsappURL}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors"
            data-testid="open-whatsapp-button"
          >
            {t('Open WhatsApp', 'WhatsApp खोलें')}
          </a>

          <button
            onClick={onClose}
            className="block w-full border border-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-50 transition-colors"
            data-testid="close-success-button"
          >
            {t('Close', 'बंद करें')}
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-6">
          {t(
            'We will deliver your e-bike to your specified location.',
            'हम आपकी ई-बाइक आपके निर्दिष्ट स्थान पर पहुंचाएंगे।'
          )}
        </p>
      </div>
    </div>
  );
};

export default Success;
