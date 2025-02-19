from celery import shared_task
from django.utils import timezone
from .models import LeaveAccrual, LeaveBalance

@shared_task
def accrue_monthly_leave():
    """Runs on the 1st of every month to update leave balances."""
    today = timezone.now().date()
    
    for leave_accrual in LeaveAccrual.objects.all():
        if today.month > leave_accrual.last_accrued_date.month or today.year > leave_accrual.last_accrued_date.year:
            leave_accrual.leave_balance += 2.5
            leave_accrual.save()

            try:
                # Update LeaveBalance, or create it if it doesn't exist
                leave_balance = LeaveBalance.objects.get(employee=leave_accrual.employee)
                leave_balance.annual_leave_balance += 2.5
                leave_balance.save()
            except LeaveBalance.DoesNotExist:
                # Create a new LeaveBalance record if not found
                LeaveBalance.objects.create(employee=leave_accrual.employee, annual_leave_balance=2.5)