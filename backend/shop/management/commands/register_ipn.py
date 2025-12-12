from django.core.management.base import BaseCommand
from shop.pesapal import pesapal_client
import os

class Command(BaseCommand):
    help = 'Register IPN URL with Pesapal and get IPN ID'

    def handle(self, *args, **kwargs):
        try:
            # Your Railway backend URL
            backend_url = os.getenv('RAILWAY_PUBLIC_DOMAIN', 'ecommerce-project-production-f8f8.up.railway.app')
            ipn_url = f"https://{backend_url}/api/pesapal/callback/"
            
            self.stdout.write(f"Registering IPN URL: {ipn_url}")
            
            # Register IPN with Pesapal
            response = pesapal_client.register_ipn(
                url=ipn_url,
                ipn_notification_type='GET'  # or 'POST' depending on your preference
            )
            
            self.stdout.write(self.style.SUCCESS(f"\n✅ IPN Registration Response:"))
            self.stdout.write(f"IPN ID: {response.get('ipn_id')}")
            self.stdout.write(f"URL: {response.get('url')}")
            self.stdout.write(f"Status: {response.get('status')}")
            
            self.stdout.write(self.style.WARNING(f"\n⚠️  Add this to Railway environment variables:"))
            self.stdout.write(f"PESAPAL_IPN_ID={response.get('ipn_id')}")
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"❌ Error: {str(e)}"))
            import traceback
            traceback.print_exc()