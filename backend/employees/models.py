import os
from django.db import models
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator, MaxValueValidator
from django.conf import settings
from decimal import Decimal

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
    photo = models.ImageField(upload_to='photos/', blank=True, null=True, verbose_name='Photo', validators=[validate_file_type], default='photos/default.png')
    first_name = models.CharField(max_length=100, verbose_name='First Name')
    last_name = models.CharField(max_length=100, verbose_name='Last Name')
    date_of_birth = models.DateField(verbose_name='Date of Birth')
    place_of_birth = models.CharField(max_length=100, verbose_name='Place of Birth')
    nationality = models.CharField(max_length=100, verbose_name='Nationality')
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, verbose_name='Gender')
    marital_status = models.CharField(max_length=10, choices=MARITAL_CHOICES, verbose_name='Marital Status')
    spouse_name = models.CharField(max_length=100, blank=True, null=True, verbose_name='Spouse Name')
    children = models.PositiveIntegerField(default=0, verbose_name='Children', null=True, blank=True)
    father_name = models.CharField(max_length=100, verbose_name='Father Name')
    mother_name = models.CharField(max_length=100, verbose_name='Mother Name')
    phone_number = models.CharField(max_length=15, verbose_name='Phone Number')
    company_phone_number = models.CharField(max_length=15, verbose_name='Company Phone Number', null=True, blank=True)
    home_town_number = models.CharField(max_length=15, verbose_name='Home Town Number', null=True, blank=True)
    email = models.EmailField(verbose_name='Company Email', default="example@liya.ae")
    personal_email = models.EmailField(verbose_name='Personal Email')
    joining_date = models.DateField(verbose_name='Joining Date')
    insurance_expiry_date = models.DateField(verbose_name='Insurance Expiry Date', null=True, blank=True)
    address = models.TextField(verbose_name='Address')
    created_at = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(auto_now=True)
    emergency_contact_name = models.CharField(max_length=100, verbose_name='Emergency Contact Name', null=True, blank=True)
    emergency_contact_number = models.CharField(max_length=15, verbose_name='Emergency Contact Number', null=True, blank=True)
    emergency_contact_relation = models.CharField(max_length=100, verbose_name='Emergency Contact Relation', null=True, blank=True)
    emirates_id = models.CharField(max_length=20, blank=True, null=True, verbose_name='Emirates ID')
    emirates_id_expiry = models.DateField(blank=True, null=True, verbose_name='Emirates ID Expiry')
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
    insurance_card = models.FileField(upload_to='insurance/', blank=True, null=True, verbose_name='Insurance Card', validators=[validate_file_type])

    def __str__(self):
        return f'{self.first_name} {self.last_name}'


class SalaryDetails(models.Model):
    employee = models.OneToOneField(Employee, on_delete=models.CASCADE, related_name='salary_details')
    basic_salary = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Basic Salary')
    housing_allowance = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Housing Allowance')
    transport_allowance = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Transport Allowance')
    other_allowance = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Other Allowance', default=0)
    gross_salary = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Gross Salary')
    bank_name = models.CharField(max_length=100, verbose_name='Bank Name', blank=True, null=True)
    account_no = models.CharField(max_length=100, verbose_name='Account No', blank=True, null=True)
    iban = models.CharField(max_length=100, verbose_name='IBAN', blank=True, null=True)
    swift_code = models.CharField(max_length=100, verbose_name='SWIFT Code', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def calculate_gross_salary(self):
        try:
            gross_Salary = self.basic_salary + self.housing_allowance + self.transport_allowance + self.other_allowance
            return gross_Salary
        except AttributeError:
            raise ValidationError("Salary details for this employee are not defined.")

    def save(self, *args, **kwargs):
        self.gross_salary= self.calculate_gross_salary()
        super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.employee.first_name} {self.employee.last_name} - Salary Details'
    

class PayrollRecord(models.Model):
    employee = models.ForeignKey('Employee', on_delete=models.CASCADE)
    month = models.PositiveIntegerField(verbose_name="Month", validators=[
        MinValueValidator(1), MaxValueValidator(12)])
    year = models.PositiveIntegerField(verbose_name="Year", validators=[
        MinValueValidator(1900), MaxValueValidator(2100)])
    total_salary_for_month = models.DecimalField(
        max_digits=10, decimal_places=2, verbose_name="Total Salary for Month")
    overtime_days = models.PositiveIntegerField(default=0, verbose_name="Holiday Overtime Days")
    normal_overtime_days = models.PositiveIntegerField(default=0, verbose_name="Normal Overtime Days")
    unpaid_days = models.PositiveIntegerField(default=0, verbose_name="Unpaid Days")
    other_deductions = models.DecimalField(
        max_digits=10, decimal_places=2, default=0, verbose_name="Other Deductions")
    remarks = models.TextField(blank=True, null=True, verbose_name="Remarks")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('employee', 'month', 'year')

    def calculate_salary(self):
        try:
            salary_details = self.employee.salary_details
            basic_salary = Decimal(salary_details.basic_salary)
            daily_salary = basic_salary / Decimal(30)
            overtime = self.overtime_days * (daily_salary * Decimal(1.5))
            normal_overtime = self.normal_overtime_days * (daily_salary * Decimal(1.25))
            unpaid_deduction = self.unpaid_days * daily_salary
            return (Decimal(salary_details.gross_salary) + overtime + normal_overtime) - (unpaid_deduction + self.other_deductions)
        except AttributeError:
            raise ValidationError("Salary details for this employee are not defined.")

    def save(self, *args, **kwargs):
        self.total_salary_for_month = self.calculate_salary()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Payroll for {self.employee.first_name} {self.employee.last_name} ({self.month}/{self.year})"


