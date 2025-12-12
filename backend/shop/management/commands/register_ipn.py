from django.core.management.base import BaseCommand
from shop.pesapal import pesapal_client
import os

class Command(BaseCommand):
    help = 'Register IPN URL with Pesapal and get IPN ID'

    def handle(self, *args, **kwargs):
        try:
            # Verify credentials are set
            from django.conf import settings
            if not settings.PESAPAL_CONSUMER_KEY or not settings.PESAPAL_CONSUMER_SECRET:
                self.stdout.write(self.style.ERROR("❌ Pesapal credentials not configured!"))
                self.stdout.write(f"PESAPAL_CONSUMER_KEY: {'Set' if settings.PESAPAL_CONSUMER_KEY else 'NOT SET'}")
                self.stdout.write(f"PESAPAL_CONSUMER_SECRET: {'Set' if settings.PESAPAL_CONSUMER_SECRET else 'NOT SET'}")
                return

            self.stdout.write(f"Environment: {settings.PESAPAL_ENVIRONMENT}")
            self.stdout.write(f"Getting access token...")

            # Get fresh access token
            token = pesapal_client.get_access_token()
            if not token:
                self.stdout.write(self.style.ERROR("❌ Failed to get access token"))
                return

            self.stdout.write(self.style.SUCCESS(f"✅ Access token obtained"))

            # Your Railway backend URL
            backend_url = os.getenv('RAILWAY_PUBLIC_DOMAIN', 'ecommerce-project-production-f8f8.up.railway.app')
            ipn_url = f"https://{backend_url}/api/pesapal/callback/"

            self.stdout.write(f"Registering IPN URL: {ipn_url}")

            # Register IPN with Pesapal
            response = pesapal_client.register_ipn(ipn_url)
            
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