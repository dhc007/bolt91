import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Search, FileText, MessageCircle, Truck } from 'lucide-react';

const HowItWorks = () => {
  const { t } = useLanguage();

  const steps = [
    {
      icon: Search,
      title: t('Browse & Book', 'ब्राउज़ करें और बुक करें'),
      description: t(
        'Select your rental period and accessories',
        'अवधि और एक्सेसरीज़ चुनें'
      )
    },
    {
      icon: FileText,
      title: t('Quick KYC', 'त्वरित केवाईसी'),
      description: t(
        'Upload ID and selfie securely',
        'सुरक्षित रूप से आईडी अपलोड करें'
      )
    },
    {
      icon: MessageCircle,
      title: t('WhatsApp Payment', 'व्हाट्सएप भुगतान'),
      description: t(
        'Receive payment link instantly',
        'तुरंत पेमेंट लिंक पाएं'
      )
    },
    {
      icon: Truck,
      title: t('Doorstep Delivery', 'आपके दरवाजे पर डिलीवरी'),
      description: t(
        'We deliver to your location',
        'हम आपके स्थान पर पहुंचाते हैं'
      )
    }
  ];

  return (
    <section className="py-20 bg-white" data-testid="how-it-works-section">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t('How It Works', 'यह कैसे काम करता है')}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="text-center" data-testid={`step-${index + 1}`}>
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <Icon className="w-10 h-10 text-blue-600" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mx-auto left-1/2 -translate-x-1/2">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
