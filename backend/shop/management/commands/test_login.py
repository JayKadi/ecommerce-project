from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model, authenticate
import os

class Command(BaseCommand):
    help = 'Tests login credentials'

    def handle(self, *args, **options):
        User = get_user_model()
        
        username = os.getenv('DJANGO_SUPERUSER_USERNAME', 'admin')
        password = os.getenv('DJANGO_SUPERUSER_PASSWORD')
        
        self.stdout.write(f'Testing login for username: "{username}"')
        self.stdout.write(f'Password provided: {bool(password)}')
        self.stdout.write(f'Password length: {len(password) if password else 0}')
        
        # Check if user exists
        try:
            user = User.objects.get(username=username)
            self.stdout.write(self.style.SUCCESS(f'✅ User "{username}" exists'))
            self.stdout.write(f'   - Is superuser: {user.is_superuser}')
            self.stdout.write(f'   - Is staff: {user.is_staff}')
            self.stdout.write(f'   - Is active: {user.is_active}')
            
            # Try to authenticate
            auth_user = authenticate(username=username, password=password)
            if auth_user:
                self.stdout.write(self.style.SUCCESS(f'✅ Authentication SUCCESSFUL'))
            else:
                self.stdout.write(self.style.ERROR(f'❌ Authentication FAILED - password is incorrect'))
                
        except User.DoesNotExist:
            self.stdout.write(self.style.ERROR(f'❌ User "{username}" does not exist'))