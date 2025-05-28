from datetime import date
from django.db.models.signals import post_save
from django.dispatch import receiver
from employees.models import Employee
from .models import LeaveBalance, LeaveAccrual
from dateutil.relativedelta import relativedelta

@receiver(post_save, sender=Employee)
def create_leave_records(sender, instance, created, **kwargs):
    if created:
        print(f"New employee created: {instance.first_name} {instance.last_name}, Complete Instance: {instance.joining_date}")
        date_of_joining = instance.joining_date
        today = date.today()

        months_worked = (today.year - date_of_joining.year) * 12 + (today.month - date_of_joining.month)

        if months_worked < 0:
            months_worked = 0

        annual_leave = round(2.5 * months_worked, 2)       # 30 days / year
        sick_leave = round(14 / 12 * months_worked, 2)     # 14 days / year
        LeaveBalance.objects.create(
            employee=instance,
            annual_leave_balance=annual_leave,
            sick_leave_balance=sick_leave,
            maternity_leave_balance=0.0,
            paternity_leave_balance=0.0,
            compassionate_leave_balance=5.0,
            personal_leave_balance=5.0,
            emergency_leave_balance=5.0,
            unpaid_leave_balance=0.0,
            other_leave_balance=5.0
        )
        LeaveAccrual.objects.create(employee=instance)


