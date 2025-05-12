from django.core.management.base import BaseCommand
from django.utils import timezone
from leave.models import LeaveBalance, LeaveAccrual
from employees.models import Employee

class Command(BaseCommand):
    help = 'Add 2.5 leave days to each employee on the 1st of every month.'

    def handle(self, *args, **kwargs):
        today = timezone.now().date()

        if today.day == 1:
            for employee in Employee.objects.all():
                accrual, _ = LeaveAccrual.objects.get_or_create(employee=employee)
                accrual.accrue_leave()  # <-- Use the method
            self.stdout.write(self.style.SUCCESS("Leave accrued for all employees."))
        else:
            self.stdout.write("Today is not the 1st of the month. No action taken.")

