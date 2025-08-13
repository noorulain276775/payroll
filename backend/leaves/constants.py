"""
Constants for the leaves application
"""

# Leave accrual constants
MONTHLY_LEAVE_ACCRUAL_DAYS = 2.5

# Leave type choices
LEAVE_TYPE_CHOICES = [
    ('Annual', 'Annual'),
    ('Sick', 'Sick'),
    ('Unpaid', 'Unpaid'),
    ('Maternity', 'Maternity'),
    ('Paternity', 'Paternity'),
    ('Compassionate', 'Compassionate'),
    ('Personal Leave', 'Personal Leave'),
    ('Emergency Leave', 'Emergency Leave'),
    ('Other', 'Other'),
]

# Leave status choices
LEAVE_STATUS_CHOICES = [
    ('Pending', 'Pending'),
    ('Approved', 'Approved'),
    ('Rejected', 'Rejected'),
]

# Leave type to balance field mapping
LEAVE_TYPE_TO_BALANCE_FIELD = {
    'Annual': 'annual_leave_balance',
    'Sick': 'sick_leave_balance',
    'Unpaid': 'unpaid_leave_balance',
    'Maternity': 'maternity_leave_balance',
    'Paternity': 'paternity_leave_balance',
    'Compassionate': 'compassionate_leave_balance',
    'Personal Leave': 'personal_leave_balance',
    'Emergency Leave': 'emergency_leave_balance',
    'Other': 'other_leave_balance',
}

# Default remarks
DEFAULT_PENDING_REMARKS = "Awaiting approval"
DEFAULT_APPROVED_REMARKS = "Auto-approved by staff"
DEFAULT_REJECTED_REMARKS = "System rejection"
DEFAULT_UNAPPROVED_REMARKS = "Awaiting approval"
