from django.urls import path
from .views import UserLoginView, UserRegisterView, UserListView, UserLogoutView

urlpatterns = [
    path('login/', UserLoginView.as_view(), name='login'),
    path('register/', UserRegisterView.as_view(), name='register'),
    path('list/', UserListView.as_view(), name='user-list'),
    path('logout/', UserLogoutView.as_view(), name="userlogout")
]