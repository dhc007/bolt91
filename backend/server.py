from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File, Form
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import razorpay
import random
import json

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Razorpay client
razorpay_client = razorpay.Client(auth=(os.environ['RAZORPAY_KEY_ID'], os.environ['RAZORPAY_KEY_SECRET']))

# WhatsApp number
WHATSAPP_NUMBER = os.environ.get('WHATSAPP_NUMBER', '+917709892835')

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Ensure upload directory exists
UPLOAD_DIR = ROOT_DIR / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


# ============== MODELS ==============

class Product(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    name_hi: str
    description: str
    description_hi: str
    price: float
    discounted_price: float
    security_deposit: float
    category: str  # "cycle" or "accessory"
    image_url: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class CartItem(BaseModel):
    product_id: str
    quantity: int = 1


class OTPRequest(BaseModel):
    mobile: str


class OTPVerify(BaseModel):
    mobile: str
    otp: str


class EmergencyContact(BaseModel):
    name: str
    mobile: str
    relationship: str


class BookingCreate(BaseModel):
    # Contact Details
    name: str
    mobile: str
    email: Optional[EmailStr] = None
    
    # Cart Items
    cart_items: List[CartItem]
    
    # Emergency Contact
    emergency_contact: EmergencyContact
    
    # Rental Duration
    rental_start: str  # ISO date string
    rental_end: str
    
    # Delivery Address
    delivery_address: str
    delivery_latitude: Optional[float] = None
    delivery_longitude: Optional[float] = None


class Booking(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    booking_id: str = Field(default_factory=lambda: f"BB{random.randint(10000, 99999)}")
    
    # Contact Details
    name: str
    mobile: str
    email: Optional[str] = None
    
    # Cart Items
    cart_items: List[CartItem]
    
    # Emergency Contact
    emergency_contact: EmergencyContact
    
    # Rental Duration
    rental_start: str
    rental_end: str
    
    # Delivery Address
    delivery_address: str
    delivery_latitude: Optional[float] = None
    delivery_longitude: Optional[float] = None
    
    # Payment
    total_amount: float
    security_deposit: float
    razorpay_order_id: Optional[str] = None
    razorpay_payment_id: Optional[str] = None
    payment_status: str = "pending"  # pending, completed, failed
    payment_link: Optional[str] = None
    
    # KYC
    kyc_id_proof: Optional[str] = None
    kyc_selfie: Optional[str] = None
    
    status: str = "pending"  # pending, confirmed, completed, cancelled
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# ============== HELPER FUNCTIONS ==============

async def initialize_products():
    """Initialize products if not exists"""
    count = await db.products.count_documents({})
    if count == 0:
        products = [
            # Electric Cycle
            {
                "id": "cycle-1",
                "name": "Premium Electric Cycle",
                "name_hi": "प्रीमियम इलेक्ट्रिक साइकिल",
                "description": "Premium e-bike with cutting-edge accessories",
                "description_hi": "आधुनिक एक्सेसरीज़ के साथ प्रीमियम ई-बाइक",
                "price": 499.0,
                "discounted_price": 449.0,
                "security_deposit": 2000.0,
                "category": "cycle",
                "image_url": "https://images.pexels.com/photos/5784358/pexels-photo-5784358.jpeg",
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            # Tech Accessories (No security deposit for accessories)
            {
                "id": "acc-1",
                "name": "Meta Ray-Ban Smart Glasses",
                "name_hi": "मेटा रे-बैन स्मार्ट चश्मा",
                "description": "Capture moments hands-free",
                "description_hi": "हाथों के बिना पल कैद करें",
                "price": 1000.0,
                "discounted_price": 1000.0,
                "security_deposit": 0.0,
                "category": "accessory",
                "image_url": "https://images.unsplash.com/photo-1572635196237-14b3f281503f",
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": "acc-2",
                "name": "Smart Helmet with HUD",
                "name_hi": "स्मार्ट हेलमेट एचयूडी के साथ",
                "description": "Navigation in your vision",
                "description_hi": "आपकी दृष्टि में नेविगेशन",
                "price": 250.0,
                "discounted_price": 250.0,
                "security_deposit": 0.0,
                "category": "accessory",
                "image_url": "https://images.unsplash.com/photo-1581598584785-09d9b7aa2b05",
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": "acc-3",
                "name": "GoPro Hero 11",
                "name_hi": "गोप्रो हीरो 11",
                "description": "4K adventure recording",
                "description_hi": "4K एडवेंचर रिकॉर्डिंग",
                "price": 1200.0,
                "discounted_price": 1200.0,
                "security_deposit": 0.0,
                "category": "accessory",
                "image_url": "https://images.unsplash.com/photo-1690176483540-421999eea5dd",
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": "acc-4",
                "name": "Portable Power Bank",
                "name_hi": "पोर्टेबल पावर बैंक",
                "description": "Never run out of charge",
                "description_hi": "कभी चार्ज खत्म नहीं",
                "price": 150.0,
                "discounted_price": 150.0,
                "security_deposit": 0.0,
                "category": "accessory",
                "image_url": "https://images.pexels.com/photos/518530/pexels-photo-518530.jpeg",
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": "acc-5",
                "name": "Premium Phone Mount",
                "name_hi": "प्रीमियम फोन माउंट",
                "description": "Secure navigation setup",
                "description_hi": "सुरक्षित नेविगेशन",
                "price": 100.0,
                "discounted_price": 100.0,
                "security_deposit": 0.0,
                "category": "accessory",
                "image_url": "https://images.unsplash.com/photo-1761721576781-baaf47945242",
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": "acc-6",
                "name": "Bluetooth Speaker",
                "name_hi": "ब्लूटूथ स्पीकर",
                "description": "Soundtrack your journey",
                "description_hi": "अपनी यात्रा को संगीतमय बनाएं",
                "price": 200.0,
                "discounted_price": 200.0,
                "security_deposit": 0.0,
                "category": "accessory",
                "image_url": "https://images.unsplash.com/photo-1589256469067-ea99122bbdc4",
                "created_at": datetime.now(timezone.utc).isoformat()
            }
        ]
        await db.products.insert_many(products)
        logger.info(f"Initialized {len(products)} products")


# ============== ROUTES ==============

@api_router.get("/")
async def root():
    return {"message": "Bolt91 API", "whatsapp": WHATSAPP_NUMBER}


@api_router.get("/products", response_model=List[Product])
async def get_products():
    """Get all products (cycle + accessories)"""
    products = await db.products.find({}, {"_id": 0}).to_list(100)
    
    # Convert ISO string timestamps back to datetime objects
    for product in products:
        if isinstance(product.get('created_at'), str):
            product['created_at'] = datetime.fromisoformat(product['created_at'])
    
    return products


@api_router.post("/otp/send")
async def send_otp(request: OTPRequest):
    """Mock OTP send - stores OTP in memory"""
    # Generate random 6-digit OTP
    otp = f"{random.randint(100000, 999999)}"
    
    # Store in database (in production, use Redis with expiry)
    await db.otps.update_one(
        {"mobile": request.mobile},
        {"$set": {"otp": otp, "created_at": datetime.now(timezone.utc).isoformat()}},
        upsert=True
    )
    
    logger.info(f"Mock OTP sent to {request.mobile}: {otp}")
    
    return {
        "success": True,
        "message": "OTP sent successfully",
        "otp": otp  # Remove this in production!
    }


@api_router.post("/otp/verify")
async def verify_otp(request: OTPVerify):
    """Mock OTP verification"""
    otp_record = await db.otps.find_one({"mobile": request.mobile})
    
    if not otp_record:
        raise HTTPException(status_code=404, detail="OTP not found")
    
    if otp_record["otp"] != request.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")
    
    # Delete OTP after verification
    await db.otps.delete_one({"mobile": request.mobile})
    
    return {
        "success": True,
        "message": "OTP verified successfully"
    }


@api_router.post("/kyc/upload")
async def upload_kyc(
    booking_id: str = Form(...),
    id_proof: UploadFile = File(...),
    selfie: UploadFile = File(...)
):
    """Upload KYC documents (ID proof and selfie)"""
    try:
        # Save ID proof
        id_proof_path = UPLOAD_DIR / f"{booking_id}_id_proof_{id_proof.filename}"
        with open(id_proof_path, "wb") as f:
            content = await id_proof.read()
            f.write(content)
        
        # Save selfie
        selfie_path = UPLOAD_DIR / f"{booking_id}_selfie_{selfie.filename}"
        with open(selfie_path, "wb") as f:
            content = await selfie.read()
            f.write(content)
        
        # Update booking with KYC paths
        await db.bookings.update_one(
            {"booking_id": booking_id},
            {"$set": {
                "kyc_id_proof": str(id_proof_path),
                "kyc_selfie": str(selfie_path)
            }}
        )
        
        logger.info(f"KYC uploaded for booking {booking_id}")
        
        return {
            "success": True,
            "message": "KYC documents uploaded successfully",
            "id_proof": str(id_proof_path),
            "selfie": str(selfie_path)
        }
    except Exception as e:
        logger.error(f"Error uploading KYC: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.post("/booking/create", response_model=Booking)
async def create_booking(booking_data: BookingCreate):
    """Create booking and generate Razorpay payment link"""
    try:
        # Fetch products to calculate total
        product_ids = [item.product_id for item in booking_data.cart_items]
        products = await db.products.find({"id": {"$in": product_ids}}, {"_id": 0}).to_list(100)
        
        if not products:
            raise HTTPException(status_code=404, detail="Products not found")
        
        # Create product lookup
        product_map = {p["id"]: p for p in products}
        
        # Calculate number of days
        from datetime import datetime as dt
        start_date = dt.fromisoformat(booking_data.rental_start.replace('Z', '+00:00'))
        end_date = dt.fromisoformat(booking_data.rental_end.replace('Z', '+00:00'))
        num_days = max(1, (end_date - start_date).days)
        
        # Calculate totals
        total_amount = 0.0
        has_cycle = False
        
        for item in booking_data.cart_items:
            product = product_map.get(item.product_id)
            if product:
                total_amount += product["discounted_price"] * item.quantity
                if product["category"] == "cycle":
                    has_cycle = True
        
        # Adjust total for rental period
        total_amount = total_amount * num_days
        
        # Security deposit only for cycles based on rental duration
        # ₹2k for daily/weekly (1-7 days), ₹5k for monthly (8+ days)
        security_deposit = 0.0
        if has_cycle:
            if num_days <= 7:
                security_deposit = 2000.0
            else:
                security_deposit = 5000.0
        
        # Grand total (rental + security deposit)
        grand_total = total_amount + security_deposit
        
        # Create booking object
        booking = Booking(
            name=booking_data.name,
            mobile=booking_data.mobile,
            email=booking_data.email,
            cart_items=booking_data.cart_items,
            emergency_contact=booking_data.emergency_contact,
            rental_start=booking_data.rental_start,
            rental_end=booking_data.rental_end,
            delivery_address=booking_data.delivery_address,
            delivery_latitude=booking_data.delivery_latitude,
            delivery_longitude=booking_data.delivery_longitude,
            total_amount=total_amount,
            security_deposit=security_deposit
        )
        
        # Create Razorpay Payment Link
        try:
            payment_link = razorpay_client.payment_link.create({
                "amount": int(grand_total * 100),  # Convert to paise
                "currency": "INR",
                "description": f"Bolt91 E-Bike Rental - Booking {booking.booking_id}",
                "customer": {
                    "name": booking.name,
                    "contact": booking.mobile,
                    "email": booking.email or f"{booking.mobile}@bolt91.com"
                },
                "notify": {
                    "sms": False,
                    "email": False
                },
                "reminder_enable": False,
                "callback_url": f"{os.environ.get('REACT_APP_BACKEND_URL', 'http://localhost:3000')}/payment-success?booking_id={booking.booking_id}",
                "callback_method": "get"
            })
            
            booking.razorpay_order_id = payment_link.get("id")
            booking.payment_link = payment_link.get("short_url")
            
            logger.info(f"Razorpay payment link created: {booking.payment_link}")
        except Exception as e:
            logger.error(f"Error creating Razorpay payment link: {str(e)}")
            # Continue without payment link in case of error
            booking.payment_link = None
        
        # Save booking to database
        doc = booking.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        
        await db.bookings.insert_one(doc)
        
        logger.info(f"Booking created: {booking.booking_id}")
        
        return booking
    except Exception as e:
        logger.error(f"Error creating booking: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.get("/booking/{booking_id}")
async def get_booking(booking_id: str):
    """Get booking details"""
    booking = await db.bookings.find_one({"booking_id": booking_id}, {"_id": 0})
    
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    # Convert ISO string timestamp back
    if isinstance(booking.get('created_at'), str):
        booking['created_at'] = datetime.fromisoformat(booking['created_at'])
    
    return booking


@api_router.post("/payment/webhook")
async def payment_webhook(request: dict):
    """Handle Razorpay payment webhook"""
    try:
        # In production, verify webhook signature
        logger.info(f"Payment webhook received: {request}")
        
        event = request.get("event")
        payload = request.get("payload", {})
        
        if event == "payment_link.paid":
            payment_link_id = payload.get("payment_link", {}).get("entity", {}).get("id")
            payment_id = payload.get("payment", {}).get("entity", {}).get("id")
            
            # Update booking payment status
            await db.bookings.update_one(
                {"razorpay_order_id": payment_link_id},
                {"$set": {
                    "payment_status": "completed",
                    "razorpay_payment_id": payment_id,
                    "status": "confirmed"
                }}
            )
            
            logger.info(f"Payment completed for payment link: {payment_link_id}")
        
        return {"success": True}
    except Exception as e:
        logger.error(f"Error processing webhook: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    await initialize_products()
    logger.info("Bolt91 API started")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
