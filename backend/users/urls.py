from django.urls import path
from .views import AdminLoginView, AdminRegisterView

urlpatterns = [
    path('login/', AdminLoginView.as_view(), name='admin-login'),
    path('register/', AdminRegisterView.as_view(), name='admin-register'),
]