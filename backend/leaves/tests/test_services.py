"""
Tests for Leave services
"""
from django.test import TestCase
from django.contrib.auth import get_user_model
from django.utils import timezone
from decimal import Decimal
from employees.models import Employee
from leaves.models import Leave, LeaveBalance, LeaveAccrual
from leaves.services import LeaveService, LeaveAccrualService

CustomUser = get_user_model()


class LeaveServiceTestCase(TestCase):
    """Test cases for LeaveService"""
    
    def setUp(self):
        """Set up test data"""
        # Create test user
        self.user = CustomUser.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        
        # Create test employee
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
        
        # Create leave balance
        self.leave_balance = LeaveBalance.objects.create(
            employee=self.employee,
            annual_leave_balance=Decimal('10.0'),
            sick_leave_balance=Decimal('5.0')
        )
    
    def test_calculate_leave_days(self):
        """Test leave days calculation"""
        start_date = timezone.now().date()
        end_date = start_date + timezone.timedelta(days=2)
        
        days = LeaveService.calculate_leave_days(start_date, end_date)
        self.assertEqual(days, 3)  # 2 days difference + 1
    
    def test_get_balance_field_for_leave_type(self):
        """Test getting balance field for leave type"""
        field = LeaveService.get_balance_field_for_leave_type('Annual')
        self.assertEqual(field, 'annual_leave_balance')
        
        field = LeaveService.get_balance_field_for_leave_type('Sick')
        self.assertEqual(field, 'sick_leave_balance')
        
        field = LeaveService.get_balance_field_for_leave_type('Invalid')
        self.assertIsNone(field)
    
    def test_process_leave_approval_sufficient_balance(self):
        """Test leave approval with sufficient balance"""
        leave = Leave.objects.create(
            employee=self.employee,
            leave_type='Annual',
            start_date='2024-01-01',
            end_date='2024-01-03',
            reason='Vacation',
            days_taken=Decimal('3.0')
        )
        
        result = LeaveService.process_leave_approval(leave, self.user)
        self.assertTrue(result)
        self.assertEqual(leave.status, 'Approved')
        self.assertEqual(leave.approved_by, self.user)
        self.assertIsNotNone(leave.approved_on)
    
    def test_process_leave_approval_insufficient_balance(self):
        """Test leave approval with insufficient balance"""
        leave = Leave.objects.create(
            employee=self.employee,
            leave_type='Annual',
            start_date='2024-01-01',
            end_date='2024-01-15',
            reason='Long Vacation',
            days_taken=Decimal('15.0')
        )
        
        result = LeaveService.process_leave_approval(leave, self.user)
        self.assertFalse(result)
        self.assertEqual(leave.status, 'Rejected')
        self.assertEqual(leave.remarks, 'Not enough leave balance')
    
    def test_process_leave_approval_unpaid_leave(self):
        """Test unpaid leave approval"""
        leave = Leave.objects.create(
            employee=self.employee,
            leave_type='Unpaid',
            start_date='2024-01-01',
            end_date='2024-01-03',
            reason='Personal',
            days_taken=Decimal('3.0')
        )
        
        result = LeaveService.process_leave_approval(leave, self.user)
        self.assertTrue(result)
        self.assertEqual(leave.status, 'Approved')
    
    def test_process_leave_approval_no_balance_record(self):
        """Test leave approval when no balance record exists"""
        # Delete existing balance
        self.leave_balance.delete()
        
        leave = Leave.objects.create(
            employee=self.employee,
            leave_type='Annual',
            start_date='2024-01-01',
            end_date='2024-01-03',
            reason='Vacation',
            days_taken=Decimal('3.0')
        )
        
        result = LeaveService.process_leave_approval(leave, self.user)
        self.assertFalse(result)
        self.assertEqual(leave.status, 'Rejected')
        self.assertEqual(leave.remarks, 'Leave balance not found')
    
    def test_approve_leave_sufficient_balance(self):
        """Test direct leave approval with sufficient balance"""
        leave = Leave.objects.create(
            employee=self.employee,
            leave_type='Annual',
            start_date='2024-01-01',
            end_date='2024-01-03',
            reason='Vacation',
            days_taken=Decimal('3.0')
        )
        
        result = LeaveService.approve_leave(leave, self.user)
        self.assertTrue(result)
        self.assertEqual(leave.status, 'Approved')
        
        # Check balance was reduced
        self.leave_balance.refresh_from_db()
        self.assertEqual(self.leave_balance.annual_leave_balance, Decimal('7.0'))
    
    def test_approve_leave_insufficient_balance(self):
        """Test direct leave approval with insufficient balance"""
        leave = Leave.objects.create(
            employee=self.employee,
            leave_type='Annual',
            start_date='2024-01-01',
            end_date='2024-01-15',
            reason='Long Vacation',
            days_taken=Decimal('15.0')
        )
        
        result = LeaveService.approve_leave(leave, self.user)
        self.assertFalse(result)
        self.assertEqual(leave.status, 'Rejected')
    
    def test_reject_leave(self):
        """Test leave rejection"""
        leave = Leave.objects.create(
            employee=self.employee,
            leave_type='Annual',
            start_date='2024-01-01',
            end_date='2024-01-03',
            reason='Vacation',
            days_taken=Decimal('3.0')
        )
        
        result = LeaveService.reject_leave(leave, self.user)
        self.assertFalse(result)
        self.assertEqual(leave.status, 'Rejected')
        self.assertEqual(leave.approved_by, self.user)
        self.assertIsNotNone(leave.approved_on)


class LeaveAccrualServiceTestCase(TestCase):
    """Test cases for LeaveAccrualService"""
    
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
        
        self.leave_balance = LeaveBalance.objects.create(
            employee=self.employee,
            annual_leave_balance=Decimal('10.0')
        )
        
        self.leave_accrual = LeaveAccrual.objects.create(
            employee=self.employee,
            leave_balance=Decimal('10.0'),
            last_accrued_date=timezone.now().date()
        )
    
    def test_should_accrue_leave_same_month(self):
        """Test should_accrue_leave for same month"""
        current_date = timezone.now().date()
        last_accrued = current_date.replace(day=1)
        
        result = LeaveAccrualService.should_accrue_leave(last_accrued, current_date)
        self.assertFalse(result)
    
    def test_should_accrue_leave_different_month(self):
        """Test should_accrue_leave for different month"""
        current_date = timezone.now().date()
        last_accrued = current_date.replace(month=current_date.month - 1, day=1)
        
        result = LeaveAccrualService.should_accrue_leave(last_accrued, current_date)
        self.assertTrue(result)
    
    def test_should_accrue_leave_different_year(self):
        """Test should_accrue_leave for different year"""
        current_date = timezone.now().date()
        last_accrued = current_date.replace(year=current_date.year - 1, month=12, day=1)
        
        result = LeaveAccrualService.should_accrue_leave(last_accrued, current_date)
        self.assertTrue(result)
    
    def test_accrue_monthly_leave_for_employee(self):
        """Test monthly leave accrual for employee"""
        current_date = timezone.now().date()
        initial_balance = self.leave_accrual.leave_balance
        initial_annual_balance = self.leave_balance.annual_leave_balance
        
        LeaveAccrualService.accrue_monthly_leave_for_employee(self.leave_accrual, current_date)
        
        # Refresh from database
        self.leave_accrual.refresh_from_db()
        self.leave_balance.refresh_from_db()
        
        # Check accrual record was updated
        self.assertEqual(self.leave_accrual.last_accrued_date, current_date)
        
        # Check leave balance was updated
        self.assertEqual(
            self.leave_balance.annual_leave_balance,
            initial_annual_balance + Decimal('2.5')
        )
    
    def test_accrue_monthly_leave_for_employee_no_balance_record(self):
        """Test monthly leave accrual when no balance record exists"""
        # Delete existing balance
        self.leave_balance.delete()
        
        current_date = timezone.now().date()
        initial_balance = self.leave_accrual.leave_balance
        
        LeaveAccrualService.accrue_monthly_leave_for_employee(self.leave_accrual, current_date)
        
        # Refresh from database
        self.leave_accrual.refresh_from_db()
        
        # Check accrual record was updated
        self.assertEqual(self.leave_accrual.last_accrued_date, current_date)
        
        # Check new balance record was created
        new_balance = LeaveBalance.objects.get(employee=self.employee)
        self.assertEqual(new_balance.annual_leave_balance, Decimal('2.5'))
