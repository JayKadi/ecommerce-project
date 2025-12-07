from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model
import logging

logger = logging.getLogger(__name__)

class DebugAuthBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        logger.error(f"=== AUTH ATTEMPT ===")
        logger.error(f"Username received: '{username}'")
        logger.error(f"Password received: {bool(password)}")
        logger.error(f"Password length: {len(password) if password else 0}")
        
        User = get_user_model()
        try:
            user = User.objects.get(username=username)
            logger.error(f"User found: {user.username}")
            logger.error(f"Is active: {user.is_active}")
            logger.error(f"Is staff: {user.is_staff}")
            logger.error(f"Is superuser: {user.is_superuser}")
            
            if user.check_password(password):
                logger.error("Password check: SUCCESS")
                return user
            else:
                logger.error("Password check: FAILED")
                return None
        except User.DoesNotExist:
            logger.error(f"User '{username}' does not exist")
            return None