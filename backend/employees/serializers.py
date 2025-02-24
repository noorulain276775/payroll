from rest_framework import serializers
from .models import Employee, SalaryDetails, PayrollRecord, SalaryRevision
from users.serializers import CustomUserSerializer
from decimal import Decimal
from django.db.models import Sum, F, Count
from django.utils import timezone


class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = '__all__'
        read_only_fields = ['id']

    def validate(self, data):
        """
        Custom validation for the serializer.
        Example: Add any field-specific or model-level validation here.
        """
        if data.get('children', 0) < 0:
            raise serializers.ValidationError({"children": "Number of children cannot be negative."})
        return data
    

class EmployeeUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ['photo', 'first_name', 'last_name', 'email', 'spouse_name', 'children', 'company_phone_number', 'home_town_number', 'insurance_expiry_date', 'emergency_contact_name', 
                  'emergency_contact_number', 'emergency_contact_relation', 'emirates_id', 'emirates_id_expiry', 'passport_no', 'visa_no', 'visa_expiry',
                   'previous_company_name', 'previous_company_designation', 'emirates_id_image', 'passport_image', 'visa_image', 'highest_degree_certificate', 'insurance_card',
                    'phone_number', 'address', 'nationality', 'gender', 'marital_status', 'mother_name', 'personal_email', 'qualification', 'designation', 'department', 'date_of_birth']
        read_only_fields = ['id']

    def validate(self, data):
        """
        Custom validation for the serializer.
        Example: Add any field-specific or model-level validation here.
        """
        if data.get('children', 0) < 0:
            raise serializers.ValidationError({"children": "Number of children cannot be negative."})
        return data


class SalaryDetailsSerializer(serializers.ModelSerializer):
    employee_full_name = serializers.SerializerMethodField()
    updated_at = serializers.DateTimeField(format='%d-%m-%Y')

    class Meta:
        model = SalaryDetails
        fields = [
            'id', 'employee', 'employee_full_name', 'basic_salary', 'housing_allowance', 
            'transport_allowance', 'other_allowance', 'gross_salary', 'bank_name', 
            'account_no', 'iban', 'swift_code', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'gross_salary', 'created_at', 'updated_at']

    def get_employee_full_name(self, obj):
        return f"{obj.employee.first_name} {obj.employee.last_name}"

    def validate(self, data):
        """
        Custom validation for SalaryDetails.
        Ensure salary components are not negative and gross salary matches.
        """
        if data.get('basic_salary', 0) < 0:
            raise serializers.ValidationError({"basic_salary": "Basic salary cannot be negative."})
        if data.get('gross_salary') and data['gross_salary'] < data.get('basic_salary', 0):
            raise serializers.ValidationError({
                "gross_salary": "Gross salary cannot be less than the basic salary."
            })
        return data
    

class PayrollRecordSerializer(serializers.ModelSerializer):
    employee_full_name = serializers.SerializerMethodField()
    daily_salary = serializers.SerializerMethodField()
    gross_salary = serializers.SerializerMethodField()

    class Meta:
        model = PayrollRecord
        fields = [
            'id', 'employee', 'employee_full_name', 'month', 'year', 'total_salary_for_month', 'overtime_days',
            'unpaid_days', 'other_deductions', 'remarks', 'created_at', 'daily_salary', 'gross_salary', 'normal_overtime_days'
        ]
        read_only_fields = ['id', 'total_salary_for_month', 'created_at']

    def validate(self, data):
        """
        Custom validation for PayrollRecord.
        Example: Ensure the month and year are valid.
        """
        month = data.get('month')
        if month < 1 or month > 12:
            raise serializers.ValidationError({"month": "Month must be between 1 and 12."})
        return data

    def get_employee_full_name(self, obj):
        return f"{obj.employee.first_name} {obj.employee.last_name}"

    def get_daily_salary(self, obj):
        """
        Calculate the daily salary dynamically and return it.
        """
        try:
            basic_salary = Decimal(obj.employee.salary_details.basic_salary)
            daily_salary = basic_salary / Decimal(30)
            return round(daily_salary, 2) 
        except AttributeError:
            return None

    def get_gross_salary(self, obj):
        """
        Retrieve the gross salary from the employee's salary details.
        """
        try:
            return Decimal(obj.employee.salary_details.gross_salary)
        except AttributeError:
            return None




class EmployeeDetailsWithSalarySerializer(serializers.ModelSerializer):
    salary_details = SalaryDetailsSerializer(read_only=True)
    # payroll_records = PayrollRecordSerializer(many=True, read_only=True, source='payrollrecord_set')

    class Meta:
        model = Employee
        fields = [
            'id', 'user', 'first_name', 'last_name', 'date_of_birth', 'designation',
            'department', 'salary_details',
        ]


class ColleagueSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = Employee
        fields = ['full_name', 'designation', 'department', 'photo']

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"
    



class DashboardSerializer(serializers.Serializer):
    total_salary_for_month = serializers.DecimalField(max_digits=10, decimal_places=2)
    total_overtime_for_month = serializers.DecimalField(max_digits=10, decimal_places=2)
    previous_month_salary = serializers.DecimalField(max_digits=10, decimal_places=2)
    previous_month_overtime = serializers.DecimalField(max_digits=10, decimal_places=2)
    monthly_data = serializers.ListField(child=serializers.DictField())
    total_employees = serializers.IntegerField()
    average_salary_for_month = serializers.DecimalField(max_digits=10, decimal_places=2)

    def to_representation(self, instance):
        # Get the current year and month
        today = timezone.now()
        current_month = today.month
        print(today)
        print(current_month)
        current_year = today.year
        previous_month = current_month - 1 if current_month > 1 else 12
        previous_month_year = current_year if current_month > 1 else current_year - 1

        # Get total salary for the current month
        total_salary_for_month = PayrollRecord.objects.filter(
            month=current_month, year=current_year
        ).aggregate(total_salary=Sum('total_salary_for_month'))['total_salary'] or Decimal(0)

        # Get total overtime for the current month
        total_overtime_for_month = PayrollRecord.objects.filter(
            month=current_month, year=current_year
        ).aggregate(total_overtime=Sum('overtime_days'))['total_overtime'] or Decimal(0)

        # Get previous month's total salary
        previous_month_salary = PayrollRecord.objects.filter(
            month=previous_month, year=previous_month_year
        ).aggregate(total_salary=Sum('total_salary_for_month'))['total_salary'] or Decimal(0)

        # Get previous month's total overtime
        previous_month_overtime = PayrollRecord.objects.filter(
            month=previous_month, year=previous_month_year
        ).aggregate(total_overtime=Sum('overtime_days'))['total_overtime'] or Decimal(0)

        # Gather monthly totals for all months available in the PayrollRecord database
        monthly_data = PayrollRecord.objects.values('year', 'month').annotate(
            total_salary=Sum('total_salary_for_month'),
            total_overtime=Sum('overtime_days')
        ).order_by('-year', '-month')

        # Prepare monthly data in a list of dicts format for serialization
        monthly_data_list = [
            {
                'month': data['month'],
                'year': data['year'],
                'total_salary': data['total_salary'] or Decimal(0),
                'total_overtime': data['total_overtime'] or Decimal(0),
            }
            for data in monthly_data
        ]

        # Get the total number of employees
        total_employees = Employee.objects.count()

        # Calculate the average salary for the current month
        # Get the total salary of all employees for the current month
        total_salary_current_month = PayrollRecord.objects.filter(
            month=current_month, year=current_year
        ).aggregate(total_salary=Sum('total_salary_for_month'))['total_salary'] or Decimal(0)

        # Calculate the average salary if there are employees
        average_salary_for_month = total_salary_current_month / total_employees if total_employees > 0 else Decimal(0)

        # Return the aggregated data including the total number of employees and average salary
        return {
            'total_salary_for_month': total_salary_for_month,
            'total_overtime_for_month': total_overtime_for_month,
            'previous_month_salary': previous_month_salary,
            'previous_month_overtime': previous_month_overtime,
            'monthly_data': monthly_data_list,
            'total_employees': total_employees,
            'average_salary_for_month': average_salary_for_month, 
        }
    



class SalaryRevisionSerializerCreate(serializers.ModelSerializer):
    class Meta:
        model = SalaryRevision
        fields = ['revised_basic_salary', 'revised_housing_allowance', 'revised_transport_allowance',
                  'revised_other_allowance', 'revision_reason', 'previous_basic_salary',
                  'previous_housing_allowance', 'previous_transport_allowance', 'previous_gross_salary',
                  'previous_other_allowance', 'revision_date', 'employee']
        

class SalaryRevisionSerializer(serializers.ModelSerializer):
    employee = EmployeeDetailsWithSalarySerializer()
    revision_date = serializers.DateTimeField(format='%d-%m-%Y')
    class Meta:
        model = SalaryRevision
        fields = '__all__'