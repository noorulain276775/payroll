"""
Tests for Employee models
"""
from django.test import TestCase
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.core.files.uploadedfile import SimpleUploadedFile
from decimal import Decimal
from employees.models import Employee, SalaryDetails, PayrollRecord, SalaryRevision

CustomUser = get_user_model()


class EmployeeModelTestCase(TestCase):
    """Test cases for Employee model"""
    
    def setUp(self):
        """Set up test data"""
        self.user = CustomUser.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
    
    def test_employee_creation(self):
        """Test basic employee creation"""
        employee = Employee.objects.create(
            user=self.user,
            first_name='John',
            last_name='Doe',
            date_of_birth='1990-01-01',
            place_of_birth='Test City',
            nationality='Test Nationality',
            gender='Male',
            marital_status='Unmarried',
            phone_number='1234567890',
            personal_email='john@example.com',
            joining_date='2023-01-01',
            address='Test Address',
            designation='Developer',
            department='IT',
            qualification='Bachelor'
        )
        
        self.assertEqual(employee.first_name, 'John')
        self.assertEqual(employee.last_name, 'Doe')
        self.assertEqual(employee.department, 'IT')
        self.assertEqual(employee.gender, 'Male')
    
    def test_employee_string_representation(self):
        """Test employee string representation"""
        employee = Employee.objects.create(
            user=self.user,
            first_name='John',
            last_name='Doe',
            date_of_birth='1990-01-01',
            place_of_birth='Test City',
            nationality='Test Nationality',
            gender='Male',
            marital_status='Unmarried',
            phone_number='1234567890',
            personal_email='john@example.com',
            joining_date='2023-01-01',
            address='Test Address',
            designation='Developer',
            department='IT',
            qualification='Bachelor'
        )
        
        expected = 'John Doe'
        self.assertEqual(str(employee), expected)
    
    def test_employee_optional_fields(self):
        """Test employee creation with optional fields"""
        employee = Employee.objects.create(
            user=self.user,
            first_name='John',
            last_name='Doe',
            date_of_birth='1990-01-01',
            place_of_birth='Test City',
            nationality='Test Nationality',
            gender='Male',
            marital_status='Unmarried',
            phone_number='1234567890',
            personal_email='john@example.com',
            joining_date='2023-01-01',
            address='Test Address',
            designation='Developer',
            department='IT',
            qualification='Bachelor',
            spouse_name='Jane Doe',
            children=2,
            father_name='Father Doe',
            mother_name='Mother Doe',
            company_phone_number='0987654321',
            home_town_number='1122334455',
            email='john@company.com',
            insurance_expiry_date='2025-12-31',
            emergency_contact_name='Emergency Contact',
            emergency_contact_number='5555555555',
            emergency_contact_relation='Spouse',
            emirates_id='1234567890123456',
            emirates_id_expiry='2025-12-31',
            passport_no='A12345678',
            visa_no='V12345678',
            visa_expiry='2025-12-31',
            previous_company_name='Previous Company',
            previous_company_designation='Previous Role',
            medical_conditions='None',
            blood_group='O+',
            allergies='None'
        )
        
        self.assertEqual(employee.spouse_name, 'Jane Doe')
        self.assertEqual(employee.children, 2)
        self.assertEqual(employee.father_name, 'Father Doe')
        self.assertEqual(employee.mother_name, 'Mother Doe')
        self.assertEqual(employee.company_phone_number, '0987654321')
        self.assertEqual(employee.email, 'john@company.com')
        self.assertEqual(employee.emergency_contact_name, 'Emergency Contact')
        self.assertEqual(employee.blood_group, 'O+')
    
    def test_employee_choices_validation(self):
        """Test employee choice field validation"""
        # Test valid department
        employee = Employee.objects.create(
            user=self.user,
            first_name='John',
            last_name='Doe',
            date_of_birth='1990-01-01',
            place_of_birth='Test City',
            nationality='Test Nationality',
            gender='Male',
            marital_status='Unmarried',
            phone_number='1234567890',
            personal_email='john@example.com',
            joining_date='2023-01-01',
            address='Test Address',
            designation='Developer',
            department='IT',
            qualification='Bachelor'
        )
        
        self.assertIn(employee.department, ['Accounts', 'Operations', 'IT'])
        self.assertIn(employee.gender, ['Male', 'Female'])
        self.assertIn(employee.marital_status, ['Married', 'Unmarried'])


class SalaryDetailsModelTestCase(TestCase):
    """Test cases for SalaryDetails model"""
    
    def setUp(self):
        """Set up test data"""
        self.user = CustomUser.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        
        self.employee = Employee.objects.create(
            user=self.user,
            first_name='John',
            last_name='Doe',
            date_of_birth='1990-01-01',
            place_of_birth='Test City',
            nationality='Test Nationality',
            gender='Male',
            marital_status='Unmarried',
            phone_number='1234567890',
            personal_email='john@example.com',
            joining_date='2023-01-01',
            address='Test Address',
            designation='Developer',
            department='IT',
            qualification='Bachelor'
        )
    
    def test_salary_details_creation(self):
        """Test salary details creation"""
        salary = SalaryDetails.objects.create(
            employee=self.employee,
            basic_salary=Decimal('5000.00'),
            housing_allowance=Decimal('2000.00'),
            transport_allowance=Decimal('500.00'),
            other_allowance=Decimal('300.00'),
            gross_salary=Decimal('7800.00'),
            bank_name='Test Bank',
            account_no='1234567890',
            iban='AE123456789012345678901',
            swift_code='TESTAEXX'
        )
        
        self.assertEqual(salary.basic_salary, Decimal('5000.00'))
        self.assertEqual(salary.housing_allowance, Decimal('2000.00'))
        self.assertEqual(salary.gross_salary, Decimal('7800.00'))
        self.assertEqual(salary.bank_name, 'Test Bank')
    
    def test_salary_details_string_representation(self):
        """Test salary details string representation"""
        salary = SalaryDetails.objects.create(
            employee=self.employee,
            basic_salary=Decimal('5000.00'),
            housing_allowance=Decimal('2000.00'),
            transport_allowance=Decimal('500.00'),
            other_allowance=Decimal('300.00'),
            gross_salary=Decimal('7800.00')
        )
        
        expected = f'{self.employee.first_name} {self.employee.last_name} - Salary Details'
        self.assertEqual(str(salary), expected)
    
    def test_calculate_gross_salary(self):
        """Test gross salary calculation"""
        salary = SalaryDetails.objects.create(
            employee=self.employee,
            basic_salary=Decimal('5000.00'),
            housing_allowance=Decimal('2000.00'),
            transport_allowance=Decimal('500.00'),
            other_allowance=Decimal('300.00'),
            gross_salary=Decimal('0.00')  # Will be calculated
        )
        
        calculated_gross = salary.calculate_gross_salary()
        expected_gross = Decimal('7800.00')
        self.assertEqual(calculated_gross, expected_gross)
    
    def test_calculate_gross_salary_with_zero_values(self):
        """Test gross salary calculation with zero values"""
        salary = SalaryDetails.objects.create(
            employee=self.employee,
            basic_salary=Decimal('0.00'),
            housing_allowance=Decimal('0.00'),
            transport_allowance=Decimal('0.00'),
            other_allowance=Decimal('0.00'),
            gross_salary=Decimal('0.00')
        )
        
        calculated_gross = salary.calculate_gross_salary()
        self.assertEqual(calculated_gross, Decimal('0.00'))
    
    def test_save_method_updates_gross_salary(self):
        """Test that save method automatically updates gross salary"""
        salary = SalaryDetails.objects.create(
            employee=self.employee,
            basic_salary=Decimal('5000.00'),
            housing_allowance=Decimal('2000.00'),
            transport_allowance=Decimal('500.00'),
            other_allowance=Decimal('300.00'),
            gross_salary=Decimal('0.00')
        )
        
        # Refresh from database
        salary.refresh_from_db()
        
        # Gross salary should be automatically calculated
        self.assertEqual(salary.gross_salary, Decimal('7800.00'))


class PayrollRecordModelTestCase(TestCase):
    """Test cases for PayrollRecord model"""
    
    def setUp(self):
        """Set up test data"""
        self.user = CustomUser.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        
        self.employee = Employee.objects.create(
            user=self.user,
            first_name='John',
            last_name='Doe',
            date_of_birth='1990-01-01',
            place_of_birth='Test City',
            nationality='Test Nationality',
            gender='Male',
            marital_status='Unmarried',
            phone_number='1234567890',
            personal_email='john@example.com',
            joining_date='2023-01-01',
            address='Test Address',
            designation='Developer',
            department='IT',
            qualification='Bachelor'
        )
        
        self.salary_details = SalaryDetails.objects.create(
            employee=self.employee,
            basic_salary=Decimal('5000.00'),
            housing_allowance=Decimal('2000.00'),
            transport_allowance=Decimal('500.00'),
            other_allowance=Decimal('300.00'),
            gross_salary=Decimal('7800.00')
        )
    
    def test_payroll_record_creation(self):
        """Test payroll record creation"""
        payroll = PayrollRecord.objects.create(
            employee=self.employee,
            month=1,
            year=2024,
            total_salary_for_month=Decimal('7800.00'),
            overtime_days=2,
            overtime_amount=Decimal('500.00'),
            normal_overtime_days=1,
            normal_overtime_amount=Decimal('200.00'),
            unpaid_days=1,
            unpaid_amount=Decimal('260.00'),
            total_workable_days=30,
            other_deductions=Decimal('100.00'),
            current_daily_salary=Decimal('260.00'),
            current_gross_salary=Decimal('7800.00'),
            current_basic_salary=Decimal('5000.00'),
            remarks='Test payroll'
        )
        
        self.assertEqual(payroll.employee, self.employee)
        self.assertEqual(payroll.month, 1)
        self.assertEqual(payroll.year, 2024)
        self.assertEqual(payroll.total_salary_for_month, Decimal('7800.00'))
    
    def test_payroll_record_string_representation(self):
        """Test payroll record string representation"""
        payroll = PayrollRecord.objects.create(
            employee=self.employee,
            month=1,
            year=2024,
            total_salary_for_month=Decimal('7800.00'),
            total_workable_days=30
        )
        
        expected = f"Payroll for {self.employee.first_name} {self.employee.last_name} (1/2024)"
        self.assertEqual(str(payroll), expected)
    
    def test_payroll_record_unique_constraint(self):
        """Test payroll record unique constraint"""
        # Create first record
        PayrollRecord.objects.create(
            employee=self.employee,
            month=1,
            year=2024,
            total_salary_for_month=Decimal('7800.00'),
            total_workable_days=30
        )
        
        # Try to create duplicate record
        with self.assertRaises(Exception):  # Should raise integrity error
            PayrollRecord.objects.create(
                employee=self.employee,
                month=1,
                year=2024,
                total_salary_for_month=Decimal('8000.00'),
                total_workable_days=30
            )
    
    def test_calculate_salary_30_workable_days(self):
        """Test salary calculation for 30 workable days"""
        payroll = PayrollRecord.objects.create(
            employee=self.employee,
            month=1,
            year=2024,
            overtime_days=2,
            normal_overtime_days=1,
            unpaid_days=1,
            total_workable_days=30,
            other_deductions=Decimal('100.00')
        )
        
        calculated_salary = payroll.calculate_salary()
        self.assertIsNotNone(calculated_salary)
        self.assertGreater(calculated_salary, Decimal('0.00'))
    
    def test_calculate_salary_less_than_30_workable_days(self):
        """Test salary calculation for less than 30 workable days"""
        payroll = PayrollRecord.objects.create(
            employee=self.employee,
            month=1,
            year=2024,
            overtime_days=1,
            normal_overtime_days=1,
            unpaid_days=1,
            total_workable_days=25,
            other_deductions=Decimal('100.00')
        )
        
        calculated_salary = payroll.calculate_salary()
        self.assertIsNotNone(calculated_salary)
        self.assertGreater(calculated_salary, Decimal('0.00'))
    
    def test_save_method_updates_total_salary(self):
        """Test that save method automatically updates total salary"""
        payroll = PayrollRecord.objects.create(
            employee=self.employee,
            month=1,
            year=2024,
            overtime_days=2,
            normal_overtime_days=1,
            unpaid_days=1,
            total_workable_days=30,
            other_deductions=Decimal('100.00')
        )
        
        # Refresh from database
        payroll.refresh_from_db()
        
        # Total salary should be automatically calculated
        self.assertGreater(payroll.total_salary_for_month, Decimal('0.00'))


class SalaryRevisionModelTestCase(TestCase):
    """Test cases for SalaryRevision model"""
    
    def setUp(self):
        """Set up test data"""
        self.user = CustomUser.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        
        self.employee = Employee.objects.create(
            user=self.user,
            first_name='John',
            last_name='Doe',
            date_of_birth='1990-01-01',
            place_of_birth='Test City',
            nationality='Test Nationality',
            gender='Male',
            marital_status='Unmarried',
            phone_number='1234567890',
            personal_email='john@example.com',
            joining_date='2023-01-01',
            address='Test Address',
            designation='Developer',
            department='IT',
            qualification='Bachelor'
        )
        
        self.salary_details = SalaryDetails.objects.create(
            employee=self.employee,
            basic_salary=Decimal('5000.00'),
            housing_allowance=Decimal('2000.00'),
            transport_allowance=Decimal('500.00'),
            other_allowance=Decimal('300.00'),
            gross_salary=Decimal('7800.00')
        )
    
    def test_salary_revision_creation(self):
        """Test salary revision creation"""
        revision = SalaryRevision.objects.create(
            employee=self.employee,
            revised_basic_salary=Decimal('6000.00'),
            revised_housing_allowance=Decimal('2500.00'),
            revised_transport_allowance=Decimal('600.00'),
            revised_other_allowance=Decimal('400.00'),
            revised_gross_salary=Decimal('9500.00'),
            previous_basic_salary=Decimal('5000.00'),
            previous_housing_allowance=Decimal('2000.00'),
            previous_transport_allowance=Decimal('500.00'),
            previous_other_allowance=Decimal('300.00'),
            previous_gross_salary=Decimal('7800.00'),
            revised_salary_effective_from='2024-02-01',
            revision_reason='Performance increase'
        )
        
        self.assertEqual(revision.employee, self.employee)
        self.assertEqual(revision.revised_basic_salary, Decimal('6000.00'))
        self.assertEqual(revision.revision_reason, 'Performance increase')
    
    def test_salary_revision_string_representation(self):
        """Test salary revision string representation"""
        revision = SalaryRevision.objects.create(
            employee=self.employee,
            revised_basic_salary=Decimal('6000.00'),
            revised_housing_allowance=Decimal('2500.00'),
            revised_transport_allowance=Decimal('600.00'),
            revised_other_allowance=Decimal('400.00'),
            revised_gross_salary=Decimal('9500.00'),
            previous_basic_salary=Decimal('5000.00'),
            previous_housing_allowance=Decimal('2000.00'),
            previous_transport_allowance=Decimal('500.00'),
            previous_other_allowance=Decimal('300.00'),
            previous_gross_salary=Decimal('7800.00'),
            revised_salary_effective_from='2024-02-01',
            revision_reason='Performance increase'
        )
        
        expected = f"Salary Revision for {self.employee.first_name} {self.employee.last_name}"
        self.assertIn(expected, str(revision))
    
    def test_calculate_revised_gross_salary(self):
        """Test revised gross salary calculation"""
        revision = SalaryRevision.objects.create(
            employee=self.employee,
            revised_basic_salary=Decimal('6000.00'),
            revised_housing_allowance=Decimal('2500.00'),
            revised_transport_allowance=Decimal('600.00'),
            revised_other_allowance=Decimal('400.00'),
            revised_gross_salary=Decimal('0.00'),
            previous_basic_salary=Decimal('5000.00'),
            previous_housing_allowance=Decimal('2000.00'),
            previous_transport_allowance=Decimal('500.00'),
            previous_other_allowance=Decimal('300.00'),
            previous_gross_salary=Decimal('7800.00'),
            revised_salary_effective_from='2024-02-01',
            revision_reason='Performance increase'
        )
        
        calculated_gross = revision.calculate_revised_gross_salary()
        expected_gross = Decimal('9500.00')
        self.assertEqual(calculated_gross, expected_gross)
    
    def test_save_method_updates_gross_salary(self):
        """Test that save method automatically updates revised gross salary"""
        revision = SalaryRevision.objects.create(
            employee=self.employee,
            revised_basic_salary=Decimal('6000.00'),
            revised_housing_allowance=Decimal('2500.00'),
            revised_transport_allowance=Decimal('600.00'),
            revised_other_allowance=Decimal('400.00'),
            revised_gross_salary=Decimal('0.00'),
            previous_basic_salary=Decimal('5000.00'),
            previous_housing_allowance=Decimal('2000.00'),
            previous_transport_allowance=Decimal('500.00'),
            previous_other_allowance=Decimal('300.00'),
            previous_gross_salary=Decimal('7800.00'),
            revised_salary_effective_from='2024-02-01',
            revision_reason='Performance increase'
        )
        
        # Refresh from database
        revision.refresh_from_db()
        
        # Revised gross salary should be automatically calculated
        self.assertEqual(revision.revised_gross_salary, Decimal('9500.00'))
    
    def test_update_salary_details(self):
        """Test that salary details are updated after revision"""
        revision = SalaryRevision.objects.create(
            employee=self.employee,
            revised_basic_salary=Decimal('6000.00'),
            revised_housing_allowance=Decimal('2500.00'),
            revised_transport_allowance=Decimal('600.00'),
            revised_other_allowance=Decimal('400.00'),
            revised_gross_salary=Decimal('9500.00'),
            previous_basic_salary=Decimal('5000.00'),
            previous_housing_allowance=Decimal('2000.00'),
            previous_transport_allowance=Decimal('500.00'),
            previous_other_allowance=Decimal('300.00'),
            previous_gross_salary=Decimal('7800.00'),
            revised_salary_effective_from='2024-02-01',
            revision_reason='Performance increase'
        )
        
        # Refresh salary details from database
        self.salary_details.refresh_from_db()
        
        # Check that salary details were updated
        self.assertEqual(self.salary_details.basic_salary, Decimal('6000.00'))
        self.assertEqual(self.salary_details.housing_allowance, Decimal('2500.00'))
        self.assertEqual(self.salary_details.transport_allowance, Decimal('600.00'))
        self.assertEqual(self.salary_details.other_allowance, Decimal('400.00'))
        self.assertEqual(self.salary_details.gross_salary, Decimal('9500.00'))
