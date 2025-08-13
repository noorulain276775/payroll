"""
Tests for User models
"""
from django.test import TestCase
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from users.models import CustomUser

CustomUser = get_user_model()


class CustomUserModelTestCase(TestCase):
    """Test cases for CustomUser model"""
    
    def test_user_creation(self):
        """Test basic user creation"""
        user = CustomUser.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123',
            first_name='John',
            last_name='Doe',
            user_type='Employee',
            company_name='Test Company'
        )
        
        self.assertEqual(user.username, 'testuser')
        self.assertEqual(user.email, 'test@example.com')
        self.assertEqual(user.first_name, 'John')
        self.assertEqual(user.last_name, 'Doe')
        self.assertEqual(user.user_type, 'Employee')
        self.assertEqual(user.company_name, 'Test Company')
        self.assertTrue(user.check_password('testpass123'))
    
    def test_user_string_representation(self):
        """Test user string representation"""
        user = CustomUser.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123',
            first_name='John',
            last_name='Doe'
        )
        
        expected = 'testuser'
        self.assertEqual(str(user), expected)
    
    def test_user_default_values(self):
        """Test user creation with default values"""
        user = CustomUser.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)
        self.assertTrue(user.is_active)
        self.assertEqual(user.user_type, 'Employee')
        self.assertEqual(user.company_name, '')
    
    def test_user_choices_validation(self):
        """Test user choice field validation"""
        user = CustomUser.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123',
            user_type='Manager'
        )
        
        self.assertIn(user.user_type, ['Employee', 'Manager', 'Admin'])
    
    def test_user_email_validation(self):
        """Test user email validation"""
        # Test valid email
        user = CustomUser.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        
        self.assertEqual(user.email, 'test@example.com')
    
    def test_user_username_validation(self):
        """Test user username validation"""
        # Test valid username
        user = CustomUser.objects.create_user(
            username='testuser123',
            email='test@example.com',
            password='testpass123'
        )
        
        self.assertEqual(user.username, 'testuser123')
    
    def test_user_password_validation(self):
        """Test user password validation"""
        user = CustomUser.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        
        self.assertTrue(user.check_password('testpass123'))
        self.assertFalse(user.check_password('wrongpassword'))


class CustomUserManagerTestCase(TestCase):
    """Test cases for CustomUserManager"""
    
    def test_create_user(self):
        """Test create_user method"""
        user = CustomUser.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)
        self.assertTrue(user.is_active)
        self.assertEqual(user.username, 'testuser')
        self.assertEqual(user.email, 'test@example.com')
    
    def test_create_user_without_username(self):
        """Test create_user method without username"""
        with self.assertRaises(ValueError):
            CustomUser.objects.create_user(
                username='',
                email='test@example.com',
                password='testpass123'
            )
    
    def test_create_user_without_email(self):
        """Test create_user method without email"""
        with self.assertRaises(ValueError):
            CustomUser.objects.create_user(
                username='testuser',
                email='',
                password='testpass123'
            )
    
    def test_create_superuser(self):
        """Test create_superuser method"""
        user = CustomUser.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='adminpass123'
        )
        
        self.assertTrue(user.is_staff)
        self.assertTrue(user.is_superuser)
        self.assertTrue(user.is_active)
        self.assertEqual(user.username, 'admin')
        self.assertEqual(user.email, 'admin@example.com')
    
    def test_create_superuser_not_staff(self):
        """Test create_superuser method with is_staff=False"""
        with self.assertRaises(ValueError):
            CustomUser.objects.create_superuser(
                username='admin',
                email='admin@example.com',
                password='adminpass123',
                is_staff=False
            )
    
    def test_create_superuser_not_superuser(self):
        """Test create_superuser method with is_superuser=False"""
        with self.assertRaises(ValueError):
            CustomUser.objects.create_superuser(
                username='admin',
                email='admin@example.com',
                password='adminpass123',
                is_superuser=False
            )


class CustomUserValidationTestCase(TestCase):
    """Test cases for CustomUser validation"""
    
    def test_username_uniqueness(self):
        """Test username uniqueness constraint"""
        # Create first user
        CustomUser.objects.create_user(
            username='testuser',
            email='test1@example.com',
            password='testpass123'
        )
        
        # Try to create second user with same username
        with self.assertRaises(Exception):  # Should raise integrity error
            CustomUser.objects.create_user(
                username='testuser',
                email='test2@example.com',
                password='testpass123'
            )
    
    def test_email_uniqueness(self):
        """Test email uniqueness constraint"""
        # Create first user
        CustomUser.objects.create_user(
            username='testuser1',
            email='test@example.com',
            password='testpass123'
        )
        
        # Try to create second user with same email
        with self.assertRaises(Exception):  # Should raise integrity error
            CustomUser.objects.create_user(
                username='testuser2',
                email='test@example.com',
                password='testpass123'
            )
    
    def test_user_type_choices(self):
        """Test user type choice validation"""
        valid_types = ['Employee', 'Manager', 'Admin']
        
        for user_type in valid_types:
            user = CustomUser.objects.create_user(
                username=f'testuser_{user_type.lower()}',
                email=f'test_{user_type.lower()}@example.com',
                password='testpass123',
                user_type=user_type
            )
            
            self.assertEqual(user.user_type, user_type)
    
    def test_company_name_optional(self):
        """Test that company name is optional"""
        user = CustomUser.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        
        self.assertEqual(user.company_name, '')
        
        # Update company name
        user.company_name = 'Test Company'
        user.save()
        
        user.refresh_from_db()
        self.assertEqual(user.company_name, 'Test Company')


class CustomUserBusinessLogicTestCase(TestCase):
    """Test cases for CustomUser business logic"""
    
    def test_get_user_type_display(self):
        """Test get_user_type_display method"""
        user = CustomUser.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123',
            user_type='Employee'
        )
        
        self.assertEqual(user.get_user_type_display(), 'Employee')
    
    def test_user_permissions(self):
        """Test user permissions"""
        # Regular user
        user = CustomUser.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)
        
        # Staff user
        staff_user = CustomUser.objects.create_user(
            username='staffuser',
            email='staff@example.com',
            password='testpass123',
            user_type='Manager'
        )
        staff_user.is_staff = True
        staff_user.save()
        
        self.assertTrue(staff_user.is_staff)
        self.assertFalse(staff_user.is_superuser)
        
        # Superuser
        superuser = CustomUser.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='adminpass123'
        )
        
        self.assertTrue(superuser.is_staff)
        self.assertTrue(superuser.is_superuser)
    
    def test_company_association(self):
        """Test company association logic"""
        user = CustomUser.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123',
            company_name='Test Company'
        )
        
        self.assertEqual(user.company_name, 'Test Company')
        
        # Update company
        user.company_name = 'New Company'
        user.save()
        
        user.refresh_from_db()
        self.assertEqual(user.company_name, 'New Company')
    
    def test_authentication_flow(self):
        """Test user authentication flow"""
        # Create user
        user = CustomUser.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        
        # Test login
        self.assertTrue(user.check_password('testpass123'))
        
        # Test password change
        user.set_password('newpass123')
        user.save()
        
        self.assertTrue(user.check_password('newpass123'))
        self.assertFalse(user.check_password('testpass123'))
    
    def test_user_profile_completion(self):
        """Test user profile completion"""
        user = CustomUser.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        
        # Initially minimal profile
        self.assertEqual(user.first_name, '')
        self.assertEqual(user.last_name, '')
        self.assertEqual(user.company_name, '')
        
        # Complete profile
        user.first_name = 'John'
        user.last_name = 'Doe'
        user.company_name = 'Test Company'
        user.save()
        
        user.refresh_from_db()
        self.assertEqual(user.first_name, 'John')
        self.assertEqual(user.last_name, 'Doe')
        self.assertEqual(user.company_name, 'Test Company')
