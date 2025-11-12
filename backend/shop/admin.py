from django.contrib import admin
from .models import Product, Order, OrderItem, ProductImage, ProductVideo

# Inline admin for additional images
class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ['image', 'order']

# Inline admin for video
class ProductVideoInline(admin.StackedInline):
    model = ProductVideo
    extra = 0
    fields = ['video', 'thumbnail']
    max_num = 1  # Only one video per product

# Product Admin with inlines
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'price', 'stock', 'category', 'size', 'condition', 'is_active', 'created_at']
    list_filter = ['is_active', 'category', 'size', 'condition', 'created_at']
    search_fields = ['name', 'description', 'category']
    list_editable = ['stock', 'is_active']
    inlines = [ProductImageInline, ProductVideoInline]
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'description', 'price', 'stock', 'category')
        }),
        ('Product Details', {
            'fields': ('size', 'condition', 'image')
        }),
        ('Social Media', {
            'fields': ('instagram_link', 'tiktok_link'),
            'classes': ('collapse',)
        }),
        ('Status', {
            'fields': ('is_active', 'slug')
        }),
    )
    readonly_fields = ['slug']

# Order Item Inline
class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['product', 'quantity', 'price']

# Order Admin
@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'status', 'total_amount', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['user__username', 'shipping_address', 'phone_number']
    list_editable = ['status']
    inlines = [OrderItemInline]
    
    fieldsets = (
        ('Order Information', {
            'fields': ('user', 'status', 'total_amount')
        }),
        ('Shipping Details', {
            'fields': ('shipping_address', 'shipping_city', 'shipping_postal_code', 
                      'shipping_country', 'phone_number')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    readonly_fields = ['created_at', 'updated_at']

# Register standalone models (for direct access if needed)
@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ['product', 'order', 'image']
    list_filter = ['product']
    ordering = ['product', 'order']

@admin.register(ProductVideo)
class ProductVideoAdmin(admin.ModelAdmin):
    list_display = ['product', 'video', 'thumbnail']
    list_filter = ['product']