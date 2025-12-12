import requests
import json
from datetime import datetime
from django.conf import settings


class PesapalAPI:
    def __init__(self):
        self.consumer_key = settings.PESAPAL_CONSUMER_KEY
        self.consumer_secret = settings.PESAPAL_CONSUMER_SECRET
        self.environment = settings.PESAPAL_ENVIRONMENT
        
        if self.environment == 'sandbox':
            self.base_url = 'https://cybqa.pesapal.com/pesapalv3'
        else:
            self.base_url = 'https://pay.pesapal.com/v3'
        
        self.access_token = None
    
    def get_access_token(self):
        """Get OAuth access token from Pesapal"""
        url = f'{self.base_url}/api/Auth/RequestToken'

        headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }

        payload = {
            'consumer_key': self.consumer_key,
            'consumer_secret': self.consumer_secret
        }

        print(f"\n🔑 Requesting access token from: {url}")
        print(f"Consumer Key: {self.consumer_key[:10]}..." if self.consumer_key else "Consumer Key: NOT SET")
        print(f"Environment: {self.environment}")

        try:
            response = requests.post(url, json=payload, headers=headers)
            print(f"Status Code: {response.status_code}")
            print(f"Response: {response.text}")

            data = response.json()

            # Check if response contains an error (Pesapal returns 200 even for errors)
            if 'error' in data:
                error_msg = data['error'].get('message', 'Unknown error')
                error_code = data['error'].get('code', 'unknown')
                print(f"\n❌ Pesapal API Error:")
                print(f"   Code: {error_code}")
                print(f"   Message: {error_msg}")

                if error_code == 'invalid_consumer_key_or_secret_provided':
                    print(f"\n💡 This means:")
                    print(f"   - Your consumer key or secret is incorrect")
                    print(f"   - OR you're using {self.environment} credentials but your keys are for {'sandbox' if self.environment == 'live' else 'live'}")
                    print(f"\n   Double-check your Pesapal credentials in Railway environment variables:")
                    print(f"   - PESAPAL_CONSUMER_KEY")
                    print(f"   - PESAPAL_CONSUMER_SECRET")
                    print(f"   - PESAPAL_ENVIRONMENT (currently: {self.environment})")

                return None

            response.raise_for_status()
            self.access_token = data.get('token')

            if not self.access_token:
                print("⚠️  Warning: No token in response")
                print(f"Response data: {data}")

            return self.access_token
        except requests.exceptions.RequestException as e:
            print(f"❌ Error getting access token: {str(e)}")
            if 'response' in locals():
                print(f"Response: {response.text}")
            raise
    
    def register_ipn(self, ipn_url):
        """Register IPN (Instant Payment Notification) URL"""
        if not self.access_token:
            self.get_access_token()
        
        url = f'{self.base_url}/api/URLSetup/RegisterIPN'
        
        headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {self.access_token}'
        }
        
        payload = {
            'url': ipn_url,
            'ipn_notification_type': 'GET'
        }
        
        try:
            response = requests.post(url, json=payload, headers=headers)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"Error registering IPN: {str(e)}")
            if hasattr(response, 'text'):
                print(f"Response: {response.text}")
            raise
    
    def submit_order(self, order_id, amount, description, callback_url, 
                     customer_email, customer_phone, customer_name):
        """
        Submit order to Pesapal
        
        Args:
            order_id: Unique order reference
            amount: Amount to charge
            description: Order description
            callback_url: URL to redirect after payment
            customer_email: Customer email
            customer_phone: Customer phone number
            customer_name: Customer name
        """
        if not self.access_token:
            self.get_access_token()
        
        url = f'{self.base_url}/api/Transactions/SubmitOrderRequest'
        
        headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {self.access_token}'
        }
        
        # Format phone number (remove + and ensure 254 format)
        if customer_phone.startswith('+'):
            customer_phone = customer_phone[1:]
        if customer_phone.startswith('0'):
            customer_phone = '254' + customer_phone[1:]
        elif not customer_phone.startswith('254'):
            customer_phone = '254' + customer_phone
        
        payload = {
            'id': str(order_id),
            'currency': 'KES',
            'amount': float(amount),
            'description': description,
            'callback_url': callback_url,
            'notification_id': settings.PESAPAL_IPN_ID,  # Will use IPN ID once registered
            'billing_address': {
                'email_address': customer_email,
                'phone_number': customer_phone,
                'country_code': 'KE',
                'first_name': customer_name.split()[0] if customer_name else 'Customer',
                'last_name': ' '.join(customer_name.split()[1:]) if len(customer_name.split()) > 1 else 'User',
                'line_1': '',
                'line_2': '',
                'city': '',
                'state': '',
                'postal_code': '',
                'zip_code': ''
            }
        }
        
        try:
            print("\n" + "=" * 60)
            print("📤 SUBMITTING ORDER TO PESAPAL")
            print("=" * 60)
            print(f"URL: {url}")
            print(f"\n📦 PAYLOAD BEING SENT:")
            print(json.dumps(payload, indent=2))
            print("=" * 60)
            
            response = requests.post(url, json=payload, headers=headers)
            
            print(f"\n📥 PESAPAL RESPONSE:")
            print(f"Status Code: {response.status_code}")
            print(f"Response Body: {response.text}")
            print("=" * 60 + "\n")
            
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"\n❌ ERROR: {str(e)}")
            if 'response' in locals():
                print(f"Response text: {response.text}")
            raise
    
    def get_transaction_status(self, order_tracking_id):
        """Get transaction status"""
        if not self.access_token:
            self.get_access_token()
        
        url = f'{self.base_url}/api/Transactions/GetTransactionStatus'
        
        headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {self.access_token}'
        }
        
        params = {
            'orderTrackingId': order_tracking_id
        }
        
        try:
            response = requests.get(url, params=params, headers=headers)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"Error getting transaction status: {str(e)}")
            raise


# Initialize Pesapal client
pesapal_client = PesapalAPI()