import React from 'react';
import { useCart } from '../contexts/CartContext';
import { useLanguage } from '../contexts/LanguageContext';
import { X, Trash2, ShoppingBag } from 'lucide-react';

const ShoppingCart = ({ onCheckout }) => {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, getTotal, getSecurityDeposit } = useCart();
  const { language, t } = useLanguage();

  if (!isCartOpen) return null;

  const total = getTotal();
  const securityDeposit = getSecurityDeposit();
  const grandTotal = total + securityDeposit;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={() => setIsCartOpen(false)}
        data-testid="cart-backdrop"
      ></div>

      {/* Cart Panel */}
      <div
        className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col animate-slide-in"
        data-testid="shopping-cart-panel"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <ShoppingBag className="w-6 h-6" />
            <span>{t('Your Cart', 'आपकी कार्ट')}</span>
          </h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            data-testid="close-cart-button"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center text-gray-500 py-12" data-testid="empty-cart-message">
              <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>{t('Your cart is empty', 'आपकी कार्ट खाली है')}</p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="bg-gray-50 rounded-xl p-4 flex items-start space-x-4"
                data-testid={`cart-item-${item.id}`}
              >
                <img
                  src={item.image_url}
                  alt={language === 'en' ? item.name : item.name_hi}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {language === 'en' ? item.name : item.name_hi}
                  </h3>
                  {item.selectedPlan && (
                    <p className="text-xs text-blue-600 font-semibold mb-1">
                      {item.selectedPlan.name} - {item.planDuration}
                    </p>
                  )}
                  <p className="text-sm text-gray-600">
                    ₹{item.displayPrice || item.discounted_price} × {item.quantity}
                  </p>
                  {item.category === 'cycle' && (
                    <p className="text-xs text-gray-500">
                      {t('Security Deposit', 'सुरक्षा जमा')}: ₹2,000 (1-7 days) / ₹5,000 (8+ days)
                    </p>
                  )}
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  data-testid={`remove-item-${item.id}`}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-gray-200 p-6 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{t('Rental Amount', 'किराया राशि')}</span>
                <span className="font-semibold">₹{total.toFixed(2)}</span>
              </div>
              {securityDeposit > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t('Security Deposit', 'सुरक्षा जमा')}</span>
                  <span className="font-semibold">₹{securityDeposit.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                <span>{t('Total', 'कुल')}</span>
                <span>₹{grandTotal.toFixed(2)}</span>
              </div>
              {securityDeposit > 0 && (
                <p className="text-xs text-gray-500">
                  {t('Refundable security deposit', 'वापसी योग्य सुरक्षा जमा')}
                </p>
              )}
            </div>

            <button
              onClick={onCheckout}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl transition-colors"
              data-testid="proceed-to-checkout-button"
            >
              {t('Proceed to Checkout', 'चेकआउट के लिए आगे बढ़ें')}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default ShoppingCart;
