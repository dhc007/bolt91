import React, { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
import { Check } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Pricing = ({ onSelectPlan }) => {
  const { t } = useLanguage();
  const { addToCart } = useCart();
  const [cycleProducts, setCycleProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState('daily');

  useEffect(() => {
    const fetchCycles = async () => {
      try {
        const response = await axios.get(`${API}/products`);
        const cycles = response.data.filter(p => p.category === 'cycle');
        console.log('Fetched cycles:', cycles);
        setCycleProducts(cycles);
      } catch (error) {
        console.error('Error fetching cycles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCycles();
  }, []);

  const plans = [
    {
      id: 'daily',
      name: t('DAILY', 'दैनिक'),
      duration: t('1 Day', '1 दिन'),
      originalPrice: 499,
      price: 449,
      description: t('Perfect for day trips', 'दिन की यात्राओं के लिए'),
      features: [
        t('24-hour rental', '24 घंटे की किराया'),
        t('₹2,000 security deposit', '₹2,000 सुरक्षा जमा'),
        t('Free delivery', 'मुफ्त डिलीवरी'),
        t('Helmet included', 'हेलमेट शामिल')
      ]
    },
    {
      id: 'weekly',
      name: t('WEEKLY', 'साप्ताहिक'),
      duration: t('7 Days', '7 दिन'),
      originalPrice: 1999,
      price: 1799,
      description: t('Best value for explorers', 'यात्रियों के लिए सबसे अच्छा'),
      popular: true,
      features: [
        t('7-day rental', '7 दिन की किराया'),
        t('₹2,000 security deposit', '₹2,000 सुरक्षा जमा'),
        t('Free delivery & pickup', 'मुफ्त डिलीवरी और पिकअप'),
        t('Helmet + Lock included', 'हेलमेट + लॉक शामिल')
      ]
    },
    {
      id: 'monthly',
      name: t('MONTHLY', 'मासिक'),
      duration: t('30 Days', '30 दिन'),
      originalPrice: 4999,
      price: 4499,
      description: t('Long-term explorers', 'लंबी अवधि के लिए'),
      features: [
        t('30-day rental', '30 दिन की किराया'),
        t('₹5,000 security deposit', '₹5,000 सुरक्षा जमा'),
        t('Free delivery & pickup', 'मुफ्त डिलीवरी और पिकअप'),
        t('Free maintenance', 'मुफ्त रखरखाव')
      ]
    }
  ];

  const handlePlanClick = (planId) => {
    console.log('Plan clicked:', planId);
    setSelectedPlan(planId);
  };

  const handleBookRide = () => {
    // Find the cycle product matching selected plan by ID
    let cycleId = '';
    if (selectedPlan === 'daily') cycleId = 'cycle-daily';
    else if (selectedPlan === 'weekly') cycleId = 'cycle-weekly';
    else if (selectedPlan === 'monthly') cycleId = 'cycle-monthly';
    
    const cycleProduct = cycleProducts.find(c => c.id === cycleId);
    console.log('Selected plan:', selectedPlan, 'Cycle ID:', cycleId, 'Found product:', cycleProduct);
    
    if (cycleProduct) {
      addToCart(cycleProduct);
      const selectedPlanData = plans.find(p => p.id === selectedPlan);
      if (onSelectPlan) {
        onSelectPlan(selectedPlanData);
      }
    } else {
      console.error('Cycle product not found for plan:', selectedPlan);
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center">{t('Loading...', 'लोड हो रहा है...')}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white" data-testid="pricing-section">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t('Choose Your Plan', 'अपनी योजना चुनें')}
          </h2>
          <p className="text-lg text-gray-600">
            {t('Select the perfect rental duration for your Kashi adventure', 'अपने काशी के रोमांच के लिए सही किराया अवधि चुनें')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-center">
          {/* LEFT: Plan Selection */}
          <div className="space-y-4">
            {plans.map((plan) => (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`relative bg-white rounded-2xl p-6 cursor-pointer transition-all duration-200 border-2 ${
                  selectedPlan === plan.id
                    ? 'border-blue-600 shadow-xl scale-105'
                    : 'border-gray-200 shadow-lg hover:border-blue-300'
                }`}
                data-testid={`pricing-card-${plan.id}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-6 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-semibold">
                    {t('Most Popular', 'सबसे लोकप्रिय')}
                  </div>
                )}

                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          selectedPlan === plan.id
                            ? 'border-blue-600 bg-blue-600'
                            : 'border-gray-300'
                        }`}
                      >
                        {selectedPlan === plan.id && <Check className="w-4 h-4 text-white" />}
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{plan.description}</p>
                    <p className="text-sm font-semibold text-blue-600">{plan.duration}</p>
                  </div>

                  <div className="text-right">
                    <div className="text-gray-400 line-through text-sm">₹{plan.originalPrice}</div>
                    <div className="text-3xl font-bold text-gray-900">₹{plan.price}</div>
                    <div className="text-xs text-green-600 font-semibold">Save ₹{plan.originalPrice - plan.price}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <button
              onClick={handleBookRide}
              disabled={cycleProducts.length === 0}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-200 hover:-translate-y-1 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="book-ride-button"
            >
              {t('Book Your Ride', 'अपनी सवारी बुक करें')} →
            </button>

            <p className="text-xs text-center text-gray-500">
              {t('Security deposit refundable after return', 'सुरक्षा जमा वापसी के बाद वापस की जाएगी')}
            </p>
          </div>

          {/* RIGHT: E-Cycle Image */}
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 lg:p-12">
              <div className="aspect-square relative">
                {cycleProducts.length > 0 && (
                  <img
                    src={cycleProducts[0].image_url}
                    alt={t('Bolt91 E-Cycle', 'Bolt91 ई-साइकिल')}
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
              
              <div className="mt-6 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {t('Bolt91 E-Cycle', 'Bolt91 ई-साइकिल')}
                </h3>
                <p className="text-gray-600 mb-4">
                  {t('Explore Kashi in eco-friendly style', 'पर्यावरण के अनुकूल शैली में काशी की खोज करें')}
                </p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-white rounded-lg p-3">
                    <div className="font-semibold text-gray-900">
                      {t('40 km', '40 किमी')}
                    </div>
                    <div className="text-gray-600 text-xs">
                      {t('Range', 'रेंज')}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <div className="font-semibold text-gray-900">
                      {t('25 km/h', '25 किमी/घंटा')}
                    </div>
                    <div className="text-gray-600 text-xs">
                      {t('Top Speed', 'अधिकतम गति')}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <div className="font-semibold text-gray-900">
                      {t('3-4 hrs', '3-4 घंटे')}
                    </div>
                    <div className="text-gray-600 text-xs">
                      {t('Charging', 'चार्जिंग')}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <div className="font-semibold text-gray-900">
                      {t('120 kg', '120 किग्रा')}
                    </div>
                    <div className="text-gray-600 text-xs">
                      {t('Load', 'भार')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
