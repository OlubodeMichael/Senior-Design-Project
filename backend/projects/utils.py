import jwt
from datetime import datetime, timedelta
from django.conf import settings
from django.contrib.auth.models import User
from rest_framework.exceptions import AuthenticationFailed

def generate_jwt(user):
    payload = {
        'user_id': user.id,
        # 'exp': datetime.now(datetime.now()) + timedelta(days=1),
        # 'iat': datetime.now(datetime.now())
    }
    token = jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm='HS256')
    return token

def get_user_from_jwt(request):
    token = request.COOKIES.get('jwt')
    if not token:
        raise AuthenticationFailed('Unauthenticated')

    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=['HS256'])
        user = User.objects.get(id=payload['user_id'])
        return user
    except (jwt.ExpiredSignatureError, jwt.DecodeError):
        raise AuthenticationFailed('Invalid or expired token')
    except User.DoesNotExist:
        raise AuthenticationFailed('User does not exist')