from rest_framework.views import APIView
from django.utils.timezone import now
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .models import CustomUser
from rest_framework import status
from .serializers import CustomUserSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated

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
            })
        
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class UserRegisterView(APIView):
    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        user_type = request.data.get('user_type')
        if CustomUser.objects.filter(username=username).exists():
            return Response({'error': 'User already exists'}, status=status.HTTP_400_BAD_REQUEST)
        user = CustomUser.objects.create_user(username=username, email=email, password=password, user_type=user_type)
        user_data = CustomUserSerializer(user).data
        
        return Response({
            'message': 'User registered successfully',
            'user': user_data
        }, status=status.HTTP_201_CREATED)


class UserListView(APIView):
    def get(self, request):
        users = CustomUser.objects.all()
        serializer = CustomUserSerializer(users, many=True)
        return Response(serializer.data, status=200)
    

class UserLogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh_token')
            if not refresh_token:
                return Response({'error': 'Refresh token is required'}, status=status.HTTP_400_BAD_REQUEST)
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response({'message': 'User logged out successfully'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': 'Invalid token or token already blacklisted'}, status=status.HTTP_400_BAD_REQUEST)
        

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        current_password = request.data.get('current_password')
        new_password = request.data.get('new_password')
        
        if not current_password or not new_password:
            return Response({'error': 'Current password and new password are required'}, status=status.HTTP_400_BAD_REQUEST)
        user = authenticate(username=user.username, password=current_password)
        if not user:
            return Response({'error': 'Current password is incorrect'}, status=status.HTTP_400_BAD_REQUEST)
        user.set_password(new_password)
        user.save()

        return Response({'message': 'Password changed successfully'}, status=status.HTTP_200_OK)