from django.urls import path
from .views import UserLoginView, UserRegisterView, UserListView, UserLogoutView, ChangePasswordView

urlpatterns = [
    path('login/', UserLoginView.as_view(), name='login'),
    path('register/', UserRegisterView.as_view(), name='register'),
    path('list/', UserListView.as_view(), name='user-list'),
    path('logout/', UserLogoutView.as_view(), name="userlogout"),
    path('change-password/', ChangePasswordView.as_view(), name="user-change-password")
]