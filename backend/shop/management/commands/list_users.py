from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

class Command(BaseCommand):
    help = 'Lists all users in the database'

    def handle(self, *args, **options):
        User = get_user_model()
        
        users = User.objects.all()
        
        if not users.exists():
            self.stdout.write(self.style.WARNING('No users found in database'))
            return
        
        self.stdout.write(self.style.SUCCESS(f'Found {users.count()} user(s):'))
        self.stdout.write('-' * 80)
        
        for user in users:
            self.stdout.write(f'Username: {user.username}')
            self.stdout.write(f'Email: {user.email}')
            self.stdout.write(f'Is superuser: {user.is_superuser}')
            self.stdout.write(f'Is staff: {user.is_staff}')
            self.stdout.write(f'Is active: {user.is_active}')
            self.stdout.write('-' * 80)