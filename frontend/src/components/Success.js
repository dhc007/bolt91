import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { CheckCircle, ExternalLink, Copy, Check } from 'lucide-react';

const Success = ({ booking, whatsappURL, onClose }) => {
  const { t } = useLanguage();
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!booking) return null;

  const whatsappNumber = '+917709892835';
  
  // Message FROM user TO Bolt91 after payment
  const confirmationMessage = encodeURIComponent(
    `Hello Bolt91! 🎉\n\nI have completed the payment for my e-bike rental.\n\n📋 Booking Details:\nBooking ID: ${booking.booking_id}\nName: ${booking.name}\nMobile: ${booking.mobile}\n\nLooking forward to exploring Kashi! 🚴‍♂️`
  );
  
  const whatsappConfirmURL = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${confirmationMessage}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(booking.payment_link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-600 to-purple-600 z-50 flex items-center justify-center p-4" data-testid="success-screen">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center animate-fade-in max-h-[90vh] overflow-y-auto">
        <div className="mb-6">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto animate-bounce" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t('Booking Created!', 'बुकिंग बनाई गई!')}
        </h1>

        <div className="bg-blue-50 rounded-lg p-6 mb-6">
          <p className="text-sm text-gray-600 mb-2">
            {t('Your Booking ID', 'आपकी बुकिंग आईडी')}
          </p>
          <p className="text-3xl font-bold text-blue-600 mb-4" data-testid="booking-id">
            {booking.booking_id}
          </p>

          <div className="border-t border-gray-200 pt-4 space-y-2 text-sm text-left">
            <div className="flex justify-between">
              <span className="text-gray-600">{t('Total Amount', 'कुल राशि')}:</span>
              <span className="font-semibold">₹{(booking.total_amount + booking.security_deposit).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {!paymentCompleted ? (
          <>
            <div className="space-y-4 mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {t('Step 1: Complete Payment', 'चरण 1: भुगतान पूरा करें')}
              </h2>
              
              {booking.payment_link && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-3">
                    {t('Click the link below to pay securely via Razorpay', 'Razorpay के माध्यम से सुरक्षित रूप से भुगतान करने के लिए नीचे दिए गए लिंक पर क्लिक करें')}
                  </p>
                  
                  <a
                    href={booking.payment_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors mb-3 flex items-center justify-center space-x-2"
                    data-testid="payment-link"
                  >
                    <span>{t('Pay Now', 'अभी भुगतान करें')}</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  <button
                    onClick={handleCopyLink}
                    className="w-full flex items-center justify-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-green-600" />
                        <span className="text-green-600">{t('Copied!', 'कॉपी किया!')}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>{t('Copy payment link', 'पेमेंट लिंक कॉपी करें')}</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => setPaymentCompleted(true)}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors mb-3"
              data-testid="payment-completed-button"
            >
              {t('I have completed payment', 'मैंने भुगतान पूरा कर लिया है')}
            </button>

            <button
              onClick={onClose}
              className="w-full border border-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-50 transition-colors"
              data-testid="close-button"
            >
              {t('Cancel', 'रद्द करें')}
            </button>
          </>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4 mb-4">
                <Check className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-green-800 font-semibold">
                  {t('Payment Received!', 'भुगतान प्राप्त हुआ!')}
                </p>
              </div>

              <h2 className="text-xl font-bold text-gray-900">
                {t('Step 2: Confirm with Bolt91', 'चरण 2: Bolt91 से पुष्टि करें')}
              </h2>
              
              <p className="text-sm text-gray-600">
                {t(
                  'Send a WhatsApp message to Bolt91 to confirm your payment and coordinate delivery',
                  'अपने भुगतान की पुष्टि करने और डिलीवरी का समन्वय करने के लिए Bolt91 को एक WhatsApp संदेश भेजें'
                )}
              </p>

              <div className="bg-gray-50 rounded-lg p-4 text-left">
                <p className="text-xs text-gray-500 mb-2">{t('Message Preview:', 'संदेश पूर्वावलोकन:')}</p>
                <div className="bg-white rounded p-3 text-sm text-gray-700 border border-gray-200">
                  <p>Hello Bolt91! 🎉</p>
                  <p className="mt-2">I have completed the payment for my e-bike rental.</p>
                  <p className="mt-2">📋 Booking Details:</p>
                  <p>Booking ID: {booking.booking_id}</p>
                  <p>Name: {booking.name}</p>
                  <p>Mobile: {booking.mobile}</p>
                  <p className="mt-2">Looking forward to exploring Kashi! 🚴‍♂️</p>
                </div>
              </div>
            </div>

            <a
              href={whatsappConfirmURL}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors mb-3 flex items-center justify-center space-x-2"
              data-testid="open-whatsapp-button"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              <span>{t('Open WhatsApp', 'WhatsApp खोलें')}</span>
            </a>

            <button
              onClick={onClose}
              className="w-full border border-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-50 transition-colors"
              data-testid="close-success-button"
            >
              {t('Close', 'बंद करें')}
            </button>
          </>
        )}

        <p className="text-xs text-gray-500 mt-6">
          {t(
            'We will deliver your e-bike to your specified location after payment confirmation',
            'भुगतान की पुष्टि के बाद हम आपकी ई-बाइक आपके निर्दिष्ट स्थान पर पहुंचाएंगे'
          )}
        </p>
      </div>
    </div>
  );
};

export default Success;
