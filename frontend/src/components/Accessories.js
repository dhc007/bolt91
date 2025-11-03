import React, { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Accessories = () => {
  const { language, t } = useLanguage();
  const { addToCart } = useCart();
  const [accessories, setAccessories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccessories = async () => {
      try {
        const response = await axios.get(`${API}/products`);
        const accessoryProducts = response.data.filter(p => p.category === 'accessory');
        setAccessories(accessoryProducts);
      } catch (error) {
        console.error('Error fetching accessories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccessories();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center">Loading accessories...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50" data-testid="accessories-section">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t('Add Premium Accessories', 'प्रीमियम एक्सेसरीज़ जोड़ें')}
          </h2>
          <p className="text-lg text-gray-600">
            {t(
              'Enhance your ride with cutting-edge tech accessories',
              'अत्याधुनिक तकनीकी एक्सेसरीज़ के साथ अपनी सवारी को बेहतर बनाएं'
            )}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {accessories.map((accessory) => (
            <div
              key={accessory.id}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-2"
              data-testid={`accessory-card-${accessory.id}`}
            >
              <div className="aspect-video bg-gray-200 overflow-hidden">
                <img
                  src={accessory.image_url}
                  alt={language === 'en' ? accessory.name : accessory.name_hi}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {language === 'en' ? accessory.name : accessory.name_hi}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {language === 'en' ? accessory.description : accessory.description_hi}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">
                    ₹{accessory.discounted_price}
                    <span className="text-sm text-gray-600 font-normal">/day</span>
                  </span>
                  <button
                    onClick={() => addToCart(accessory)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
                    data-testid={`add-to-cart-${accessory.id}`}
                  >
                    {t('+ Add', '+ जोड़ें')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Accessories;
