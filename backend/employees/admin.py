from django.contrib import admin
from .models import Employee, PayrollRecord, SalaryDetails

admin.site.register(Employee)
admin.site.register(PayrollRecord)
admin.site.register(SalaryDetails)