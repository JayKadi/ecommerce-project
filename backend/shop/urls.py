from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProductViewSet, OrderViewSet, register, login, logout, get_user,
    google_login, google_callback_redirect,
    # Order views
    get_delivery_zones, create_order, user_orders,
    # Pesapal views
    pesapal_callback, verify_payment,
    # Admin views
    check_admin, admin_dashboard_stats, admin_all_products,
    admin_update_product, admin_delete_product, admin_create_product,
    admin_all_orders, admin_update_order_status
)

router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'orders', OrderViewSet, basename='order')

urlpatterns = [
    # Auth endpoints (BEFORE router)
    path('auth/register/', register, name='register'),
    path('auth/login/', login, name='login'),
    path('auth/logout/', logout, name='logout'),
    path('auth/user/', get_user, name='get_user'),
    path('auth/google/', google_login, name='google_login'),
    path('auth/google/callback/', google_callback_redirect, name='google_callback'),  
    
    # Delivery zones (BEFORE router)
    path('delivery-zones/', get_delivery_zones, name='delivery_zones'),
    
    # Order management (BEFORE router) - IMPORTANT!
    path('orders/create/', create_order, name='create_order'),
    path('orders/<int:order_id>/verify-payment/', verify_payment, name='verify_payment'),
    path('orders/user/', user_orders, name='user-orders'),
    # Pesapal payment endpoints (BEFORE router)
    path('pesapal/callback/', pesapal_callback, name='pesapal_callback'),
    
    # Admin endpoints (BEFORE router)
    path('admin/check/', check_admin, name='check_admin'),
    path('admin/stats/', admin_dashboard_stats, name='admin_stats'),
    path('admin/products/', admin_all_products, name='admin_all_products'),
    path('admin/products/create/', admin_create_product, name='admin_create_product'),
    path('admin/products/<int:pk>/update/', admin_update_product, name='admin_update_product'),
    path('admin/products/<int:pk>/delete/', admin_delete_product, name='admin_delete_product'),
    path('admin/orders/', admin_all_orders, name='admin_all_orders'),
    path('admin/orders/<int:pk>/status/', admin_update_order_status, name='admin_update_order_status'),
    
    # Router endpoints (LAST!) - These catch everything else
    path('', include(router.urls)),
]