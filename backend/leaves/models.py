from django.db import models
from employees.models import Employee
from django.utils import timezone


class Leave(models.Model):
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

    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
    ]

    employee = models.ForeignKey('employees.Employee', on_delete=models.CASCADE)
    leave_type = models.CharField(max_length=50, choices=LEAVE_TYPE_CHOICES)
    start_date = models.DateField()
    end_date = models.DateField()
    days_taken = models.DecimalField(max_digits=5, decimal_places=2)
    reason = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    applied_on = models.DateTimeField(auto_now_add=True)
    approved_on = models.DateTimeField(null=True, blank=True)
    approved_by = models.ForeignKey('users.CustomUser', on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_leaves')
    remarks = models.TextField(default="Awaiting approval", blank=True)


    def save(self, *args, **kwargs):

        requested_by = kwargs.pop('requested_by', None)
        is_new = self.pk is None

        if is_new:
            self.days_taken = (self.end_date - self.start_date).days + 1

            leave_type_to_field = {
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

            balance_field = leave_type_to_field.get(self.leave_type)

            if not balance_field:
                self.status = 'Rejected'
                self.approved_by = None
                self.approved_on = timezone.now()
                self.remarks = "Don't have enough leave balance for this type"
            else:
                try:
                    leave_balance = LeaveBalance.objects.get(employee=self.employee)
                    current_balance = getattr(leave_balance, balance_field, 0)

                    if self.leave_type == 'Unpaid':
                        # Prevent self-approval - staff cannot approve their own leaves
                        if requested_by and requested_by.is_staff and requested_by != self.employee.user:
                            self.status = 'Approved'
                            self.approved_by = requested_by
                            self.approved_on = timezone.now()
                            self.remarks = "Auto-approved by staff for unpaid leave"
                        else:
                            self.status = 'Pending'
                            self.remarks = "Awaiting approval"

                    elif current_balance >= self.days_taken:
                        if requested_by and requested_by.is_staff:
                            setattr(leave_balance, balance_field, current_balance - self.days_taken)
                            leave_balance.save()
                            self.status = 'Approved'
                            self.approved_by = requested_by
                            self.approved_on = timezone.now()
                            self.remarks = "Auto-approved by staff"
                        else:
                            self.status = 'Pending'
                            self.remarks = "Awaiting approval"
                    else:
                        self.status = 'Rejected'
                        self.approved_by = requested_by if requested_by and requested_by.is_staff else None
                        self.approved_on = timezone.now()
                        self.remarks = "Not enough leave balance"
                except LeaveBalance.DoesNotExist:
                    self.status = 'Rejected'
                    self.approved_by = requested_by if requested_by and requested_by.is_staff else None
                    self.approved_on = timezone.now()
                    self.remarks = "Leave balance not found"

        super().save(*args, **kwargs)

    def approve_leave(self, approver):
        leave_type_to_field = {
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

        balance_field = leave_type_to_field.get(self.leave_type)

        try:
            leave_balance = LeaveBalance.objects.get(employee=self.employee)
            current_balance = getattr(leave_balance, balance_field, 0)

            if self.leave_type == 'Unpaid' or current_balance >= self.days_taken:
                if self.leave_type != 'Unpaid':
                    setattr(leave_balance, balance_field, current_balance - self.days_taken)
                    leave_balance.save()

                self.status = 'Approved'
                self.approved_on = timezone.now()
                self.approved_by = approver
                self.save()
            else:
                self.reject_leave(approver)

        except LeaveBalance.DoesNotExist:
            self.reject_leave(approver)

    def reject_leave(self, approver=None):
        self.status = 'Rejected'
        self.approved_on = timezone.now()
        self.approved_by = approver
        self.save()

    def get_approver_name(self):
        return f"{self.approved_by.first_name} {self.approved_by.last_name}" if self.approved_by else "System"

    def __str__(self):
        return f"{self.employee.first_name} {self.employee.last_name} - Leave: {self.leave_type} ({self.start_date} to {self.end_date})"


class LeaveBalance(models.Model):
    employee = models.OneToOneField(Employee, on_delete=models.CASCADE)
    annual_leave_balance = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    sick_leave_balance = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    maternity_leave_balance = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    paternity_leave_balance = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    compassionate_leave_balance = models.DecimalField(max_digits=5, decimal_places=2, default=5.0)
    personal_leave_balance = models.DecimalField(max_digits=5, decimal_places=2, default=5.0)
    emergency_leave_balance = models.DecimalField(max_digits=5, decimal_places=2, default=5.0)
    unpaid_leave_balance = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    other_leave_balance = models.DecimalField(max_digits=5, decimal_places=2, default=5.0)

    def __str__(self):
        return f"{self.employee.first_name} {self.employee.last_name} - Leave Balance"

class LeaveAccrual(models.Model):
    employee = models.OneToOneField(Employee, on_delete=models.CASCADE)
    leave_balance = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    last_accrued_date = models.DateField(auto_now=True)

    def accrue_leave(self):
        current_date = timezone.now().date()
        
        if current_date.month > self.last_accrued_date.month or current_date.year > self.last_accrued_date.year:
            self.leave_balance += 2.5
            self.last_accrued_date = current_date
            self.save()
            leave_balance = LeaveBalance.objects.get(employee=self.employee)
            leave_balance.annual_leave_balance = self.leave_balance
            leave_balance.save()

    def __str__(self):
        return f"{self.employee.first_name} {self.employee.last_name} - Leave Accrual"
