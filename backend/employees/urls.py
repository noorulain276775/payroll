from django.urls import path
# from .views import create_employee, view_all_employees, view_employee, update_employee, ColleaguesView, create_payroll, view_all_payroll, view_own_payroll, send_salary_slip, update_own_details, view_colleagues
from .views import view_employee, update_employee, create_payroll, view_all_payroll, view_own_payroll, send_salary_slip, update_own_details, create_employee, view_all_employees

urlpatterns = [
    # Admin-only endpoints
    path('create_employee/', create_employee, name='create_employee'),
    path('view_all_employees/', view_all_employees, name='view_all_employees'),
    path('create_payroll/', create_payroll, name='create_payroll'),
    path('view_all_payroll/', view_all_payroll, name='view_all_payroll'),
    path('send_salary_slip/<int:payroll_id>/', send_salary_slip, name='send_salary_slip'),
    path('employee/<int:employee_id>/', update_employee, name='admin_update_employee'),

    # Employee endpoints
    path('employee/profile/', view_employee, name='view_employee'),  # View own profile
    path('employee/update/', update_own_details, name='update_own_details'),  # Update own details
    path('employee/payroll/', view_own_payroll, name='view_own_payroll'),  # View own payroll
    #path('employee/colleagues/', ColleaguesView.as_view(), name='colleagues'),  # View colleagues' list
]
