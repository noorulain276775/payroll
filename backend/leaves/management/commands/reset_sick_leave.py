# leave/management/commands/reset_sick_leave.py
from django.core.management.base import BaseCommand
from employees.models import Employee
from leaves.models import LeaveBalance

class Command(BaseCommand):
    help = 'Reset sick leave to 14 days on 1st January.'

    def handle(self, *args, **kwargs):
        for employee in Employee.objects.all():
            leave_balance, _ = LeaveBalance.objects.get_or_create(employee=employee)
            leave_balance.sick_leave_balance = 14
            leave_balance.save()
        self.stdout.write(self.style.SUCCESS("Sick leave reset to 14 for all employees."))
