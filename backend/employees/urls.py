from django.urls import path
from .views import view_employee, update_employee, create_payroll_record, view_all_payroll, view_own_payroll, send_salary_slip, update_own_details, create_employee, view_all_employees, view_all_employees_salaries, create_salary_details, update_salary_record, admin_view_single_employee_salary, update_payroll_record, view_new_employees, dashboard_summary, view_own_salary_details, download_payroll_pdf, create_salary_revision, get_salary_revisions, edit_salary_revision, get_all_salary_revisions

urlpatterns = [
    # For Admin ------------- employee endpoints
    path('create_employee/', create_employee, name='create_employee'),
    path('view_all_employees/', view_all_employees, name='view_all_employees'),
    path('employee/<int:employee_id>/', update_employee, name='admin_update_employee'),
    # For Admin ------------- salaries endpoints
    path('salaries/', view_all_employees_salaries, name='view_all_employee_salaries'),
    path('create-salary-details/', create_salary_details, name='create-salary-details'),
    path('update-salary-details/<int:employee_id>/', update_salary_record, name='update_salary_record'),
    path('salary-details/<int:employee_id>/', admin_view_single_employee_salary, name='admin_single_employee_salary_view'),
    # For Admin -------------  Payroll endpoints
    path('create_payroll/', create_payroll_record, name='create_payroll'),
    path('view_all_payroll/', view_all_payroll, name='view_all_payroll'),
    path('update-payroll-record/<int:payroll_id>/', update_payroll_record, name='update_payroll_record'),
    path('send_salary_slip/<int:payroll_id>/', send_salary_slip, name='send_salary_slip_to_employeees'),
    # For Admin  -------------- Dashbaord endpoints
    path('dashboard-summary/', dashboard_summary, name="dashboard-summary" ),
    # For Admin  -------------- Employee Salary Revision Endpoints
    path('create-salary-revision/<int:employee_id>/', create_salary_revision, name='create_salary_revision'),
    path('get-salary-revisions/<int:employee_id>/', get_salary_revisions, name='get_salary_revisions'),
    path('salary-revision/edit/<int:revision_id>/', edit_salary_revision, name='edit_salary_revision'),
    path('salary-revision/', get_all_salary_revisions, name='get_all_salary_revisions'),
    # (All authenticated Users) -------------- Dashbaord endpoints
    path('new_employees/', view_new_employees, name="view_new_employee" ),
    # For Employee ------------- Employee endpoints
    path('employee/profile/', view_employee, name='view_employee'), 
    path('employee/update/', update_own_details, name='update_own_details'),
    path('employee/salary-details/', view_own_salary_details, name='view_own_salary_details'),
    path('employee/payroll/', view_own_payroll, name='view_own_payroll'),
    path('employee/payroll/download/<int:payroll_id>/', download_payroll_pdf, name='download-payroll-pdf'),
    #path('employee/colleagues/', ColleaguesView.as_view(), name='colleagues'),  # View colleagues' list
]
