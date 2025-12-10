from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify
import uuid
from cloudinary.models import CloudinaryField

class Product(models.Model):
    CONDITION_CHOICES = [
        ('new', 'New'),
        ('like_new', 'Like New'),
        ('good', 'Good'),
        ('fair', 'Fair'),
    ]
    
    SIZE_CHOICES = [
        ('xs', 'XS'),
        ('s', 'S'),
        ('m', 'M'),
        ('l', 'L'),
        ('xl', 'XL'),
        ('xxl', 'XXL'),
        ('one_size', 'One Size'),
        ('various', 'Various Sizes'),
    ]
    
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)
    category = models.CharField(max_length=100)
    
    # New fields for thrift shop
    size = models.CharField(max_length=20, choices=SIZE_CHOICES, default='one_size')
    condition = models.CharField(max_length=20, choices=CONDITION_CHOICES, default='good')
    instagram_link = models.URLField(blank=True, null=True)
    tiktok_link = models.URLField(blank=True, null=True)
    
    # Image
    image = CloudinaryField('image', folder='products', blank=True, null=True)
    
    # Status fields
    is_active = models.BooleanField(default=True)
    slug = models.SlugField(unique=True, blank=True, max_length=300)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def save(self, *args, **kwargs):
        if not self.slug:
            # Generate slug from name
            base_slug = slugify(self.name)
            # Add unique identifier to ensure uniqueness
            unique_id = str(uuid.uuid4())[:8]
            self.slug = f"{base_slug}-{unique_id}"
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.name

class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='additional_images')
    image = CloudinaryField('image', folder='products/additional')  # Changed
    order = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ['order']
    
    def __str__(self):
        return f"{self.product.name} - Image {self.order}"

class ProductVideo(models.Model):
    product = models.OneToOneField(Product, on_delete=models.CASCADE, related_name='video')
    video = CloudinaryField('video', folder='products/videos', resource_type='video')  # Changed
    thumbnail = CloudinaryField('image', folder='products/video_thumbnails', blank=True, null=True)  # Changed
    
    def __str__(self):
        return f"{self.product.name} - Video"

class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Shipping information
    shipping_address = models.TextField()
    shipping_city = models.CharField(max_length=100)
    shipping_postal_code = models.CharField(max_length=20)
    shipping_country = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=20)
    whatsapp_number = models.CharField(max_length=20, blank=True)
    
    # Delivery information
    delivery_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    estimated_delivery_days = models.IntegerField(default=3)
    
    # Pesapal payment fields (NEW)
    pesapal_order_tracking_id = models.CharField(max_length=255, blank=True, null=True)
    pesapal_merchant_reference = models.CharField(max_length=255, blank=True, null=True)
    payment_status = models.CharField(max_length=20, default='pending')
    payment_method = models.CharField(max_length=50, blank=True, null=True)  # mpesa, card, etc.
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Order #{self.id} - {self.user.username}"
class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    
    def __str__(self):
        return f"{self.quantity}x {self.product.name}"
    
    def get_total(self):
        return self.quantity * self.price
    
class DeliveryZone(models.Model):
    city = models.CharField(max_length=100, unique=True)
    delivery_fee = models.DecimalField(max_digits=10, decimal_places=2)
    estimated_days = models.IntegerField(default=3)
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.city} - KES {self.delivery_fee}"
    
    class Meta:
        ordering = ['city']