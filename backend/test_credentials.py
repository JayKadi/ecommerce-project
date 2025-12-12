#!/usr/bin/env python
"""Quick script to test Pesapal credentials and check for common issues"""
import os
from django.conf import settings
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ecommerce.settings')
django.setup()

print("=" * 60)
print("PESAPAL CREDENTIALS CHECK")
print("=" * 60)

consumer_key = settings.PESAPAL_CONSUMER_KEY
consumer_secret = settings.PESAPAL_CONSUMER_SECRET
environment = settings.PESAPAL_ENVIRONMENT

print(f"\nEnvironment: {environment}")
print(f"\nConsumer Key:")
print(f"  Length: {len(consumer_key)}")
print(f"  First 10 chars: {consumer_key[:10]}")
print(f"  Last 10 chars: {consumer_key[-10:]}")
print(f"  Has leading spaces: {consumer_key.startswith(' ')}")
print(f"  Has trailing spaces: {consumer_key.endswith(' ')}")
print(f"  Has newlines: {'\\n' in consumer_key or '\\r' in consumer_key}")

print(f"\nConsumer Secret:")
print(f"  Length: {len(consumer_secret)}")
print(f"  First 10 chars: {consumer_secret[:10]}")
print(f"  Last 10 chars: {consumer_secret[-10:]}")
print(f"  Has leading spaces: {consumer_secret.startswith(' ')}")
print(f"  Has trailing spaces: {consumer_secret.endswith(' ')}")
print(f"  Has newlines: {'\\n' in consumer_secret or '\\r' in consumer_secret}")

# Try to get access token
print("\n" + "=" * 60)
print("TESTING API CONNECTION")
print("=" * 60)

from shop.pesapal import pesapal_client

token = pesapal_client.get_access_token()
if token:
    print(f"\n✅ SUCCESS! Got access token: {token[:20]}...")
else:
    print("\n❌ Failed to get access token")

print("\n" + "=" * 60)
