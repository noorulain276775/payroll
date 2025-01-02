from django.contrib import admin
from .models import Employee, PayrollRecord, SalaryDetails

admin.site.register(Employee)

@admin.register(PayrollRecord)
class PayrollRecordAdmin(admin.ModelAdmin):
    list_display = ('employee', 'month', 'year', 'total_salary_for_month', 'overtime_days', 'unpaid_days', 'other_deductions')
    readonly_fields = ('total_salary_for_month',)

@admin.register(SalaryDetails)
class SalaryDetailAdmin(admin.ModelAdmin):
    list_display = ('employee', 'basic_salary', 'housing_allowance', 'transport_allowance', 'other_allowance', 'gross_salary', 'bank_name', 'account_no', 'iban', 'swift_code')
    readonly_fields = ('gross_salary',)