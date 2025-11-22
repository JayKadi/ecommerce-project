from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
from django.utils.html import strip_tags

def send_order_confirmation_email(order):
    """Send order confirmation email"""
    subject = f'🐆 Order Confirmation #{order.id} - Kadi Thrift'
    
    # HTML email content
    html_message = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background: linear-gradient(135deg, #E85D45 0%, #FFB6C1 100%); 
                       color: white; padding: 30px; text-align: center; border-radius: 10px; }}
            .content {{ background: #F5F5DC; padding: 30px; border-radius: 10px; margin: 20px 0; }}
            .item {{ background: white; padding: 15px; margin: 10px 0; border-radius: 8px; 
                    border-left: 4px solid #E85D45; }}
            .footer {{ text-align: center; padding: 20px; color: #666; }}
            .button {{ background: #E85D45; color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 8px; display: inline-block; 
                      margin: 10px 0; }}
            .total {{ font-size: 24px; font-weight: bold; color: #E85D45; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🐆 Kadi Thrift</h1>
                <p style="font-size: 18px;">Wild About Fashion</p>
            </div>
            
            <div class="content">
                <h2>Thank You for Your Order!</h2>
                <p>Hi {order.user.username},</p>
                <p>We've received your order and we're getting it ready. Here are the details:</p>
                
                <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
                    <h3 style="color: #E85D45;">Order #{order.id}</h3>
                    <p><strong>Date:</strong> {order.created_at.strftime('%B %d, %Y at %I:%M %p')}</p>
                    <p><strong>Status:</strong> {order.status.capitalize()}</p>
                    <p><strong>Payment Status:</strong> {order.payment_status.capitalize()}</p>
                </div>
                
                <h3>Items Ordered:</h3>
                {''.join([f'''
                <div class="item">
                    <strong>{item.product.name}</strong><br>
                    Quantity: {item.quantity} × KES {item.price}<br>
                    <strong>Subtotal: KES {float(item.quantity) * float(item.price):.2f}</strong>
                </div>
                ''' for item in order.items.all()])}
                
                <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
                    <h3>Delivery Address:</h3>
                    <p>
                        {order.shipping_address}<br>
                        {order.shipping_city}, {order.shipping_postal_code}<br>
                        {order.shipping_country}<br>
                        Phone: {order.phone_number}
                    </p>
                </div>
                
                <div style="background: white; padding: 20px; border-radius: 10px; text-align: right;">
                    <p>Subtotal: KES {float(order.total_amount) - float(order.delivery_fee or 0):.2f}</p>
                    <p>Delivery Fee: KES {float(order.delivery_fee or 0):.2f}</p>
                    <h3 class="total">Total: KES {float(order.total_amount):.2f}</h3>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="http://localhost:5173/orders/{order.id}" class="button">
                        View Order Details
                    </a>
                </div>
                
                <p>We'll send you another email when your order status changes!</p>
            </div>
            
            <div class="footer">
                <p>Questions? Contact us:</p>
                <p>📧 kadithrift@gmail.com | 📱 +254 705 807 643</p>
                <p style="margin-top: 20px;">
                    Follow us on Instagram & TikTok: @kadithrift
                </p>
                <p style="color: #999; font-size: 12px; margin-top: 20px;">
                    © 2025 Kadi Thrift. All rights reserved.
                </p>
            </div>
        </div>
    </body>
    </html>
    """
    
    plain_message = strip_tags(html_message)
    
    send_mail(
        subject=subject,
        message=plain_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[order.user.email],
        html_message=html_message,
        fail_silently=False,
    )


def send_order_status_email(order, old_status):
    """Send email when order status changes"""
    
    status_messages = {
        'processing': {
            'subject': f'📦 Order #{order.id} is Being Processed - Kadi Thrift',
            'title': 'Your Order is Being Processed!',
            'message': f"Great news! We're preparing your order for shipment. We'll update you once it's on its way!",
            'icon': '📦'
        },
        'shipped': {
            'subject': f'🚚 Order #{order.id} Has Been Shipped - Kadi Thrift',
            'title': 'Your Order is On The Way!',
            'message': f"Exciting! Your order has been shipped and is headed your way. Expected delivery: {order.estimated_delivery_days or '3-5'} business days.",
            'icon': '🚚'
        },
        'delivered': {
            'subject': f'✅ Order #{order.id} Delivered - Kadi Thrift',
            'title': 'Your Order Has Been Delivered!',
            'message': "Your order has been delivered! We hope you love your new pieces. Enjoy your Kadi Thrift style!",
            'icon': '✅'
        },
        'cancelled': {
            'subject': f'❌ Order #{order.id} Cancelled - Kadi Thrift',
            'title': 'Order Cancelled',
            'message': "Your order has been cancelled. If you didn't request this, please contact us immediately.",
            'icon': '❌'
        }
    }
    
    if order.status not in status_messages:
        return
    
    info = status_messages[order.status]
    
    html_message = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background: linear-gradient(135deg, #E85D45 0%, #FFB6C1 100%); 
                       color: white; padding: 30px; text-align: center; border-radius: 10px; }}
            .content {{ background: #F5F5DC; padding: 30px; border-radius: 10px; margin: 20px 0; }}
            .status-icon {{ font-size: 60px; text-align: center; margin: 20px 0; }}
            .button {{ background: #E85D45; color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 8px; display: inline-block; }}
            .footer {{ text-align: center; padding: 20px; color: #666; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🐆 Kadi Thrift</h1>
            </div>
            
            <div class="content">
                <div class="status-icon">{info['icon']}</div>
                <h2 style="text-align: center; color: #E85D45;">{info['title']}</h2>
                <p>Hi {order.user.username},</p>
                <p>{info['message']}</p>
                
                <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
                    <h3 style="color: #E85D45;">Order #{order.id}</h3>
                    <p><strong>Status:</strong> {order.status.capitalize()}</p>
                    <p><strong>Total:</strong> KES {float(order.total_amount):.2f}</p>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="http://localhost:5173/orders/{order.id}" class="button">
                        Track Your Order
                    </a>
                </div>
            </div>
            
            <div class="footer">
                <p>Questions? We're here to help!</p>
                <p>📧 kadithrift@gmail.com | 📱 +254 705 807 643</p>
                <p style="color: #999; font-size: 12px; margin-top: 20px;">
                    © 2025 Kadi Thrift. All rights reserved.
                </p>
            </div>
        </div>
    </body>
    </html>
    """
    
    plain_message = strip_tags(html_message)
    
    send_mail(
        subject=info['subject'],
        message=plain_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[order.user.email],
        html_message=html_message,
        fail_silently=False,
    )


def send_welcome_email(user):
    """Send welcome email to new users"""
    subject = '🐆 Welcome to Kadi Thrift!'
    
    html_message = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background: linear-gradient(135deg, #E85D45 0%, #FFB6C1 100%); 
                       color: white; padding: 40px; text-align: center; border-radius: 10px; }}
            .content {{ background: #F5F5DC; padding: 30px; border-radius: 10px; margin: 20px 0; }}
            .button {{ background: #E85D45; color: white; padding: 15px 40px; 
                      text-decoration: none; border-radius: 8px; display: inline-block; 
                      font-weight: bold; }}
            .footer {{ text-align: center; padding: 20px; color: #666; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1 style="font-size: 48px; margin: 0;">🐆</h1>
                <h1 style="margin: 10px 0;">Welcome to Kadi Thrift!</h1>
                <p style="font-size: 18px;">Wild About Fashion</p>
            </div>
            
            <div class="content">
                <h2 style="color: #E85D45;">Hey {user.username}! 👋</h2>
                <p>We're thrilled to have you join the Kadi Thrift family!</p>
                
                <p>Get ready to discover amazing pre-loved fashion pieces at unbeatable prices. 
                Every item is hand-picked and quality-checked just for you!</p>
                
                <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
                    <h3 style="color: #E85D45;">What makes us special:</h3>
                    <ul style="line-height: 2;">
                        <li>✨ Unique, one-of-a-kind pieces</li>
                        <li>💯 Quality guaranteed</li>
                        <li>🚚 Fast delivery across Kenya</li>
                        <li>💳 Secure payments</li>
                        <li>💬 24/7 customer support</li>
                    </ul>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="http://localhost:5173/" class="button">
                        Start Shopping Now! 🛍️
                    </a>
                </div>
                
                <p>Follow us on social media for daily drops and exclusive deals:</p>
                <p style="text-align: center; font-size: 18px;">
                    📸 Instagram: @kadithrift<br>
                    🎵 TikTok: @kadithrift
                </p>
            </div>
            
            <div class="footer">
                <p>Need help? We're here for you!</p>
                <p>📧 kadithrift@gmail.com | 📱 +254 705 807 643</p>
                <p style="color: #999; font-size: 12px; margin-top: 20px;">
                    © 2025 Kadi Thrift. All rights reserved.
                </p>
            </div>
        </div>
    </body>
    </html>
    """
    
    plain_message = strip_tags(html_message)
    
    send_mail(
        subject=subject,
        message=plain_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        html_message=html_message,
        fail_silently=False,
    )