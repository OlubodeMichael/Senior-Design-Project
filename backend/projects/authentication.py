from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth.models import User
from .utils import get_user_from_jwt

class JWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        try:
            user = get_user_from_jwt(request)
        except AuthenticationFailed:
            return None

        return (user, None)
