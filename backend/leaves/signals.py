from django.db.models.signals import post_save
from django.dispatch import receiver
from employees.models import Employee
from .models import LeaveBalance, LeaveAccrual

@receiver(post_save, sender=Employee)
def create_leave_records(sender, instance, created, **kwargs):
    """Create LeaveBalance and LeaveAccrual when a new employee is created."""
    if created:
        LeaveBalance.objects.create(employee=instance) 
        LeaveAccrual.objects.create(employee=instance)

