from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.views import APIView
from .models import Leave, LeaveBalance, LeaveAccrual
from .serializers import LeaveSerializer, LeaveBalanceSerializer, LeaveAccrualSerializer
from employees.models import Employee
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.db.models import Case, When, Value, IntegerField, Sum
from django.utils.timezone import now


# List and create leave
class LeaveListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = LeaveSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff or self.request.user.is_superuser:
            return Leave.objects.annotate(
                custom_order=Case(
                    When(status='Pending', then=Value(0)),
                    When(status='Approved', then=Value(1)),
                    When(status='Rejected', then=Value(2)),
                    default=Value(3),
                    output_field=IntegerField()
                )
            ).order_by('custom_order', '-applied_on')
        employee = get_object_or_404(Employee, user=self.request.user)
        return Leave.objects.filter(employee=employee).annotate(
            custom_order=Case(
                When(status='Pending', then=Value(0)),
                When(status='Approved', then=Value(1)),
                When(status='Rejected', then=Value(2)),
                default=Value(3),
                output_field=IntegerField()
            )
        ).order_by('custom_order', '-applied_on')

    def perform_create(self, serializer):
        employee = get_object_or_404(Employee, user=self.request.user)
        serializer.save(employee=employee)

# Detail, update, delete leave
class LeaveDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = LeaveSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        employee = get_object_or_404(Employee, user=self.request.user)
        return Leave.objects.filter(employee=employee)
    

class EmployeeLeaveListAPIView(generics.ListAPIView):
    serializer_class = LeaveSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        employee = get_object_or_404(Employee, user=self.request.user)
        return Leave.objects.filter(employee=employee)
    
class EmployeeApprovedLeaveListAPIView(generics.ListAPIView):
    serializer_class = LeaveSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        employee = get_object_or_404(Employee, user=self.request.user)
        return Leave.objects.filter(employee=employee).filter(status='Approved')
    

class AdminLeaveSummaryAPIView(generics.ListAPIView):
    serializer_class = LeaveSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return Leave.objects.filter(status='Approved')

    
class LeaveApproveAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        leave = get_object_or_404(Leave, pk=pk)
        leave.approve_leave(approver=request.user)
        serializer = LeaveSerializer(leave)
        return Response(serializer.data, status=status.HTTP_200_OK)


class LeaveRejectAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        leave = get_object_or_404(Leave, pk=pk)
        leave.reject_leave(approver=request.user)
        serializer = LeaveSerializer(leave)
        return Response(serializer.data, status=status.HTTP_200_OK)


"""Leave balance and accrual management"""
# Leave balance for logged-in user
class LeaveBalanceAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_id = request.user.id
        if not user_id:
            return Response({'error': 'User not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)
        employee = Employee.objects.filter(user=user_id).first()
        if not employee:
            return Response({'error': 'Employee not found'}, status=status.HTTP_404_NOT_FOUND)
        balance = get_object_or_404(LeaveBalance, employee=employee)
        serializer = LeaveBalanceSerializer(balance)
        return Response(serializer.data)
    
class LeaveBalanceListCreateAPIView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = LeaveBalance.objects.select_related('employee').all()
    serializer_class = LeaveBalanceSerializer
    permission_classes = [IsAdminUser]

    def perform_create(self, serializer):
        employee = serializer.validated_data['employee']
        leave_balance, created = LeaveBalance.objects.update_or_create(
            employee=employee,
            defaults=serializer.validated_data
        )

class LeaveBalanceUpdateAPIView(generics.RetrieveUpdateAPIView):
    queryset = LeaveBalance.objects.all()
    serializer_class = LeaveBalanceSerializer
    permission_classes = [IsAdminUser]

# Accrue leave manually if needed
class LeaveAccrualAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        employee = get_object_or_404(Employee, user=request.user)
        accrual = get_object_or_404(LeaveAccrual, employee=employee)
        accrual.accrue_leave()
        serializer = LeaveAccrualSerializer(accrual)
        return Response(serializer.data)

class ManualLeaveAccrualAPIView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request):
        today = timezone.now().date()

        for employee in Employee.objects.all():
            leave_balance, _ = LeaveBalance.objects.get_or_create(employee=employee)
            leave_balance.annual_leave_balance += 1.83
            leave_balance.save()

            accrual, _ = LeaveAccrual.objects.get_or_create(employee=employee)
            accrual.leave_balance = leave_balance.annual_leave_balance
            accrual.last_accrued_date = today
            accrual.save()

        return Response({'message': 'Leave accrued for all employees'})
    

class ApproveLeaveAPIView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, pk):
        leave = get_object_or_404(Leave, pk=pk)

        if leave.status != 'Pending':
            return Response({'message': 'Only pending leaves can be approved/rejected.'}, status=status.HTTP_400_BAD_REQUEST)

        leave.approve_leave()
        return Response({'message': f'Leave {leave.status.lower()} successfully.'})

class RejectLeaveAPIView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, pk):
        leave = get_object_or_404(Leave, pk=pk)

        if leave.status != 'Pending':
            return Response({'message': 'Only pending leaves can be rejected.'}, status=status.HTTP_400_BAD_REQUEST)

        leave.reject_leave()
        return Response({'message': 'Leave rejected successfully.'})