from django.urls import path
from . import views

urlpatterns = [
    # Endpoint to create a new employee (Admin only)
    path('create_employee/', views.create_employee, name='create_employee'),

    # Endpoint to view all employees (Admin only)
    path('view_all_employees/', views.view_all_employees, name='view_all_employees'),

    # Endpoint for an employee to view their own profile
    path('view_employee/', views.view_employee, name='view_employee'),

    # Endpoint for an employee to update their own details
    path('update_employee/', views.update_employee, name='update_employee'),

    # Endpoint to view a list of colleagues (Employee view only)
    path('colleagues/', views.ColleaguesView.as_view(), name='colleagues'),

    # Endpoint to create a payroll record (Admin only)
    path('create_payroll/', views.create_payroll, name='create_payroll'),

    # Endpoint to view all payroll records (Admin only)
    path('view_all_payroll/', views.view_all_payroll, name='view_all_payroll'),

    # Endpoint for an employee to view their own payroll records
    path('view_own_payroll/', views.view_own_payroll, name='view_own_payroll'),

    # Endpoint for an admin to send a salary slip via email (with PDF attached)
    path('send_salary_slip/<int:payroll_id>/', views.send_salary_slip, name='send_salary_slip'),

    # Admin can view and update specific employee details by ID
    path('employee/<int:employee_id>/', views.update_employee, name='update_employee'),  # Admin update

    # Employee can update their own basic details (name, DOB, marital status, etc.)
    path('employee/update/', views.update_own_details, name='update_own_details'),  # Employee update

    # Endpoint for an employee to view their own profile (can be extended for more detailed employee info)
    path('employee/', views.view_employee, name='view_employee'),

    # Endpoint for an employee to view their colleagues' basic details (not the full profile)
    path('colleagues/', views.view_colleagues, name='view_colleagues'),
]
