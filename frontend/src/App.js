import React, { useState, useEffect } from 'react';
import './App.css';
import { LanguageProvider } from './contexts/LanguageContext';
import { CartProvider } from './contexts/CartContext';
import Header from './components/Header';
import Hero from './components/Hero';
import Pricing from './components/Pricing';
import Accessories from './components/Accessories';
import HowItWorks from './components/HowItWorks';
import ShoppingCart from './components/ShoppingCart';
import Checkout from './components/Checkout';
import Success from './components/Success';
import Footer from './components/Footer';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function App() {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [whatsappURL, setWhatsappURL] = useState('');

  // Test API connection
  useEffect(() => {
    const testAPI = async () => {
      try {
        const response = await axios.get(`${API}/`);
        console.log('API connected:', response.data);
      } catch (error) {
        console.error('API connection error:', error);
      }
    };
    testAPI();
  }, []);

  const handleBookNow = () => {
    window.scrollTo({ top: document.getElementById('pricing')?.offsetTop - 100, behavior: 'smooth' });
  };

  const handleSelectPlan = (plan) => {
    // Scroll to accessories
    window.scrollTo({ top: document.getElementById('accessories')?.offsetTop - 100, behavior: 'smooth' });
  };

  const handleCheckout = () => {
    setIsCheckoutOpen(true);
  };

  const handleBookingSuccess = (booking, whatsappLink) => {
    setBookingSuccess(booking);
    setWhatsappURL(whatsappLink);
    setIsCheckoutOpen(false);
  };

  const handleCloseSuccess = () => {
    setBookingSuccess(null);
    window.location.reload(); // Refresh page to clear cart
  };

  return (
    <LanguageProvider>
      <CartProvider>
        <div className="App min-h-screen bg-white">
          <Header />
          
          <main>
            <Hero onBookNow={handleBookNow} />
            
            <div id="pricing">
              <Pricing onSelectPlan={handleSelectPlan} />
            </div>
            
            <div id="accessories">
              <Accessories />
            </div>
            
            <HowItWorks />
          </main>

          <Footer />

          {/* Shopping Cart */}
          <ShoppingCart onCheckout={handleCheckout} />

          {/* Checkout Modal */}
          <Checkout
            isOpen={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)}
            onSuccess={handleBookingSuccess}
          />

          {/* Success Screen */}
          {bookingSuccess && (
            <Success
              booking={bookingSuccess}
              whatsappURL={whatsappURL}
              onClose={handleCloseSuccess}
            />
          )}
        </div>
      </CartProvider>
    </LanguageProvider>
  );
}

export default App;
