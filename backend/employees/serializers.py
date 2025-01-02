from rest_framework import serializers
from .models import Employee, SalaryDetails, PayrollRecord

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = [
            'id', 'user', 'first_name', 'last_name', 'date_of_birth', 'place_of_birth',
            'nationality', 'gender', 'marital_status', 'spouse_name', 'children',
            'photo', 'father_name', 'mother_name', 'phone_number', 'email', 'address',
            'emirates_id', 'passport_no', 'qualification', 'visa_no', 'visa_expiry',
            'designation', 'department', 'previous_company_name',
            'previous_company_designation', 'emirates_id_image', 'passport_image',
            'visa_image', 'highest_degree_certificate',
        ]
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
    class Meta:
        model = SalaryDetails
        fields = [
            'id', 'employee', 'basic_salary', 'housing_allowance', 'transport_allowance',
            'other_allowance', 'gross_salary', 'bank_name', 'account_no', 'iban', 'swift_code',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'gross_salary', 'created_at', 'updated_at']

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
    class Meta:
        model = PayrollRecord
        fields = [
            'id', 'employee', 'month', 'year', 'total_salary_for_month', 'overtime_days',
            'unpaid_days', 'other_deductions', 'remarks', 'created_at',
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

    def calculate_salary(self):
        """
        Logic to calculate total salary for the month, based on model's method.
        """
        self.instance.calculate_salary()


class EmployeeDetailsWithSalarySerializer(serializers.ModelSerializer):
    salary_details = SalaryDetailsSerializer(read_only=True)
    payroll_records = PayrollRecordSerializer(many=True, read_only=True, source='payrollrecord_set')

    class Meta:
        model = Employee
        fields = [
            'id', 'user', 'first_name', 'last_name', 'date_of_birth', 'designation',
            'department', 'salary_details', 'payroll_records',
        ]


class ColleagueSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = Employee
        fields = ['full_name', 'designation', 'department', 'photo']

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"
    

class EmployeeUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ['first_name', 'last_name', 'date_of_birth', 'place_of_birth', 'nationality', 'gender', 
                  'marital_status', 'spouse_name', 'children', 'father_name', 'mother_name', 'phone_number', 
                  'email', 'address', 'photo', 'emirates_id', 'passport_no', 'qualification', 'visa_no', 
                  'visa_expiry', 'emirates_id_image', 'passport_image', 'visa_image', 'highest_degree_certificate']
