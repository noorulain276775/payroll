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
                leave_balance = LeaveBalance.objects.get(employee=leave_accrual.employee)
                leave_balance.annual_leave_balance += 2.5
                leave_balance.save()
            except LeaveBalance.DoesNotExist:
                LeaveBalance.objects.create(employee=leave_accrual.employee, annual_leave_balance=2.5)


# from celery import shared_task
# from django.utils import timezone
# from .models import LeaveAccrual, LeaveBalance
# from django.db import transaction
# from decimal import Decimal

# @shared_task
# def accrue_monthly_leave():
#     """Runs on the 1st of every month to update leave balances."""
#     today = timezone.now().date()
    
#     for leave_accrual in LeaveAccrual.objects.all():
#         # Always add leave balance for manual execution
#         leave_accrual.leave_balance += Decimal('2.5')
#         leave_accrual.save()

#         try:
#             leave_balance = LeaveBalance.objects.get(employee=leave_accrual.employee)
#             print(f"Before update: {leave_balance.annual_leave_balance}")
#             leave_balance.annual_leave_balance += Decimal('2.5')
#             leave_balance.save()
#             # Ensure that the database commit happens
#             transaction.commit()
#             print(f"After update: {leave_balance.annual_leave_balance}")

#         except LeaveBalance.DoesNotExist:
#             # Create a new LeaveBalance if it doesn't exist
#             LeaveBalance.objects.create(employee=leave_accrual.employee, annual_leave_balance=2.5)


