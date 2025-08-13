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

class UserLoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        
        if user:
            user.last_login = now()
            user.save(update_fields=['last_login'])
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'username': user.username,
                'user_type': user.user_type,
                'last_login': user.last_login,
                'user_id': user.id,
            })
        
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

import re
from django.core.validators import validate_email
from django.core.exceptions import ValidationError

class UserRegisterView(APIView):
    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        user_type = request.data.get('user_type')

        # Input validation
        if not all([username, email, password, user_type]):
            return Response({'error': 'All fields are required'}, status=status.HTTP_400_BAD_REQUEST)

        # Username validation
        if len(username) < 3 or len(username) > 30:
            return Response({'error': 'Username must be between 3 and 30 characters'}, status=status.HTTP_400_BAD_REQUEST)
        
        if not re.match(r'^[a-zA-Z0-9_]+$', username):
            return Response({'error': 'Username can only contain letters, numbers, and underscores'}, status=status.HTTP_400_BAD_REQUEST)

        # Email validation
        try:
            validate_email(email)
        except ValidationError:
            return Response({'error': 'Invalid email format'}, status=status.HTTP_400_BAD_REQUEST)

        # Password validation
        if len(password) < 8:
            return Response({'error': 'Password must be at least 8 characters long'}, status=status.HTTP_400_BAD_REQUEST)
        
        if not re.search(r'[A-Z]', password):
            return Response({'error': 'Password must contain at least one uppercase letter'}, status=status.HTTP_400_BAD_REQUEST)
        
        if not re.search(r'[a-z]', password):
            return Response({'error': 'Password must contain at least one lowercase letter'}, status=status.HTTP_400_BAD_REQUEST)
        
        if not re.search(r'\d', password):
            return Response({'error': 'Password must contain at least one number'}, status=status.HTTP_400_BAD_REQUEST)

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

            return Response({
                'message': 'User registered successfully',
                'user': user_data
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': f'Failed to create user: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class UserListView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        # Only allow admins to view user list
        if request.user.user_type not in ['Admin', 'Both']:
            return Response({'error': 'Access denied. Admin privileges required.'}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            # Filter users based on request parameters
            users = CustomUser.objects.all()
            
            # Apply search filter if provided
            search = request.query_params.get('search', '')
            if search:
                users = users.filter(
                    models.Q(username__icontains=search) |
                    models.Q(email__icontains=search) |
                    models.Q(user_type__icontains=search)
                )
            
            # Apply user type filter if provided
            user_type = request.query_params.get('user_type', '')
            if user_type:
                users = users.filter(user_type=user_type)
            
            # Apply pagination
            page = int(request.query_params.get('page', 1))
            page_size = min(int(request.query_params.get('page_size', 20)), 100)  # Max 100 per page
            
            start = (page - 1) * page_size
            end = start + page_size
            
            total_users = users.count()
            users = users[start:end]
            
            serializer = CustomUserSerializer(users, many=True)
            
            return Response({
                'users': serializer.data,
                'pagination': {
                    'page': page,
                    'page_size': page_size,
                    'total_users': total_users,
                    'total_pages': (total_users + page_size - 1) // page_size
                }
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({'error': f'Failed to fetch users: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

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
            print(f"User logged out: {request.user.username} at {timezone.now()}")
            
            return Response({'message': 'User logged out successfully'}, status=status.HTTP_200_OK)
            
        except Exception as e:
            # Log the error for debugging
            print(f"Logout error for user {request.user.username}: {str(e)}")
            return Response({'error': 'Invalid token or token already blacklisted'}, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request):
        """Handle logout via GET request (for compatibility)"""
        try:
            # Log the logout for security audit
            print(f"User logged out via GET: {request.user.username} at {timezone.now()}")
            
            return Response({'message': 'User logged out successfully'}, status=status.HTTP_200_OK)
            
        except Exception as e:
            print(f"Logout error for user {request.user.username}: {str(e)}")
            return Response({'error': 'Logout failed'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            user = request.user
            current_password = request.data.get('current_password')
            new_password = request.data.get('new_password')
            
            # Input validation
            if not current_password or not new_password:
                return Response({'error': 'Current password and new password are required'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Validate current password
            if not user.check_password(current_password):
                return Response({'error': 'Current password is incorrect'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Password strength validation
            if len(new_password) < 8:
                return Response({'error': 'New password must be at least 8 characters long'}, status=status.HTTP_400_BAD_REQUEST)
            
            if not re.search(r'[A-Z]', new_password):
                return Response({'error': 'New password must contain at least one uppercase letter'}, status=status.HTTP_400_BAD_REQUEST)
            
            if not re.search(r'[a-z]', new_password):
                return Response({'error': 'New password must contain at least one lowercase letter'}, status=status.HTTP_400_BAD_REQUEST)
            
            if not re.search(r'\d', new_password):
                return Response({'error': 'New password must contain at least one number'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Prevent using current password as new password
            if current_password == new_password:
                return Response({'error': 'New password must be different from current password'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Update password
            user.set_password(new_password)
            user.save()
            
            # Log the password change for security audit
            print(f"Password changed for user: {user.username} at {timezone.now()}")
            
            return Response({'message': 'Password changed successfully'}, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({'error': f'Failed to change password: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)