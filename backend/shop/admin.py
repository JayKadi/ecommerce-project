from django.contrib import admin
from .models import Product, Order, OrderItem, ProductImage, ProductVideo

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 3

class ProductVideoInline(admin.StackedInline):
    model = ProductVideo
    max_num = 1

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'price', 'stock', 'size', 'condition', 'category', 'is_active', 'created_at']
    list_filter = ['is_active', 'category', 'size', 'condition', 'created_at']
    search_fields = ['name', 'description']
    list_editable = ['price', 'stock', 'is_active']
    readonly_fields = ['created_at', 'updated_at']
    inlines = [ProductImageInline, ProductVideoInline]

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['product', 'quantity', 'price']

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'status', 'total_amount', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['user__username', 'shipping_address']
    list_editable = ['status']
    readonly_fields = ['created_at', 'updated_at']
    inlines = [OrderItemInline]