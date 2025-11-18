import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ecommerce_project.settings')
django.setup()

from shop.pesapal import pesapal_client

# Use a dummy/placeholder IPN URL for now
# This can be any URL - even localhost (Pesapal won't validate it for sandbox)
ipn_url = "http://localhost:8000/api/pesapal/callback/"

print(f"🔧 Registering IPN URL: {ipn_url}")

try:
    response = pesapal_client.register_ipn(ipn_url)
    print(f"\n✅ SUCCESS!")
    print(f"Response: {response}")
    
    if 'ipn_id' in response:
        ipn_id = response['ipn_id']
        print(f"\n🎉 Your IPN ID: {ipn_id}")
        print(f"\n📝 Add this to your .env file:")
        print(f"PESAPAL_IPN_ID={ipn_id}")
    elif 'url' in response:
        print(f"\n✅ IPN already registered!")
        print(f"Response: {response}")
    
except Exception as e:
    print(f"\n❌ ERROR: {str(e)}")
    import traceback
    traceback.print_exc()