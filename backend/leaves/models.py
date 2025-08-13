from django.db import models
from employees.models import Employee
from django.utils import timezone
from .constants import LEAVE_TYPE_CHOICES, LEAVE_STATUS_CHOICES


class Leave(models.Model):

    employee = models.ForeignKey('employees.Employee', on_delete=models.CASCADE)
    leave_type = models.CharField(max_length=50, choices=LEAVE_TYPE_CHOICES)
    start_date = models.DateField()
    end_date = models.DateField()
    days_taken = models.DecimalField(max_digits=5, decimal_places=2)
    reason = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=LEAVE_STATUS_CHOICES, default='Pending')
    applied_on = models.DateTimeField(auto_now_add=True)
    approved_on = models.DateTimeField(null=True, blank=True)
    approved_by = models.ForeignKey('users.CustomUser', on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_leaves')
    remarks = models.TextField(default="Awaiting approval", blank=True)


    def save(self, *args, **kwargs):
        """Save method with business logic moved to service layer"""
        requested_by = kwargs.pop('requested_by', None)
        is_new = self.pk is None

        if is_new:
            # Calculate days taken
            self.days_taken = (self.end_date - self.start_date).days + 1
            
            # Process leave approval using service
            from .services import LeaveService
            LeaveService.process_leave_approval(self, requested_by)

        super().save(*args, **kwargs)

    def approve_leave(self, approver):
        """Approve leave using service layer"""
        from .services import LeaveService
        return LeaveService.approve_leave(self, approver)

    def reject_leave(self, approver=None):
        """Reject leave using service layer"""
        from .services import LeaveService
        return LeaveService.reject_leave(self, approver)

    def get_approver_name(self):
        """Get approver's full name"""
        if self.approved_by:
            return f"{self.approved_by.first_name} {self.approved_by.last_name}"
        return "System"

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
        """Accrue leave using service layer"""
        from .services import LeaveAccrualService
        current_date = timezone.now().date()
        return LeaveAccrualService.accrue_monthly_leave_for_employee(self, current_date)

    def __str__(self):
        return f"{self.employee.first_name} {self.employee.last_name} - Leave Accrual"
