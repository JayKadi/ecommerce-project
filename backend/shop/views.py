from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from decouple import config
from .pesapal import pesapal_client
from django.conf import settings

from .models import Product, Order, OrderItem, ProductImage, ProductVideo, DeliveryZone
from .serializers import (
    ProductSerializer, RegisterSerializer, UserSerializer,
    OrderSerializer, OrderCreateSerializer
)


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.action == 'create':
            return OrderCreateSerializer
        return OrderSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = serializer.save()
        
        output_serializer = OrderSerializer(order)
        return Response(output_serializer.data, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user': UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    user = authenticate(username=username, password=password)
    
    if user:
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user': UserSerializer(user).data
        })
    return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    request.user.auth_token.delete()
    return Response({'message': 'Successfully logged out'}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([AllowAny])
def google_login(request):
    """
    Custom Google OAuth login
    """
    try:
        token = request.data.get('access_token')
        
        if not token:
            return Response({'error': 'No token provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Verify the token with Google
        try:
            idinfo = id_token.verify_oauth2_token(
                token, 
                google_requests.Request(), 
                config('GOOGLE_CLIENT_ID')
            )
            
            # Get user info from token
            email = idinfo.get('email')
            name = idinfo.get('name', '')
            given_name = idinfo.get('given_name', '')
            family_name = idinfo.get('family_name', '')
            
            if not email:
                return Response({'error': 'Email not provided by Google'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Check if user exists
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                # Create new user
                username = email.split('@')[0]
                # Make username unique if it exists
                base_username = username
                counter = 1
                while User.objects.filter(username=username).exists():
                    username = f"{base_username}{counter}"
                    counter += 1
                
                user = User.objects.create_user(
                    username=username,
                    email=email,
                    first_name=given_name,
                    last_name=family_name
                )
            
            # Get or create token
            auth_token, created = Token.objects.get_or_create(user=user)
            
            return Response({
                'key': auth_token.key,
                'user': UserSerializer(user).data
            })
            
        except ValueError as e:
            # Invalid token
            return Response({'error': f'Invalid token: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)
            
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

# ===== ADMIN VIEWS =====

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_admin(request):
    """Check if user is admin"""
    return Response({
        'is_admin': request.user.is_staff or request.user.is_superuser
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_dashboard_stats(request):
    """Get dashboard statistics"""
    if not (request.user.is_staff or request.user.is_superuser):
        return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
    
    from django.utils import timezone
    from datetime import timedelta
    
    today = timezone.now().date()
    
    # Today's orders
    today_orders = Order.objects.filter(created_at__date=today)
    
    # Statistics
    stats = {
        'total_products': Product.objects.filter(is_active=True).count(),
        'total_orders': Order.objects.count(),
        'pending_orders': Order.objects.filter(status='pending').count(),
        'today_orders': today_orders.count(),
        'today_revenue': sum(order.total_amount for order in today_orders),
        'low_stock_items': Product.objects.filter(stock__lte=2, is_active=True).count(),
        'total_revenue': sum(order.total_amount for order in Order.objects.all()),
    }
    
    return Response(stats)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_all_products(request):
    """Get all products (including inactive) for admin"""
    if not (request.user.is_staff or request.user.is_superuser):
        return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
    
    products = Product.objects.all().order_by('-created_at')
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def admin_update_product(request, pk):
    """Update product"""
    if not (request.user.is_staff or request.user.is_superuser):
        return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
    
    try:
        product = Product.objects.get(pk=pk)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
    
    try:
        # Update basic fields
        product.name = request.data.get('name', product.name)
        product.description = request.data.get('description', product.description)
        product.price = request.data.get('price', product.price)
        product.stock = request.data.get('stock', product.stock)
        product.category = request.data.get('category', product.category)
        product.size = request.data.get('size', product.size)
        product.condition = request.data.get('condition', product.condition)
        product.instagram_link = request.data.get('instagram_link', product.instagram_link)
        product.tiktok_link = request.data.get('tiktok_link', product.tiktok_link)
        
        if 'is_active' in request.data:
            product.is_active = request.data.get('is_active', 'true').lower() == 'true'
        
        # Update image if provided
        if 'image' in request.FILES:
            product.image = request.FILES['image']
        
        product.save()
        
        # Handle additional images if provided
        if 'additional_images' in request.FILES:
            # Delete old additional images if replacing
            if request.data.get('replace_images') == 'true':
                product.additional_images.all().delete()
            
            additional_images = request.FILES.getlist('additional_images')
            for index, image_file in enumerate(additional_images):
                ProductImage.objects.create(
                    product=product,
                    image=image_file,
                    order=index
                )
        
        # Handle video if provided
        if 'video' in request.FILES:
            # Delete old video if exists
            if hasattr(product, 'video'):
                product.video.delete()
            
            ProductVideo.objects.create(
                product=product,
                video=request.FILES['video'],
                thumbnail=request.FILES.get('video_thumbnail')
            )
        
        serializer = ProductSerializer(product)
        return Response(serializer.data)
    except Exception as e:
        print(f"Error updating product: {str(e)}")
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def admin_delete_product(request, pk):
    """Delete product"""
    if not (request.user.is_staff or request.user.is_superuser):
        return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
    
    try:
        product = Product.objects.get(pk=pk)
        product.delete()
        return Response({'message': 'Product deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def admin_create_product(request):
    """Create new product with additional images and video"""
    if not (request.user.is_staff or request.user.is_superuser):
        return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
    
    try:
        # Create product
        product = Product.objects.create(
            name=request.data.get('name'),
            description=request.data.get('description', ''),
            price=request.data.get('price'),
            stock=request.data.get('stock'),
            category=request.data.get('category'),
            size=request.data.get('size', 'one_size'),
            condition=request.data.get('condition', 'good'),
            instagram_link=request.data.get('instagram_link', ''),
            tiktok_link=request.data.get('tiktok_link', ''),
            image=request.FILES.get('image'),
            is_active=request.data.get('is_active', 'true').lower() == 'true'
        )
        
        # Handle additional images
        additional_images = request.FILES.getlist('additional_images')
        for index, image_file in enumerate(additional_images):
            ProductImage.objects.create(
                product=product,
                image=image_file,
                order=index
            )
        
        # Handle video
        video_file = request.FILES.get('video')
        if video_file:
            ProductVideo.objects.create(
                product=product,
                video=video_file,
                thumbnail=request.FILES.get('video_thumbnail')
            )
        
        serializer = ProductSerializer(product)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Exception as e:
        print(f"Error creating product: {str(e)}")
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_all_orders(request):
    """Get all orders for admin"""
    if not (request.user.is_staff or request.user.is_superuser):
        return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
    
    orders = Order.objects.all().order_by('-created_at')
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def admin_update_order_status(request, pk):
    """Update order status"""
    if not (request.user.is_staff or request.user.is_superuser):
        return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
    
    try:
        order = Order.objects.get(pk=pk)
    except Order.DoesNotExist:
        return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
    
    new_status = request.data.get('status')
    old_status = order.status  # Store old status
    
    if new_status in dict(Order.STATUS_CHOICES):
        order.status = new_status
        order.save()
        
        # If order is cancelled, restore stock
        if new_status == 'cancelled' and old_status != 'cancelled':
            for item in order.items.all():
                product = item.product
                product.stock += item.quantity  # Add back the quantity
                product.save()
        
        serializer = OrderSerializer(order)
        return Response(serializer.data)
    
    return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)
@api_view(['GET'])
def get_delivery_zones(request):
    """Get all active delivery zones"""
    zones = DeliveryZone.objects.filter(is_active=True)
    data = [
        {
            'city': zone.city,
            'delivery_fee': str(zone.delivery_fee),
            'estimated_days': zone.estimated_days
        }
        for zone in zones
    ]
    return Response(data)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):
    """Create order and initiate Pesapal payment"""
    try:
        items_data = request.data.get('items', [])
        
        if not items_data:
            return Response({'error': 'No items in order'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Get delivery zone
        city = request.data.get('shipping_city')
        try:
            delivery_zone = DeliveryZone.objects.get(city=city, is_active=True)
            delivery_fee = delivery_zone.delivery_fee
            estimated_days = delivery_zone.estimated_days
        except DeliveryZone.DoesNotExist:
            delivery_fee = 0
            estimated_days = 3
        
        # Create order
        order = Order.objects.create(
            user=request.user,
            total_amount=request.data.get('total_amount'),
            shipping_address=request.data.get('shipping_address'),
            shipping_city=city,
            shipping_postal_code=request.data.get('shipping_postal_code', ''),
            shipping_country=request.data.get('shipping_country'),
            phone_number=request.data.get('phone_number'),
            whatsapp_number=request.data.get('whatsapp_number', ''),
            delivery_fee=delivery_fee,
            estimated_delivery_days=estimated_days,
            status='pending',
            payment_status='pending'
        )
        
        # Create order items and update stock
        for item in items_data:
            product = Product.objects.get(id=item['product_id'])
            
            if product.stock < item['quantity']:
                order.delete()
                return Response(
                    {'error': f'Insufficient stock for {product.name}'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=item['quantity'],
                price=item['price']
            )
            
            product.stock -= item['quantity']
            product.save()
        
        # Create unique merchant reference
        merchant_ref = f"KT-{order.id}-{int(order.created_at.timestamp())}"
        order.pesapal_merchant_reference = merchant_ref
        order.save()
        
        # Initiate Pesapal payment
        try:
            # Get callback URL (where Pesapal redirects after payment)
            frontend_url = request.build_absolute_uri('/').replace('/api/', '').rstrip('/')
            callback_url = f"{frontend_url}/payment-callback"
            
            # Format customer name
            customer_name = f"{request.user.first_name} {request.user.last_name}".strip()
            if not customer_name:
                customer_name = request.user.username
            
            # Submit order to Pesapal
            pesapal_response = pesapal_client.submit_order(
                order_id=merchant_ref,
                amount=float(order.total_amount),
                description=f"Kadi Thrift Order #{order.id}",
                callback_url=callback_url,
                customer_email=request.user.email,
                customer_phone=request.data.get('phone_number'),
                customer_name=customer_name
            )
            
            print("Pesapal response:", pesapal_response)
            
            # Check if order submission was successful
            if pesapal_response.get('status') == '200':
                order_tracking_id = pesapal_response.get('order_tracking_id')
                redirect_url = pesapal_response.get('redirect_url')
                
                order.pesapal_order_tracking_id = order_tracking_id
                order.save()
                
                serializer = OrderSerializer(order)
                return Response({
                    **serializer.data,
                    'payment_url': redirect_url,
                    'message': 'Order created successfully. Redirecting to payment...'
                }, status=status.HTTP_201_CREATED)
            else:
                # Payment initiation failed
                order.delete()  # Rollback
                return Response({
                    'error': 'Failed to initiate payment',
                    'details': pesapal_response
                }, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as payment_error:
            print(f"Pesapal error: {str(payment_error)}")
            import traceback
            traceback.print_exc()
            order.delete()  # Rollback
            return Response({
                'error': 'Payment initiation failed',
                'details': str(payment_error)
            }, status=status.HTTP_400_BAD_REQUEST)
        
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(f"Error creating order: {str(e)}")
        import traceback
        traceback.print_exc()
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_order(request, pk):
    """Get a specific order"""
    try:
        # Users can only view their own orders, unless they're admin
        if request.user.is_staff or request.user.is_superuser:
            order = Order.objects.get(pk=pk)
        else:
            order = Order.objects.get(pk=pk, user=request.user)
        
        serializer = OrderSerializer(order)
        return Response(serializer.data)
    except Order.DoesNotExist:
        return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
@api_view(['GET'])
@permission_classes([AllowAny])  # Pesapal needs to access this
def pesapal_callback(request):
    """Handle Pesapal payment callback (IPN)"""
    try:
        # Get parameters from Pesapal callback
        order_tracking_id = request.GET.get('OrderTrackingId')
        merchant_reference = request.GET.get('OrderMerchantReference')
        
        print(f"Pesapal callback received - Tracking ID: {order_tracking_id}, Ref: {merchant_reference}")
        
        if not order_tracking_id:
            return Response({'error': 'Missing order tracking ID'}, status=400)
        
        # Get transaction status from Pesapal
        try:
            status_response = pesapal_client.get_transaction_status(order_tracking_id)
            print("Transaction status:", status_response)
            
            # Find order
            try:
                if merchant_reference:
                    order = Order.objects.get(pesapal_merchant_reference=merchant_reference)
                else:
                    order = Order.objects.get(pesapal_order_tracking_id=order_tracking_id)
                
                # Update order based on payment status
                payment_status = status_response.get('payment_status_description', '').lower()
                payment_method = status_response.get('payment_method', '')
                
                if payment_status == 'completed' or status_response.get('status_code') == 1:
                    order.payment_status = 'completed'
                    order.status = 'processing'
                    order.payment_method = payment_method
                    order.save()
                    print(f"Payment successful for Order #{order.id}")
                    
                elif payment_status in ['failed', 'invalid']:
                    order.payment_status = 'failed'
                    order.status = 'cancelled'
                    order.save()
                    
                    # Restore stock
                    for item in order.items.all():
                        product = item.product
                        product.stock += item.quantity
                        product.save()
                    
                    print(f"Payment failed for Order #{order.id}")
                
                return Response({
                    'status': 'success',
                    'message': 'Payment status updated',
                    'order_id': order.id,
                    'payment_status': order.payment_status
                })
                
            except Order.DoesNotExist:
                print(f"Order not found: {merchant_reference or order_tracking_id}")
                return Response({'error': 'Order not found'}, status=404)
                
        except Exception as status_error:
            print(f"Error getting transaction status: {str(status_error)}")
            return Response({'error': str(status_error)}, status=400)
        
    except Exception as e:
        print(f"Callback error: {str(e)}")
        import traceback
        traceback.print_exc()
        return Response({'error': str(e)}, status=400)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def verify_payment(request, order_id):
    """Verify payment status for an order"""
    try:
        # Get order
        try:
            if request.user.is_staff or request.user.is_superuser:
                order = Order.objects.get(id=order_id)
            else:
                order = Order.objects.get(id=order_id, user=request.user)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Check if order has Pesapal tracking ID
        if not order.pesapal_order_tracking_id:
            return Response({
                'error': 'No payment initiated for this order'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Get transaction status from Pesapal
        try:
            status_response = pesapal_client.get_transaction_status(order.pesapal_order_tracking_id)
            
            payment_status = status_response.get('payment_status_description', '').lower()
            payment_method = status_response.get('payment_method', '')
            
            # Update order
            if payment_status == 'completed' or status_response.get('status_code') == 1:
                order.payment_status = 'completed'
                order.status = 'processing'
                order.payment_method = payment_method
                order.save()
            
            serializer = OrderSerializer(order)
            return Response({
                'order': serializer.data,
                'pesapal_status': status_response
            })
            
        except Exception as e:
            return Response({
                'error': 'Failed to verify payment',
                'details': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
        
    except Exception as e:
        print(f"Verification error: {str(e)}")
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)