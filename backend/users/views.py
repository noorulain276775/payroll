from rest_framework.views import APIView
from django.utils.timezone import now
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .models import CustomUser
from rest_framework import status
from .serializers import CustomUserSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.db import models
from django_ratelimit.decorators import ratelimit
from django.utils.decorators import method_decorator
from django.core.exceptions import ValidationError
import re

@method_decorator(ratelimit(key='ip', rate='5/m', method='POST'), name='post')
class UserLoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        # Input validation
        if not username or not password:
            return Response({
                'error': 'Username and password are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Rate limiting check
        if getattr(request, 'limited', False):
            return Response({
                'error': 'Too many login attempts. Please try again later.'
            }, status=status.HTTP_429_TOO_MANY_REQUESTS)
        
        user = authenticate(username=username, password=password)
        
        if user:
            user.last_login = now()
            user.save(update_fields=['last_login'])
            refresh = RefreshToken.for_user(user)
            
            # Log successful login
            print(f"Successful login: {username} at {now()}")
            
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'username': user.username,
                'user_type': user.user_type,
                'last_login': user.last_login,
                'user_id': user.id,
            })
        
        # Log failed login attempt
        print(f"Failed login attempt: {username} at {now()}")
        
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

import re

@method_decorator(ratelimit(key='ip', rate='3/m', method='POST'), name='post')
class UserRegisterView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        user_type = request.data.get('user_type', 'Employee')
        
        # Input validation
        if not all([username, email, password]):
            return Response({
                'error': 'All fields are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Rate limiting check
        if getattr(request, 'limited', False):
            return Response({
                'error': 'Too many registration attempts. Please try again later.'
            }, status=status.HTTP_429_TOO_MANY_REQUESTS)
        
        # Username validation
        if len(username) < 3 or len(username) > 30:
            return Response({
                'error': 'Username must be between 3 and 30 characters'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if not re.match(r'^[a-zA-Z0-9_]+$', username):
            return Response({
                'error': 'Username can only contain letters, numbers, and underscores'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Email validation
        if not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', email):
            return Response({
                'error': 'Please enter a valid email address'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Password validation
        if len(password) < 12:
            return Response({
                'error': 'Password must be at least 12 characters long'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if not re.search(r'[A-Z]', password):
            return Response({
                'error': 'Password must contain at least one uppercase letter'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if not re.search(r'[a-z]', password):
            return Response({
                'error': 'Password must contain at least one lowercase letter'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if not re.search(r'\d', password):
            return Response({
                'error': 'Password must contain at least one number'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
            return Response({
                'error': 'Password must contain at least one special character'
            }, status=status.HTTP_400_BAD_REQUEST)

        # User type validation - prevent unauthorized admin creation
        if user_type not in ['Employee', 'Both']:
            return Response({'error': 'Invalid user type'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if user already exists
        if CustomUser.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)
        
        if CustomUser.objects.filter(email=email).exists():
            return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)

        # Create user with proper permissions
        is_staff = 1 if user_type == 'Both' else 0
        is_superuser = False  # Never allow superuser creation via API

        try:
            user = CustomUser.objects.create_user(
                username=username,
                email=email,
                password=password,
                user_type=user_type,
                is_staff=is_staff,
                is_superuser=is_superuser
            )
            user_data = CustomUserSerializer(user).data

            # Log successful registration
            print(f"User registered successfully: {username} ({user_type}) at {now()}")

            return Response({
                'message': 'User registered successfully',
                'user': user_data
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            # Log registration error
            print(f"Registration error for {username}: {str(e)} at {now()}")
            return Response({'error': f'Failed to create user: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@method_decorator(ratelimit(key='user', rate='100/h', method='GET'), name='get')
class UserListView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        # Only allow admins to view user list
        if not (request.user.is_staff or request.user.is_superuser):
            return Response({
                'error': 'Access denied. Admin privileges required.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        try:
            users = CustomUser.objects.all().exclude(is_superuser=True)
            user_data = CustomUserSerializer(users, many=True).data
            
            # Log user list access
            print(f"User list accessed by {request.user.username} at {now()}")
            
            return Response({
                'users': user_data,
                'count': len(user_data)
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            # Log error
            print(f"Error fetching users by {request.user.username}: {str(e)} at {now()}")
            return Response({'error': f'Failed to fetch users: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def post(self, request):
        return Response({
            'error': 'Method not allowed'
        }, status=status.HTTP_405_METHOD_NOT_ALLOWED)

@method_decorator(ratelimit(key='user', rate='10/m', method='POST'), name='post')
class UserLogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh_token')
            if not refresh_token:
                return Response({'error': 'Refresh token is required'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Blacklist the refresh token
            token = RefreshToken(refresh_token)
            token.blacklist()
            
            # Log the logout for security audit
            print(f"User logged out: {request.user.username} at {now()}")
            
            return Response({'message': 'User logged out successfully'}, status=status.HTTP_200_OK)
            
        except Exception as e:
            # Log the error for debugging
            print(f"Logout error for user {request.user.username}: {str(e)} at {now()}")
            return Response({'error': 'Invalid token or token already blacklisted'}, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request):
        """Handle logout via GET request (for compatibility)"""
        try:
            # Log the logout for security audit
            print(f"User logged out via GET: {request.user.username} at {now()}")
            
            return Response({'message': 'User logged out successfully'}, status=status.HTTP_200_OK)
            
        except Exception as e:
            print(f"Logout error for user {request.user.username}: {str(e)} at {now()}")
            return Response({'error': 'Logout failed'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    def put(self, request):
        return Response({
            'error': 'Method not allowed'
        }, status=status.HTTP_405_METHOD_NOT_ALLOWED)

@method_decorator(ratelimit(key='user', rate='5/m', method='POST'), name='post')
class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        current_password = request.data.get('current_password')
        new_password = request.data.get('new_password')
        confirm_password = request.data.get('confirm_password')
        
        # Input validation
        if not all([current_password, new_password, confirm_password]):
            return Response({
                'error': 'All password fields are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if current password is correct
        if not request.user.check_password(current_password):
            return Response({
                'error': 'Current password is incorrect'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if new passwords match
        if new_password != confirm_password:
            return Response({
                'error': 'New passwords do not match'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if new password is different from current
        if current_password == new_password:
            return Response({
                'error': 'New password must be different from current password'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Validate new password strength
        if len(new_password) < 12:
            return Response({
                'error': 'Password must be at least 12 characters long'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if not re.search(r'[A-Z]', new_password):
            return Response({
                'error': 'Password must contain at least one uppercase letter'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if not re.search(r'[a-z]', new_password):
            return Response({
                'error': 'Password must contain at least one lowercase letter'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if not re.search(r'\d', new_password):
            return Response({
                'error': 'Password must contain at least one number'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', new_password):
            return Response({
                'error': 'Password must contain at least one special character'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Update password
            request.user.set_password(new_password)
            request.user.save()
            
            # Log password change
            print(f"Password changed for user: {request.user.username} at {now()}")
            
            return Response({
                'message': 'Password changed successfully'
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            # Log error
            print(f"Password change error for {request.user.username}: {str(e)} at {now()}")
            return Response({
                'error': 'Failed to change password'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)