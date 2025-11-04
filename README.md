Blue Bolt Electric - E-Bike Rentals in Kaashi

A clean, minimalist website for electric cycle rentals in Varanasi with WhatsApp integration and automated Razorpay payment processing.

Live Features

Bilingual Support - English/Hindi toggle
Premium E-Bike - Single model with competitive pricing
6 Tech Accessories - Smart glasses, helmet, GoPro, power bank, phone mount, speaker
Shopping Cart - Real-time updates with localStorage
6-Step Checkout - Contact, KYC, Emergency, Duration, Delivery, Review
OTP Verification - Mock SMS verification
KYC Upload - ID proof and selfie
Razorpay Integration - Automated payment link generation
WhatsApp Integration - Direct booking communication to +91 77098 92835
Responsive Design - Mobile-first approach

Quick Start

```bash
# Check services
sudo supervisorctl status

# Restart if needed
sudo supervisorctl restart all

# View logs
tail -f /var/log/supervisor/backend.*.log
tail -f /var/log/supervisor/frontend.*.log
```

Test Booking Flow

1. **Open the website** (frontend is already running)
2. **Browse pricing** - See 3 plans (Daily ₹449, Weekly ₹1,799, Monthly ₹4,499)
3. **Add accessories** - Select from 6 premium tech items
4. **View cart** - Click cart icon in header
5. **Checkout** - Complete 6-step process
6. **OTP** - Use the OTP shown in the response
7. **Upload KYC** - Test with any images
8. **Complete booking** - Get booking ID and payment link
9. **WhatsApp redirect** - Automatically opens WhatsApp with booking details

API Testing

```bash
# Test products
curl http://localhost:8001/api/products | python3 -m json.tool

# Test OTP
curl -X POST http://localhost:8001/api/otp/send \
  -H "Content-Type: application/json" \
  -d '{"mobile": "+919876543210"}'

# Test booking (full flow)
curl -X POST http://localhost:8001/api/booking/create \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "mobile": "+919876543210",
    "email": "test@example.com",
    "cart_items": [
      {"product_id": "cycle-1", "quantity": 1}
    ],
    "emergency_contact": {
      "name": "Emergency Contact",
      "mobile": "+919999999999",
      "relationship": "friend"
    },
    "rental_start": "2025-11-05T10:00:00Z",
    "rental_end": "2025-11-08T10:00:00Z",
    "delivery_address": "Test Address, Varanasi"
  }'
```

Razorpay Test

- Test Cards: 
  - Success: 4111 1111 1111 1111
  - Any CVV, future expiry

 Key Files

```
/app/
├── backend/server.py          # Main API with Razorpay integration
├── frontend/src/
│   ├── App.js                 # Main app with routing
│   ├── contexts/
│   │   ├── LanguageContext.js # Bilingual support
│   │   └── CartContext.js     # Shopping cart
│   └── components/
│       ├── Header.js          # Sticky header with cart
│       ├── Hero.js            # Hero with CTA
│       ├── Pricing.js         # 3 pricing tiers
│       ├── Accessories.js     # 6 tech items
│       ├── ShoppingCart.js    # Slide-in cart
│       ├── Checkout.js        # 6-step checkout
│       └── Success.js         # Booking confirmation
```

Endpoints

- `GET /api/` - Health check
- `GET /api/products` - All products
- `POST /api/otp/send` - Send OTP
- `POST /api/otp/verify` - Verify OTP
- `POST /api/booking/create` - Create booking + payment link
- `GET /api/booking/{id}` - Get booking
- `POST /api/kyc/upload` - Upload KYC
- `POST /api/payment/webhook` - Razorpay webhook

Design Reference

- Clean white backgrounds
- Generous spacing
- Smooth transitions
- Card-based layouts
- Minimal color palette (Blue #2563EB primary)


Booking messages include:
- Booking ID
- Customer name
- Razorpay payment link

Environment Variables

Backend
- `RAZORPAY_KEY_ID` - Test key configured
- `RAZORPAY_KEY_SECRET` - Test secret configured
- `WHATSAPP_NUMBER` - +917709892835
- `MONGO_URL` - MongoDB connection

Frontend
- `REACT_APP_BACKEND_URL` - Already configured

Products in Database

1. Electric Cycle - ₹499 → ₹449/day (₹2,000 deposit)
2. Meta Ray-Ban Smart Glasses - ₹1,000/day (₹5,000 deposit)
3. Smart Helmet with HUD - ₹250/day (₹1,500 deposit)
4. GoPro Hero 11 - ₹1,200/day (₹8,000 deposit)
5. Portable Power Bank - ₹150/day (₹500 deposit)
6. Premium Phone Mount - ₹100/day (₹300 deposit)
7. Bluetooth Speaker - ₹200/day (₹1,000 deposit)

User Flow

1. Land on hero → See "Explore Varanasi Electrically"
2. Click "Book Your Ride" → Scroll to pricing
3. Select plan → Scroll to accessories
4. Add accessories to cart → Cart slides in from right
5. Proceed to checkout → 6-step modal opens
6. Complete all steps → Booking created
7. Payment link generated → WhatsApp opens
8. Customer pays → Webhook confirms → E-bike delivered

