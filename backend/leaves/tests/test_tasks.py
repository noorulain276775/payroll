"""
Tests for Celery tasks
"""
from django.test import TestCase
from django.contrib.auth import get_user_model
from django.utils import timezone
from decimal import Decimal
from unittest.mock import patch, MagicMock
from employees.models import Employee
from leaves.models import LeaveAccrual
from leaves.tasks import accrue_monthly_leave

CustomUser = get_user_model()


class CeleryTaskTestCase(TestCase):
    """Test cases for Celery tasks"""
    
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
        
        # Create leave accrual
        self.leave_accrual = LeaveAccrual.objects.create(
            employee=self.employee,
            leave_balance=Decimal('10.0'),
            last_accrued_date=timezone.now().date()
        )
    
    @patch('leaves.tasks.LeaveAccrualService')
    def test_accrue_monthly_leave_first_of_month(self, mock_service):
        """Test task execution on 1st of month"""
        # Mock the service method
        mock_service.should_accrue_leave.return_value = True
        mock_service.accrue_monthly_leave_for_employee.return_value = None
        
        # Mock timezone.now() to return 1st of month
        with patch('leaves.tasks.timezone.now') as mock_now:
            mock_now.return_value = timezone.datetime(2024, 1, 1, 12, 0, 0)
            
            # Execute the task
            result = accrue_monthly_leave()
            
            # Verify service was called
            mock_service.should_accrue_leave.assert_called_once()
            mock_service.accrue_monthly_leave_for_employee.assert_called_once()
    
    @patch('leaves.tasks.LeaveAccrualService')
    def test_accrue_monthly_leave_not_first_of_month(self, mock_service):
        """Test task execution not on 1st of month"""
        # Mock timezone.now() to return 15th of month
        with patch('leaves.tasks.timezone.now') as mock_now:
            mock_now.return_value = timezone.datetime(2024, 1, 15, 12, 0, 0)
            
            # Execute the task
            result = accrue_monthly_leave()
            
            # Verify service was NOT called
            mock_service.should_accrue_leave.assert_not_called()
            mock_service.accrue_monthly_leave_for_employee.assert_not_called()
    
    @patch('leaves.tasks.LeaveAccrualService')
    def test_accrue_monthly_leave_with_multiple_employees(self, mock_service):
        """Test task execution with multiple employees"""
        # Create another employee
        employee2 = Employee.objects.create(
            user=CustomUser.objects.create_user(
                username='testuser2',
                email='test2@example.com',
                password='testpass123'
            ),
            first_name='Jane',
            last_name='Smith',
            date_of_birth='1990-01-01',
            place_of_birth='Test City',
            nationality='Test Nationality',
            gender='Female',
            marital_status='Unmarried',
            phone_number='1234567891',
            personal_email='jane@example.com',
            joining_date='2023-01-01',
            address='Test Address',
            designation='Developer',
            department='IT',
            qualification='Bachelor'
        )
        
        LeaveAccrual.objects.create(
            employee=employee2,
            leave_balance=Decimal('5.0'),
            last_accrued_date=timezone.now().date()
        )
        
        # Mock the service methods
        mock_service.should_accrue_leave.return_value = True
        mock_service.accrue_monthly_leave_for_employee.return_value = None
        
        # Mock timezone.now() to return 1st of month
        with patch('leaves.tasks.timezone.now') as mock_now:
            mock_now.return_value = timezone.datetime(2024, 1, 1, 12, 0, 0)
            
            # Execute the task
            result = accrue_monthly_leave()
            
            # Verify service was called for both employees
            self.assertEqual(mock_service.should_accrue_leave.call_count, 2)
            self.assertEqual(mock_service.accrue_monthly_leave_for_employee.call_count, 2)
    
    @patch('leaves.tasks.LeaveAccrualService')
    def test_accrue_monthly_leave_service_errors(self, mock_service):
        """Test task execution when service encounters errors"""
        # Mock the service method to raise an exception
        mock_service.should_accrue_leave.side_effect = Exception("Service error")
        
        # Mock timezone.now() to return 1st of month
        with patch('leaves.tasks.timezone.now') as mock_now:
            mock_now.return_value = timezone.datetime(2024, 1, 1, 12, 0, 0)
            
            # Execute the task - should handle errors gracefully
            result = accrue_monthly_leave()
            
            # Verify service was called
            mock_service.should_accrue_leave.assert_called_once()
    
    def test_task_import(self):
        """Test that the task can be imported"""
        try:
            from leaves.tasks import accrue_monthly_leave
            self.assertTrue(True)  # Task imported successfully
        except ImportError as e:
            self.fail(f"Failed to import task: {e}")
    
    def test_task_function_exists(self):
        """Test that the task function exists and is callable"""
        self.assertTrue(callable(accrue_monthly_leave))
        self.assertEqual(accrue_monthly_leave.__name__, 'accrue_monthly_leave')
    
    def test_task_docstring(self):
        """Test that the task has proper documentation"""
        self.assertIsNotNone(accrue_monthly_leave.__doc__)
        self.assertIn("Runs on the 1st of every month", accrue_monthly_leave.__doc__)
