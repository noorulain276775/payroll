from django.urls import path
from .views import UserLoginView, UserRegisterView

urlpatterns = [
    path('login/', UserLoginView.as_view(), name='admin-login'),
    path('register/', UserRegisterView.as_view(), name='admin-register'),
]