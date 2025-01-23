from django.urls import path
from .views import view_employee, update_employee, create_payroll, view_all_payroll, view_own_payroll, send_salary_slip, update_own_details, create_employee, view_all_employees, view_all_employees_salaries, create_salary_details, update_salary_record

urlpatterns = [
    # For Admin ------------- employee endpoints
    path('create_employee/', create_employee, name='create_employee'),
    path('view_all_employees/', view_all_employees, name='view_all_employees'),
    path('employee/<int:employee_id>/', update_employee, name='admin_update_employee'),
    # For Admin ------------- salaries endpoints
    path('salaries/', view_all_employees_salaries, name='view_all_employee_salaries'),
    path('create-salary-details/', create_salary_details, name='create-salary-details'),
    path('update-salary-details/<int:employee_id>/', update_salary_record, name='update_salary_record'),
    # For Admin -------------  Payroll endpoints
    path('create_payroll/', create_payroll, name='create_payroll'),
    path('view_all_payroll/', view_all_payroll, name='view_all_payroll'),
    path('send_salary_slip/<int:payroll_id>/', send_salary_slip, name='send_salary_slip'),

    # For Employee ------------- Employee endpoints
    path('employee/profile/', view_employee, name='view_employee'), 
    path('employee/update/', update_own_details, name='update_own_details'),  # Update own details
    path('employee/payroll/', view_own_payroll, name='view_own_payroll'),  # View own payroll
    #path('employee/colleagues/', ColleaguesView.as_view(), name='colleagues'),  # View colleagues' list
]
