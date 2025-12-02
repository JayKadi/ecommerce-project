from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from django.shortcuts import redirect
import os

class CustomSocialAccountAdapter(DefaultSocialAccountAdapter):
    def get_connect_redirect_url(self, request, socialaccount):
        """
        Redirect after social account connection
        """
        frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:5173')
        return f'{frontend_url}/auth/callback'
