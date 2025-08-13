from celery import shared_task
from django.utils import timezone
from .models import LeaveAccrual
from .services import LeaveAccrualService

@shared_task
def accrue_monthly_leave():
    """Runs on the 1st of every month to update leave balances."""
    today = timezone.now().date()
    
    # Only run on the 1st of the month
    if today.day != 1:
        return
    
    for leave_accrual in LeaveAccrual.objects.all():
        # Check if we need to accrue leave for this month
        if LeaveAccrualService.should_accrue_leave(leave_accrual.last_accrued_date, today):
            LeaveAccrualService.accrue_monthly_leave_for_employee(leave_accrual, today)


