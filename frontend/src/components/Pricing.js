import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Check } from 'lucide-react';

const Pricing = ({ onSelectPlan }) => {
  const { t } = useLanguage();

  const plans = [
    {
      id: 'daily',
      name: t('DAILY', 'दैनिक'),
      originalPrice: 499,
      price: 449,
      description: t('Perfect for day trips', 'दिन की यात्राओं के लिए'),
      discount: '10% off'
    },
    {
      id: 'weekly',
      name: t('WEEKLY', 'साप्ताहिक'),
      originalPrice: 1999,
      price: 1799,
      description: t('Best value', 'सबसे अच्छा मूल्य'),
      discount: '10% off',
      popular: true
    },
    {
      id: 'monthly',
      name: t('MONTHLY', 'मासिक'),
      originalPrice: 4999,
      price: 4499,
      description: t('Long-term explorers', 'लंबी अवधि के लिए'),
      discount: '10% off'
    }
  ];

  return (
    <section className="py-20 bg-white" data-testid="pricing-section">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t('Simple, Transparent Pricing', 'सरल और पारदर्शी मूल्य')}
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl p-8 transition-all duration-200 hover:-translate-y-2 ${
                plan.popular
                  ? 'shadow-xl border-2 border-blue-600'
                  : 'shadow-lg border border-gray-200'
              }`}
              data-testid={`pricing-card-${plan.id}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  {t('Popular', 'लोकप्रिय')}
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <span className="text-gray-400 line-through text-lg">₹{plan.originalPrice}</span>
                  <span className="text-4xl font-bold text-gray-900">₹{plan.price}</span>
                </div>
                <p className="text-sm text-gray-600">{plan.description}</p>
              </div>

              <button
                onClick={() => onSelectPlan(plan)}
                className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 ${
                  plan.popular
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}
                data-testid={`select-plan-${plan.id}`}
              >
                {t('Select Plan', 'योजना चुनें')}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
