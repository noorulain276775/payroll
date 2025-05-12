from rest_framework import serializers
from .models import Leave, LeaveBalance, LeaveAccrual
from employees.models import Employee

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ['id', 'first_name', 'last_name']  # add more fields if needed

class LeaveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Leave
        fields = ['leave_type', 'start_date', 'end_date', 'reason', 'days_taken']
        read_only_fields = ['status', 'applied_on', 'approved_on']
    def validate(self, data):
        if data['start_date'] > data['end_date']:
            raise serializers.ValidationError("End date must be after start date.")
        return data


class LeaveBalanceSerializer(serializers.ModelSerializer):
    employee = EmployeeSerializer(read_only=True)

    class Meta:
        model = LeaveBalance
        fields = '__all__'


class LeaveAccrualSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeaveAccrual
        fields = '__all__'
