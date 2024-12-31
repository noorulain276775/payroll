from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Admin
from rest_framework import status
from .serializers import AdminSerializer

class AdminLoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'username': user.username,
            })
        return Response({'error': 'Invalid credentials'}, status=401)


class AdminRegisterView(APIView):
    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        if Admin.objects.filter(username=username).exists():
            return Response({'error': 'User already exists'}, status=status.HTTP_400_BAD_REQUEST)
        admin = Admin.objects.create_user(username=username, email=email, password=password)
        admin_data = AdminSerializer(admin).data
        return Response({
            'message': 'Admin registered successfully',
            'admin': admin_data
        }, status=status.HTTP_201_CREATED)