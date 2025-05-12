from django.urls import path
from .views import (
    LeaveListCreateAPIView,
    LeaveDetailAPIView,
    LeaveBalanceAPIView,
    LeaveAccrualAPIView,
    ManualLeaveAccrualAPIView,
    RejectLeaveAPIView, 
    LeaveBalanceListCreateAPIView,
    LeaveBalanceUpdateAPIView,
)

urlpatterns = [
    path('leaves/', LeaveListCreateAPIView.as_view(), name='leave_list_create'),
    path('leaves/<int:pk>/', LeaveDetailAPIView.as_view(), name='leave_detail'),
    path('leave-balance/', LeaveBalanceAPIView.as_view(), name='leave_balance'),
    path('leave-balances/', LeaveBalanceListCreateAPIView.as_view(), name='leave-balance-list-create'),
    path('leave-balances/<int:pk>/', LeaveBalanceUpdateAPIView.as_view(), name='leave-balance-update'),
    path('accrue-leave/', LeaveAccrualAPIView.as_view(), name='accrue_leave'),
    path('manual-accrue/', ManualLeaveAccrualAPIView.as_view(), name='manual_accrue'),
    path('admin/leave/<int:pk>/reject/', RejectLeaveAPIView.as_view(), name='reject-leave'),
    path('admin/leave/<int:pk>/reject/', RejectLeaveAPIView.as_view(), name='reject-leave'),

]
