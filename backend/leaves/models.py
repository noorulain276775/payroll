from django.db import models
from employees.models import Employee
from django.utils import timezone

class Leave(models.Model):
    LEAVE_TYPE_CHOICES = [
        ('Annual', 'Annual'),
        ('Sick', 'Sick'),
        ('Other', 'Other'),
    ]
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    leave_type = models.CharField(max_length=50, choices=LEAVE_TYPE_CHOICES)
    start_date = models.DateField()
    end_date = models.DateField()
    days_taken = models.DecimalField(max_digits=5, decimal_places=2)
    reason = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=[('Pending', 'Pending'), ('Approved', 'Approved'), ('Rejected', 'Rejected')])
    applied_on = models.DateTimeField(auto_now_add=True)
    approved_on = models.DateTimeField(null=True, blank=True)

    def save(self, *args, **kwargs):
        # Calculate days taken for leave (consider weekends/public holidays if needed)
        self.days_taken = (self.end_date - self.start_date).days + 1

        # Retrieve the leave balance from the LeaveBalance model
        leave_balance = LeaveBalance.objects.get(employee=self.employee)

        if leave_balance.annual_leave_balance >= self.days_taken:
            # Deduct the leave days from the balance
            leave_balance.annual_leave_balance -= self.days_taken
            leave_balance.save()

            self.status = 'Approved'
        else:
            self.status = 'Rejected'

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.employee.first_name} {self.employee.last_name} - Leave from {self.start_date} to {self.end_date}"

class LeaveBalance(models.Model):
    employee = models.OneToOneField(Employee, on_delete=models.CASCADE)
    annual_leave_balance = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)

    def __str__(self):
        return f"{self.employee.first_name} {self.employee.last_name} - Leave Balance"

class LeaveAccrual(models.Model):
    employee = models.OneToOneField(Employee, on_delete=models.CASCADE)
    leave_balance = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    last_accrued_date = models.DateField(auto_now=True)

    def accrue_leave(self):
        # Check if a new month has started since the last accrual date
        current_date = timezone.now().date()
        
        if current_date.month > self.last_accrued_date.month or current_date.year > self.last_accrued_date.year:
            # Add 2.5 days to leave balance for the new month
            self.leave_balance += 2.5
            self.last_accrued_date = current_date
            self.save()

            # Update the LeaveBalance table as well
            leave_balance = LeaveBalance.objects.get(employee=self.employee)
            leave_balance.annual_leave_balance = self.leave_balance
            leave_balance.save()

    def __str__(self):
        return f"{self.employee.first_name} {self.employee.last_name} - Leave Accrual"
