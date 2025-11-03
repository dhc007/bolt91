import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
import { ShoppingCart } from 'lucide-react';

const Header = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const { cart, setIsCartOpen } = useCart();

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm transition-shadow duration-300" data-testid="header">
      <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2" data-testid="logo">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">BB</span>
          </div>
          <span className="text-xl font-bold text-gray-900">Bolt91</span>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-6">
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
            data-testid="language-toggle"
          >
            {language === 'en' ? 'हिं' : 'EN'}
          </button>

          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors"
            data-testid="cart-button"
          >
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
