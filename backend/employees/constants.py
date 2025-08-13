"""
Constants for the employees application
"""

# File validation constants
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB in bytes
VALID_FILE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.pdf']
VALID_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']

# Department choices
DEPARTMENT_CHOICES = [
    ('Accounts', 'Accounts'),
    ('Operations', 'Operations'),
    ('IT', 'IT'),
]

# Gender choices
GENDER_CHOICES = [
    ('Male', 'Male'),
    ('Female', 'Female'),
]

# Marital status choices
MARITAL_CHOICES = [
    ('Married', 'Married'),
    ('Unmarried', 'Unmarried'),
]

# Default values
DEFAULT_CHILDREN_COUNT = 0
DEFAULT_LEAVE_BALANCES = {
    'compassionate_leave_balance': 5.0,
    'personal_leave_balance': 5.0,
    'emergency_leave_balance': 5.0,
    'other_leave_balance': 5.0,
}
