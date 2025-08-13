from django.core.management.base import BaseCommand
from leaves.tasks import accrue_monthly_leave

class Command(BaseCommand):
    help = 'Test the Celery leave accrual task'

    def handle(self, *args, **kwargs):
        self.stdout.write('Testing Celery task...')
        
        try:
            result = accrue_monthly_leave.delay()
            self.stdout.write(
                self.style.SUCCESS(f'Task queued successfully! Task ID: {result.id}')
            )
            self.stdout.write(f'Task Status: {result.status}')
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error testing task: {str(e)}')
            )
