import os
from django.db import models
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator, MaxValueValidator
from django.conf import settings

class Employee(models.Model):
    DEPARTMENT_CHOICES = [
        ('Accounts', 'Accounts'),
        ('Operations', 'Operations'),
        ('IT', 'IT'),
    ]
    GENDER_CHOICES = [
        ('Male', 'Male'),
        ('Female', 'Female'),
    ]
    MARITAL_CHOICES = [
        ('Married', 'Married'),
        ('Unmarried', 'Unmarried'),
    ]

    def validate_file_type(file):
        ext = os.path.splitext(file.name)[1].lower()
        valid_extensions = ['.jpg', '.jpeg', '.png', '.pdf']
        if ext not in valid_extensions:
            raise ValidationError(f'Unsupported file extension. Allowed types: .jpg, .jpeg, .png, .pdf.')
        if file.size > 5 * 1024 * 1024:
            raise ValidationError('File size too large. Max size is 5MB.')
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='employee_profile')
    photo = models.ImageField(upload_to='photos/', blank=True, null=True, verbose_name='Photo', validators=[validate_file_type])
    first_name = models.CharField(max_length=100, verbose_name='First Name')
    last_name = models.CharField(max_length=100, verbose_name='Last Name')
    date_of_birth = models.DateField(verbose_name='Date of Birth')
    place_of_birth = models.CharField(max_length=100, verbose_name='Place of Birth')
    nationality = models.CharField(max_length=100, verbose_name='Nationality')
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, verbose_name='Gender')
    marital_status = models.CharField(max_length=10, choices=MARITAL_CHOICES, verbose_name='Marital Status')
    spouse_name = models.CharField(max_length=100, blank=True, null=True, verbose_name='Spouse Name')
    children = models.PositiveIntegerField(default=0, verbose_name='Children')
    father_name = models.CharField(max_length=100, verbose_name='Father Name')
    mother_name = models.CharField(max_length=100, verbose_name='Mother Name')
    phone_number = models.CharField(max_length=15, verbose_name='Phone Number')
    email = models.EmailField(verbose_name='Email')
    address = models.TextField(verbose_name='Address')
    date_joined = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(auto_now=True)
    emirates_id = models.CharField(max_length=20, blank=True, null=True, verbose_name='Emirates ID')
    passport_no = models.CharField(max_length=20, blank=True, null=True, verbose_name='Passport No')
    qualification = models.CharField(max_length=100, verbose_name='Qualification')
    visa_no = models.CharField(max_length=20, blank=True, null=True, verbose_name='Visa No')
    visa_expiry = models.DateField(blank=True, null=True, verbose_name='Visa Expiry')
    designation = models.CharField(max_length=100, verbose_name='Designation')
    department = models.CharField(max_length=100, choices=DEPARTMENT_CHOICES, verbose_name='Department')
    previous_company_name = models.CharField(max_length=100, blank=True, null=True, verbose_name='Previous Company Name')
    previous_company_designation = models.CharField(max_length=100, blank=True, null=True, verbose_name='Previous Company Designation')
    emirates_id_image = models.FileField(upload_to='emirates_id/', blank=True, null=True, verbose_name='Emirates ID Image', validators=[validate_file_type])
    passport_image = models.FileField(upload_to='passport/', blank=True, null=True, verbose_name='Passport Image', validators=[validate_file_type])
    visa_image = models.FileField(upload_to='visa/', blank=True, null=True, verbose_name='Visa Image', validators=[validate_file_type])
    highest_degree_certificate = models.FileField(upload_to='degree/', blank=True, null=True, verbose_name='Highest Degree Certificate', validators=[validate_file_type])

    def __str__(self):
        return f'{self.first_name} {self.last_name}'


class SalaryDetails(models.Model):
    employee = models.OneToOneField(Employee, on_delete=models.CASCADE, related_name='salary_details')
    basic_salary = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Basic Salary')
    housing_allowance = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Housing Allowance')
    transport_allowance = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Transport Allowance')
    other_allowance = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Other Allowance')
    gross_salary = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Gross Salary')
    bank_name = models.CharField(max_length=100, verbose_name='Bank Name')
    account_no = models.CharField(max_length=100, verbose_name='Account No')
    iban = models.CharField(max_length=100, verbose_name='IBAN')
    swift_code = models.CharField(max_length=100, verbose_name='SWIFT Code')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.employee.first_name} {self.employee.last_name} - Salary Details'
    

class PayrollRecord(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    month = models.PositiveIntegerField(verbose_name="Month", validators=[
        MinValueValidator(1), MaxValueValidator(12)])
    year = models.PositiveIntegerField(verbose_name="Year", validators=[
        MinValueValidator(1900), MaxValueValidator(2100)])
    total_salary_for_month = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Total Salary for Month")
    overtime_days = models.PositiveIntegerField(default=0, verbose_name="Overtime Days")
    unpaid_days = models.PositiveIntegerField(default=0, verbose_name="Unpaid Days")
    other_deductions = models.DecimalField(max_digits=10, decimal_places=2, default=0, verbose_name="Other Deductions")
    remarks = models.TextField(blank=True, null=True, verbose_name="Remarks")
    created_at = models.DateTimeField(auto_now_add=True)

    def calculate_salary(self):
        try:
            salary_details = self.employee.salary_details
            basic_salary = salary_details.basic_salary
            daily_salary = basic_salary / 30
            overtime = self.overtime_days * (daily_salary * 1.5)
            unpaid_deduction = self.unpaid_days * daily_salary
            self.total_salary_for_month = (salary_details.gross_salary + overtime) - (unpaid_deduction + self.other_deductions)
            self.save()
        except AttributeError:
            raise ValidationError("Salary details for this employee are not defined.")

    def __str__(self):
        return f"Payroll for {self.employee.first_name} {self.employee.last_name} ({self.month}/{self.year})"
