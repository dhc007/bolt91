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
          <img 
            src="https://customer-assets.emergentagent.com/job_whatsapp-connect-35/artifacts/kv5b31vd_Screenshot%202025-11-03%20at%206.27.43%E2%80%AFPM.png"
            alt="Bolt91"
            className="h-8 w-auto"
          />
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
