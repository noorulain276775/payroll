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
        self.days_taken = (self.end_date - self.start_date).days + 1
        leave_balance = LeaveBalance.objects.get(employee=self.employee)

        # Map leave type to balance field name
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
        else:
            current_balance = getattr(leave_balance, balance_field)

            if self.leave_type == 'Unpaid' or current_balance >= self.days_taken:
                self.status = 'Pending'
            else:
                self.status = 'Rejected'

        super().save(*args, **kwargs)

    def approve_leave(self):
        leave_balance = LeaveBalance.objects.get(employee=self.employee)

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

        if balance_field:
            current_balance = getattr(leave_balance, balance_field)

            if self.leave_type == 'Unpaid' or current_balance >= self.days_taken:
                if self.leave_type != 'Unpaid':
                    setattr(leave_balance, balance_field, current_balance - self.days_taken)
                    leave_balance.save()
                self.status = 'Approved'
                self.approved_on = timezone.now()
                self.save()
                return

        self.status = 'Rejected'
        self.save()


    def reject_leave(self):
        self.status = 'Rejected'
        self.approved_on = timezone.now()
        self.save()

    def __str__(self):
        return f"{self.employee.first_name} {self.employee.last_name} - Leave from {self.start_date} to {self.end_date}"

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
