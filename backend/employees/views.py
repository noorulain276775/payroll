from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Employee, PayrollRecord, SalaryDetails
from .serializers import EmployeeSerializer, ColleagueSerializer, PayrollRecordSerializer, EmployeeUpdateSerializer, SalaryDetailsSerializer, DashboardSerializer
from django.conf import settings
from .utils import generate_salary_pdf
from django.core.mail import EmailMessage
from django.db.models import Sum
from django.utils import timezone
from decimal import Decimal


"""
===================== Admin Views =====================
"""

"""
EMPLOYEES PERSONAL AND WORK INFORMATION
"""

# Admin can view all employees
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_all_employees(request):
    print(f"Authenticated User: {request.user}")
    if request.user.user_type != 'Admin':
        return Response({"detail": "Only admins can view all employees."}, status=status.HTTP_403_FORBIDDEN)
    
    employees = Employee.objects.all()
    serializer = EmployeeSerializer(employees, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


# Admin can create employee
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_employee(request):
    if request.user.user_type != 'Admin':
        return Response({"detail": "Only admins can create employees."}, status=status.HTTP_403_FORBIDDEN)
    serializer = EmployeeSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Admin can update employee details (including designation and department)
@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def update_employee(request, employee_id):
    if request.user.user_type != 'Admin':
        return Response({"detail": "Only admins can update employee details."}, status=status.HTTP_403_FORBIDDEN)
    try:
        employee = Employee.objects.get(id=employee_id)
        serializer = EmployeeUpdateSerializer(employee, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Employee.DoesNotExist:
        return Response({"detail": "Employee not found."}, status=status.HTTP_404_NOT_FOUND)
    
# Admin can get single employee details
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_view_single_employee(request, employee_id):
    if request.user.user_type != 'Admin':
        return Response({"detail": "Only admins can view employee details."}, status=status.HTTP_403_FORBIDDEN)

    try:
        employee = Employee.objects.get(id=employee_id)
        serializer = EmployeeUpdateSerializer(employee)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Employee.DoesNotExist:
        return Response({"detail": "Employee not found."}, status=status.HTTP_404_NOT_FOUND)
    
"""
SALARIES
"""
    
# Admin can create a new Salary Details record
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_salary_details(request):
    print(f"Authenticated User: {request.user}")
    if request.user.user_type != 'Admin':
        return Response({"detail": "Only admins can create salary details."}, status=status.HTTP_403_FORBIDDEN)
    serializer = SalaryDetailsSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# Admin can Edit a new Salary Details record
@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def update_salary_record(request, employee_id):
    """
    API to update the salary details of an employee.
    Only admins are allowed to perform this operation.
    """
    if request.user.user_type != 'Admin':
        return Response({"detail": "Only admins can update salary records."}, status=status.HTTP_403_FORBIDDEN)
    
    try:
        salary_details = SalaryDetails.objects.get(id=employee_id)
    except SalaryDetails.DoesNotExist:
        return Response({"detail": "Salary record not found."}, status=status.HTTP_404_NOT_FOUND)
    serializer = SalaryDetailsSerializer(salary_details, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Admin can view all employees salaries
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_all_employees_salaries(request):
    print(f"Authenticated User: {request.user}")
    if request.user.user_type != 'Admin':
        return Response({"detail": "Only admins can view all employees."}, status=status.HTTP_403_FORBIDDEN)
    
    employees = SalaryDetails.objects.all()
    serializer = SalaryDetailsSerializer(employees, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

# Admin can view all single employee salary record
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_view_single_employee_salary(request, employee_id):
    if request.user.user_type != 'Admin':
        return Response({"detail": "Only admins can view employee salary details."}, status=status.HTTP_403_FORBIDDEN)

    try:
        employee = Employee.objects.get(id=employee_id)
        salary = SalaryDetails.objects.get(employee=employee)
        serializer = SalaryDetailsSerializer(salary)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Employee.DoesNotExist:
        return Response({"detail": "Employee not found."}, status=status.HTTP_404_NOT_FOUND)


"""
PAYROLLS
"""

# Admin can Create a Payroll Record
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_payroll_record(request):
    """
    API to create a new payroll record.
    Only admins are allowed to perform this operation.
    """
    if request.user.user_type != 'Admin':
        return Response({"detail": "Only admins can create payroll records."}, status=status.HTTP_403_FORBIDDEN)

    # Extract employee, month, and year from the request data
    employee = request.data.get('employee')
    month = request.data.get('month')
    year = request.data.get('year')

    if not all([employee, month, year]):
        return Response({"detail": "Employee, month, and year are required fields."}, status=status.HTTP_400_BAD_REQUEST)

    # Check if a payroll record for this employee, month, and year already exists
    if PayrollRecord.objects.filter(employee_id=employee, month=month, year=year).exists():
        return Response(
            {"detail": f"The payroll for this employee for {month}/{year} already exists. Please consider editing it instead of creating a new one."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    serializer = PayrollRecordSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Admin can Edit a Payroll Record
@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def update_payroll_record(request, payroll_id):
    """
    API to update a payroll record.
    Only admins are allowed to perform this operation.
    """
    if request.user.user_type != 'Admin':
        return Response({"detail": "Only admins can update payroll records."}, status=status.HTTP_403_FORBIDDEN)

    try:
        payroll_record = PayrollRecord.objects.get(id=payroll_id)
    except PayrollRecord.DoesNotExist:
        return Response({"detail": "Payroll record not found."}, status=status.HTTP_404_NOT_FOUND)

    # Ensure no duplicate record exists for the same employee, month, and year (if these are being updated)
    employee = request.data.get('employee', payroll_record.employee.id)
    month = request.data.get('month', payroll_record.month)
    year = request.data.get('year', payroll_record.year)

    if PayrollRecord.objects.filter(employee_id=employee, month=month, year=year).exclude(id=payroll_id).exists():
        return Response(
            {"detail": f"A payroll for this employee for {month}/{year} already exists. Please consider updating that record instead."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    serializer = PayrollRecordSerializer(payroll_record, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



# Admin-only view to view all payroll records
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_all_payroll(request):
    if request.user.user_type != 'Admin':
        return Response({"detail": "Only admins can view all payroll records."}, status=status.HTTP_403_FORBIDDEN)
    payroll_records = PayrollRecord.objects.all().order_by('-year', '-month')
    serializer = PayrollRecordSerializer(payroll_records, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


# Helper Function to Send the Email
def send_salary_slip_email(employee, payroll_record):
    pdf_path = generate_salary_pdf(employee, payroll_record)
    subject = f"Salary Slip for {payroll_record.month}/{payroll_record.year}"
    message = f"Dear {employee.first_name},\n\nPlease find your salary slip for the month {payroll_record.month}/{payroll_record.year} attached."
    
    email = EmailMessage(
        subject=subject,
        body=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[employee.user.email]
    )

    with open(pdf_path, 'rb') as pdf_file:
        email.attach(f"salary_slip_{payroll_record.month}_{payroll_record.year}.pdf", pdf_file.read(), 'application/pdf')
    
    email.send(fail_silently=False)

# Admin-only view to send the salary slip email to the respective employee
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def send_salary_slip(request, payroll_id):
    if request.user.user_type != 'Admin':
        return Response({"detail": "Only admins can generate and send salary slips."}, status=status.HTTP_403_FORBIDDEN)
    
    try:
        payroll_record = PayrollRecord.objects.get(id=payroll_id)
    except PayrollRecord.DoesNotExist:
        return Response({"detail": "Payroll record not found."}, status=status.HTTP_404_NOT_FOUND)
    
    employee = payroll_record.employee
    send_salary_slip_email(employee, payroll_record)
    
    return Response({"detail": "Salary slip sent successfully."}, status=status.HTTP_200_OK)



"""
===================== FOR Dashboard =====================

"""


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_new_employees(request):
    print(f"Authenticated User: {request.user}")
    employees = Employee.objects.all().order_by('-created_at')[:3]
    serializer = EmployeeSerializer(employees, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_summary(request):
    if request.user.user_type != 'Admin':
        return Response({"detail": "Only admins can view the dashboard summary."}, status=status.HTTP_403_FORBIDDEN)
    
    # Get the current year and month
    today = timezone.now()
    current_month = today.month
    current_year = today.year
    previous_month = current_month - 1 if current_month > 1 else 12
    previous_month_year = current_year if current_month > 1 else current_year - 1

    # Get total salary for the current month
    total_salary_for_month = PayrollRecord.objects.filter(
        month=current_month, year=current_year
    ).aggregate(total_salary=Sum('total_salary_for_month'))['total_salary'] or Decimal(0)

    # Get total overtime for the current month
    total_overtime_for_month = PayrollRecord.objects.filter(
        month=current_month, year=current_year
    ).aggregate(total_overtime=Sum('overtime_days'))['total_overtime'] or Decimal(0)

    # Get previous month's total salary
    previous_month_salary = PayrollRecord.objects.filter(
        month=previous_month, year=previous_month_year
    ).aggregate(total_salary=Sum('total_salary_for_month'))['total_salary'] or Decimal(0)

    # Get previous month's total overtime
    previous_month_overtime = PayrollRecord.objects.filter(
        month=previous_month, year=previous_month_year
    ).aggregate(total_overtime=Sum('overtime_days'))['total_overtime'] or Decimal(0)

    # Gather monthly totals for all months available in the PayrollRecord database
    monthly_data = PayrollRecord.objects.values('year', 'month').annotate(
        total_salary=Sum('total_salary_for_month'),
        total_overtime=Sum('overtime_days')
    ).order_by('-year', '-month')

    # Prepare monthly data in a list of dicts format for serialization
    monthly_data_list = [
        {
            'month': data['month'],
            'year': data['year'],
            'total_salary': data['total_salary'] or Decimal(0),
            'total_overtime': data['total_overtime'] or Decimal(0),
        }
        for data in monthly_data
    ]

    # Get the total number of employees
    total_employees = Employee.objects.count()

    # Calculate the total salary of all employees for the current month
    total_salary_current_month = PayrollRecord.objects.filter(
        month=current_month, year=current_year
    ).aggregate(total_salary=Sum('total_salary_for_month'))['total_salary'] or Decimal(0)

    # Calculate the average salary for the current month
    average_salary_for_month = total_salary_current_month / total_employees if total_employees > 0 else Decimal(0)

    # Return the aggregated data
    return Response({
        'total_salary_for_month': total_salary_for_month,
        'total_overtime_for_month': total_overtime_for_month,
        'previous_month_salary': previous_month_salary,
        'previous_month_overtime': previous_month_overtime,
        'monthly_data': monthly_data_list,
        'total_employees': total_employees,
        'average_salary_for_month': average_salary_for_month,
    }, status=status.HTTP_200_OK)

"""
===================== Employee Views =====================

"""

# Employee can view their own details
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_employee(request):
    try:
        employee_details = Employee.objects.get(user=request.user)
        serializer = EmployeeSerializer(employee_details)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Employee.DoesNotExist:
        return Response({"detail": "Employee details not found."}, status=status.HTTP_404_NOT_FOUND)


# Employee can update their own details (excluding designation and department)
@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def update_own_details(request):
    try:
        employee = Employee.objects.get(user=request.user)
        serializer = EmployeeUpdateSerializer(employee, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Employee.DoesNotExist:
        return Response({"detail": "Employee details not found."}, status=status.HTTP_404_NOT_FOUND)


# Employee can view colleagues details (excluding themselves)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_colleagues(request):
    colleagues = Employee.objects.exclude(user=request.user)
    serializer = ColleagueSerializer(colleagues, many=True)
    return Response(serializer.data)



# Employee-only view to view their own payroll records
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_own_payroll(request):
    try:
        employee_details = Employee.objects.get(user=request.user)
        payroll_records = PayrollRecord.objects.filter(employee=employee_details)
        serializer = PayrollRecordSerializer(payroll_records, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Employee.DoesNotExist:
        return Response({"detail": "Employee details not found."}, status=status.HTTP_404_NOT_FOUND)
