# 🐆 Kadi Thrift - Full-Stack E-Commerce Platform

A modern, full-featured e-commerce platform for thrift clothing, built with Django REST Framework and React. Features include Google OAuth authentication, Pesapal payment integration, and Cloudinary media management.

![Kadi Thrift Banner](https://res.cloudinary.com/dudqljqqc/image/upload/your-banner-image.jpg)


## 🌐 View Live Application

<div align="center">

### 👉 [**View Live App**](https://ecommerce-project-ochre-five.vercel.app/) 👈
- **Backend API:** [https://ecommerce-project-production-f8f8.up.railway.app/api/](https://ecommerce-project-production-f8f8.up.railway.app/api/)
- **Admin Dashboard:** [https://ecommerce-project-production-f8f8.up.railway.app/admin/](https://ecommerce-project-production-f8f8.up.railway.app/admin/)

## ✨ Features

### Customer Features
- 🛍️ Browse products with real-time search and filtering
- 🔐 Google OAuth authentication
- 🛒 Shopping cart with persistent storage
- 💳 Secure payment processing via Pesapal (M-Pesa)
- 📦 Order tracking and history
- 📱 Fully responsive mobile design
- 🎬 Product videos and image galleries
- 🌍 Location-based delivery fees

### Admin Features
- ➕ Product management (CRUD operations)
- 🖼️ Multi-image and video uploads via Cloudinary
- 📋 Order management and status updates
- 🚚 Delivery zone configuration
- 👥 User management
- 📈 Real-time statistics

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animations
- **React Hot Toast** - Notifications
- **Vercel** - Deployment

### Backend
- **Django 5.2** - Web framework
- **Django REST Framework** - API development
- **PostgreSQL** - Database (Railway)
- **Cloudinary** - Media storage
- **WhiteNoise** - Static file serving
- **Pesapal API** - Payment processing
- **Google OAuth 2.0** - Authentication
- **Railway** - Deployment

## 📁 Project Structure
```
ecommerce-project/
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React Context (Cart, Auth)
│   │   ├── services/       # API services
│   │   └── App.jsx
│   └── package.json
│
├── backend/                # Django backend
│   ├── shop/               # Main app
│   │   ├── models.py       # Database models
│   │   ├── views.py        # API views
│   │   ├── serializers.py  # DRF serializers
│   │   ├── urls.py         # URL routing
│   │   └── pesapal.py      # Payment integration
│   ├── ecommerce/          # Project settings
│   ├── manage.py
│   └── requirements.txt
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Python 3.14+
- Node.js 18+
- PostgreSQL (for production) or SQLite (for development)
- Cloudinary account
- Google OAuth credentials
- Pesapal merchant account

### Backend Setup

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/ecommerce-project.git
cd ecommerce-project/backend
```

2. **Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Environment variables**
Create a `.env` file in the backend directory:
```env
SECRET_KEY=your-django-secret-key
DEBUG=True
DATABASE_URL=postgresql://...  # Optional for local dev

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Pesapal
PESAPAL_CONSUMER_KEY=your-consumer-key
PESAPAL_CONSUMER_SECRET=your-consumer-secret
PESAPAL_ENVIRONMENT=live
PESAPAL_IPN_ID=your-ipn-id

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

5. **Run migrations**
```bash
python manage.py migrate
```

6. **Create superuser**
```bash
python manage.py createsuperuser
```

7. **Run development server**
```bash
python manage.py runserver
```

Backend will be available at `http://127.0.0.1:8000/`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd ../frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment variables**
Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://127.0.0.1:8000/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

4. **Run development server**
```bash
npm run dev
```

Frontend will be available at `http://localhost:5173/`


## 🌟 Key Implementations

### Google OAuth Integration
```python
# Backend: shop/views.py
@api_view(['POST'])
@permission_classes([AllowAny])
def google_login(request):
    token = request.data.get('access_token')
    idinfo = id_token.verify_oauth2_token(token, google_requests.Request(), GOOGLE_CLIENT_ID)
    # Create or get user, return auth token
```

### Pesapal Payment Flow
```python
# Submit order to Pesapal
pesapal_response = pesapal_client.submit_order(
    order_id=merchant_ref,
    amount=float(order.total_amount),
    description=f"Kadi Thrift Order #{order.id}",
    callback_url=callback_url,
    customer_email=request.user.email
)
```

### Cloudinary Image Upload
```python
# models.py - Using CloudinaryField
from cloudinary.models import CloudinaryField

class Product(models.Model):
    image = CloudinaryField('image', folder='products')
```

## 🚀 Deployment

### Backend (Railway)
1. Connect GitHub repository to Railway
2. Add environment variables in Railway dashboard
3. Deploy automatically on push to main branch

### Frontend (Vercel)
1. Connect GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variables
5. Deploy automatically on push to main branch

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login
- `POST /api/auth/google/` - Google OAuth login
- `POST /api/auth/logout/` - Logout
- `GET /api/auth/user/` - Get current user

### Products
- `GET /api/products/` - List all products
- `GET /api/products/{id}/` - Get product detail
- `POST /api/admin/products/create/` - Create product (admin)
- `PUT /api/admin/products/{id}/update/` - Update product (admin)
- `DELETE /api/admin/products/{id}/delete/` - Delete product (admin)

### Orders
- `POST /api/orders/create/` - Create order
- `GET /api/orders/user/` - Get user's orders
- `GET /api/orders/{id}/verify-payment/` - Verify payment status

### Admin
- `GET /api/admin/stats/` - Dashboard statistics
- `GET /api/admin/orders/` - All orders
- `PUT /api/admin/orders/{id}/status/` - Update order status

## 🐛 Known Issues & Future Improvements

- [ ] Add wishlist functionality
- [ ] Implement product reviews and ratings
- [ ] Add email notifications for order updates
- [ ] Implement real-time chat support
- [ ] Add product recommendations
- [ ] Multi-currency support
- [ ] Progressive Web App (PWA) features


Computer Science Graduate from Chuka University (2024)  
Full-Stack Developer specializing in React and Django

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Django REST Framework documentation
- React documentation
- Cloudinary for media management
- Pesapal for payment processing
- Railway and Vercel for hosting

---

⭐ **Star this repo if you found it helpful!**

🐆 **Kadi Thrift** - Affordable vintage fashion for everyone
