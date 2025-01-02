from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Employee, PayrollRecord
from .serializers import EmployeeSerializer, ColleagueSerializer, PayrollRecordSerializer, EmployeeUpdateSerializer
from django.conf import settings
from .utils import generate_salary_pdf
from django.core.mail import EmailMessage



"""
===================== Admin Views =====================
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


# Admin-only view to create payroll record
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_payroll(request):
    if request.user.user_type != 'Admin':
        return Response({"detail": "Only admins can create payroll."}, status=status.HTTP_403_FORBIDDEN)

    employee_id = request.data.get('employee')
    try:
        employee = Employee.objects.get(id=employee_id)
    except Employee.DoesNotExist:
        return Response({"detail": "Employee not found."}, status=status.HTTP_404_NOT_FOUND)
    
    data = {
        'employee': employee.id,
        'month': request.data.get('month'),
        'year': request.data.get('year'),
        'total_salary_for_month': request.data.get('total_salary_for_month'),
        'overtime_days': request.data.get('overtime_days', 0),
        'unpaid_days': request.data.get('unpaid_days', 0),
        'other_deductions': request.data.get('other_deductions', 0),
        'remarks': request.data.get('remarks', ''),
    }
    
    serializer = PayrollRecordSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Admin-only view to view all payroll records
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_all_payroll(request):
    if request.user.user_type != 'Admin':
        return Response({"detail": "Only admins can view all payroll records."}, status=status.HTTP_403_FORBIDDEN)

    payroll_records = PayrollRecord.objects.all()
    serializer = PayrollRecordSerializer(payroll_records, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

# Admin sending payroll t employees email address
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
@api_view(['POST'])
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
===================== Employee Views =====================

"""

# Employee can view their own details
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_employee(request):
    if request.user.user_type == 'Admin':
        return Response({"detail": "Admins cannot view this page."}, status=status.HTTP_403_FORBIDDEN)
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
    if request.user.user_type != 'Employee':
        return Response({"detail": "Only employees can update their details."}, status=status.HTTP_403_FORBIDDEN)
    try:
        employee = Employee.objects.get(user=request.user)
        # Serializer to update employee details, excluding designation and department
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
    if request.user.user_type == 'Employee':
        colleagues = Employee.objects.exclude(user=request.user)  # Exclude the logged-in user
        serializer = ColleagueSerializer(colleagues, many=True)
        return Response(serializer.data)
    return Response({"detail": "Only employees can view colleagues."}, status=status.HTTP_403_FORBIDDEN)


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
