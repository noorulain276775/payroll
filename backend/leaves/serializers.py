from rest_framework import serializers
from .models import Leave, LeaveBalance, LeaveAccrual
from employees.models import Employee
from users.models import CustomUser

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ['id', 'first_name', 'last_name']

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = '__all__' 

class LeaveSerializer(serializers.ModelSerializer):
    employee = EmployeeSerializer(read_only=True)
    user = CustomUserSerializer(read_only=True)
    approved_by = CustomUserSerializer(read_only=True)
    applied_on = serializers.DateTimeField(format="%b %d, %Y, %I:%M %p", read_only=True)
    approved_on = serializers.DateTimeField(format="%b %d, %Y, %I:%M %p", read_only=True)

    class Meta:
        model = Leave
        fields = [
            'id', 'employee', 'leave_type', 'start_date', 'end_date',
            'reason', 'days_taken', 'status', 'applied_on',
            'approved_on', 'approved_by', 'user'
        ]
        read_only_fields = [
            'status', 'applied_on', 'approved_on', 'approved_by',
            'employee', 'user'
        ]

    def validate(self, data):
        if data['start_date'] > data['end_date']:
            raise serializers.ValidationError("End date must be after start date.")
        return data


class LeaveBalanceSerializer(serializers.ModelSerializer):
    employee = serializers.PrimaryKeyRelatedField(queryset=Employee.objects.all())
    employee_details = EmployeeSerializer(source='employee', read_only=True)

    class Meta:
        model = LeaveBalance
        fields = '__all__'


class LeaveAccrualSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeaveAccrual
        fields = '__all__'
