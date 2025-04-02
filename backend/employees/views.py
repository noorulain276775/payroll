from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Employee, PayrollRecord, SalaryDetails, SalaryRevision
from .serializers import EmployeeSerializer, ColleagueSerializer, PayrollRecordSerializer, EmployeeUpdateSerializer, SalaryDetailsSerializer, DashboardSerializer, SalaryRevisionSerializer, EmployeeDetailsWithSalarySerializer, SalaryRevisionSerializerCreate
from django.conf import settings
from .utils import generate_salary_pdf
from django.core.mail import EmailMessage
from django.db.models import Sum
from django.utils import timezone
from decimal import Decimal
from django.shortcuts import get_object_or_404
import io
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from django.http import FileResponse
from reportlab.lib.utils import ImageReader
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
from reportlab.lib import colors
from django.db.models import Max
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle


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

# Admin can view all employees with salary details
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_all_employees_with_salary(request):
    print(f"Authenticated User: {request.user}")
    if request.user.user_type != 'Admin':
        return Response({"detail": "Only admins can view all employees."}, status=status.HTTP_403_FORBIDDEN)
    
    employees = Employee.objects.all()
    serializer = EmployeeDetailsWithSalarySerializer(employees, many=True)
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
        print(request.data)
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
        salary_instance = serializer.save()
        salary_instance.updated_at = timezone.now()  # Set updated_at separately
        salary_instance.save()
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
SALARY REVISION
"""

# API to create a new salary revision
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_salary_revision(request, employee_id):
    try:
        employee = get_object_or_404(Employee, id=employee_id)

        if request.method == 'POST':
            if not hasattr(employee, 'salary_details'):
                return Response({"error": "Employee salary details not found."}, status=status.HTTP_400_BAD_REQUEST)

            data = request.data
            serializer = SalaryRevisionSerializerCreate(data=data)
            
            if serializer.is_valid():
                salary_revision = serializer.save(employee=employee)
                salary_details = employee.salary_details
                salary_details.basic_salary = salary_revision.revised_basic_salary
                salary_details.housing_allowance = salary_revision.revised_housing_allowance
                salary_details.transport_allowance = salary_revision.revised_transport_allowance
                salary_details.other_allowance = salary_revision.revised_other_allowance
                salary_details.gross_salary = salary_revision.revised_gross_salary
                salary_details.save()
                print(salary_details)

                return Response({
                    "message": "Salary revision created successfully!",
                    "data": serializer.data
                }, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

    

# API to retrieve all salary revisions for an employee
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_salary_revisions(request, employee_id):
    try:
        if request.user.user_type != 'Admin':
            return Response({"detail": "Only admins can see salary revisions records for an employee."}, status=status.HTTP_403_FORBIDDEN)
        employee = get_object_or_404(Employee, id=employee_id)
        salary_revisions = SalaryRevision.objects.filter(employee=employee)
        serializer = SalaryRevisionSerializerCreate(salary_revisions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




# API to retrieve all salary revisions for all employees latest and one record only
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_salary_revisions(request):
    try:
        if request.user.user_type != 'Admin':
            return Response({"detail": "Only admins can see salary revisions records for all employees."}, status=status.HTTP_403_FORBIDDEN)
        latest_salary_revisions = SalaryRevision.objects.values('employee').annotate(latest_revision_date=Max('revision_date'))
        revisions = []
        for revision in latest_salary_revisions:
            salary_revision = SalaryRevision.objects.filter(
                employee=revision['employee'],
                revision_date=revision['latest_revision_date']
            ).first()
            revisions.append(salary_revision)
        serializer = SalaryRevisionSerializer(revisions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



# API to edit an existing salary revision
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def edit_salary_revision(request, revision_id):
    try:
        if request.user.user_type != 'Admin':
            return Response({"detail": "Only admins can update salary revisions records."}, status=status.HTTP_403_FORBIDDEN)
        salary_revision = get_object_or_404(SalaryRevision, id=revision_id)
        if request.method == 'PUT':
            serializer = SalaryRevisionSerializer(salary_revision, data=request.data)
            if serializer.is_valid():
                # Save the updated salary revision
                updated_revision = serializer.save()
                employee = salary_revision.employee
                salary_details = employee.salary_details
                salary_details.basic_salary = updated_revision.updated_basic_salary
                salary_details.housing_allowance = updated_revision.updated_housing_allowance
                salary_details.transport_allowance = updated_revision.updated_transport_allowance
                salary_details.other_allowance = updated_revision.updated_other_allowance

                # Recalculate the gross salary based on updated details
                salary_details.gross_salary = salary_details.calculate_gross_salary()

                # Save the updated salary details
                salary_details.save()

                return Response({
                    "message": "Salary revision updated successfully!",
                    "data": serializer.data
                }, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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


# Employee can update their own details (excluding mandatory information created by admin)
@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def update_own_details(request):
    try:
        employee = Employee.objects.get(user=request.user)
        serializer = EmployeeUpdateSerializer(employee, data=request.data, partial=True)
        print(request.data)
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
        payroll_records = PayrollRecord.objects.filter(employee=employee_details).order_by('-year', '-month')
        serializer = PayrollRecordSerializer(payroll_records, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Employee.DoesNotExist:
        return Response({"detail": "Employee details not found."}, status=status.HTTP_404_NOT_FOUND)
    

# Employee-only view to view their own Salary details
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_own_salary_details(request):
    try:
        employee_details = Employee.objects.get(user=request.user)
        salary_details = SalaryDetails.objects.get(employee=employee_details)
        serializer = SalaryDetailsSerializer(salary_details)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Employee.DoesNotExist:
        return Response({"detail": "Employee details not found."}, status=status.HTTP_404_NOT_FOUND)


# Employee-only view to download their own Payslip
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def download_payroll_pdf(request, payroll_id):
    try:
        employee = Employee.objects.get(user=request.user)
        try:
            payroll_record = PayrollRecord.objects.get(id=payroll_id, employee=employee)
        except PayrollRecord.DoesNotExist:
            return Response({"detail": "Payroll record not found or doesn't belong to this employee."}, 
                            status=status.HTTP_404_NOT_FOUND)

        buffer = io.BytesIO()
        pdf = SimpleDocTemplate(buffer, pagesize=letter, rightMargin=20, leftMargin=20, topMargin=40, bottomMargin=20)
        pdf.title = f"Payslip - {employee.first_name} {employee.last_name} - {payroll_record.month}/{payroll_record.year}"
        elements = []
        styles = getSampleStyleSheet()
        title_style = ParagraphStyle("title", parent=styles["Heading1"], fontSize=16, textColor=colors.black, alignment=1)
        normal_style = styles["BodyText"]

        logo_path = "media/company-images/logo.png" 
        try:
            logo = Image(logo_path, width=100, height=40)
            logo.hAlign = "LEFT"
            elements.append(logo)
        except Exception as e:
            print("Logo not found:", str(e))
        elements.append(Spacer(1, 10)) 
        elements.append(Paragraph("<b>Payslip</b>", title_style))
        elements.append(Spacer(1, 20))

        basic_salary = round(float(getattr(employee.salary_details, 'basic_salary', 0) or 0), 2)
        gross_salary = round(float(getattr(employee.salary_details, 'gross_salary', 0) or 0), 2)
        total_salary_for_month = round(float(getattr(payroll_record, 'total_salary_for_month', 0) or 0), 2)

        unpaid_days = getattr(payroll_record, 'unpaid_days', 0) or 0
        overtime_days = getattr(payroll_record, 'overtime_days', 0) or 0
        normal_overtime_days = getattr(payroll_record, 'normal_overtime_days', 0) or 0
        other_deductions = round(float(getattr(payroll_record, 'other_deductions', 0) or 0), 2)

        daily_salary_gross = round(gross_salary / 30 if gross_salary else 0, 2)
        non_working_days = 30 - payroll_record.total_workable_days or 0
        non_working_days_amount = round(daily_salary_gross * non_working_days, 2)
        daily_salary = round(basic_salary / 30 if basic_salary else 0, 2)
        unpaid_leaves_amount = round(daily_salary * unpaid_days, 2)
        holiday_overtime_amount = round(overtime_days * 1.5 * daily_salary, 2)
        normal_overtime_amount = round(normal_overtime_days * 1.25 * daily_salary, 2)

        total_earnings = gross_salary + holiday_overtime_amount + normal_overtime_amount
        total_deductions = round(unpaid_leaves_amount + other_deductions + non_working_days_amount, 2)


        details_data = [
            ["Date of Joining:", str(employee.joining_date), "Employee Name:", f"{employee.first_name} {employee.last_name}"],
            ["Pay Period:", f"{payroll_record.month}/{payroll_record.year}", "Designation:", employee.designation],
            ["Worked Days:", f"{payroll_record.total_workable_days - unpaid_days}", "Department:", employee.department],
            ["Basic Salary:", basic_salary, "Per day Salary:", daily_salary_gross],
        ]
        details_table = Table(details_data, colWidths=[150, 100, 150, 100])
        details_table.setStyle(TableStyle([
            ("FONTNAME", (0, 0), (-1, -1), "Helvetica"),
            ("ALIGN", (0, 0), (-1, -1), "LEFT"),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ]))
        elements.append(details_table)
        elements.append(Spacer(1, 20))

        # Earnings and Deductions table
        earnings_deductions_data = [
            ["Earnings", "Amount (AED)", "Deductions", "Amount (AED)"],
            ["Monthly Gross Salary", f"AED {gross_salary:.2f}", "Unpaid Leaves", f"AED {unpaid_leaves_amount:.2f}"],
            ["Holiday Overtime", f"AED {holiday_overtime_amount:.2f}", "Other Deductions", f"AED {other_deductions:.2f}"],
            ["Normal Overtime", f"AED {normal_overtime_amount:.2f}", "Non Working Days Amount", f" AED {non_working_days_amount:.2f}"],
            ["Total Earnings", f"AED {total_earnings:.2f}", "Total Deductions", f"AED {total_deductions:.2f}"],
        ]
        earnings_deductions_table = Table(earnings_deductions_data, colWidths=[150, 100, 150, 100])
        earnings_deductions_table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.grey),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.whitesmoke),
            ("ALIGN", (0, 0), (-1, -1), "CENTER"),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("BOTTOMPADDING", (0, 0), (-1, 0), 12),
            ("GRID", (0, 0), (-1, -1), 1, colors.black),
        ]))
        elements.append(earnings_deductions_table)
        elements.append(Spacer(1, 20))

        # Net Pay
        net_pay = total_salary_for_month or 0
        net_pay_data = [["Net Pay:", f"AED {net_pay:.2f}"]]
        net_pay_table = Table(net_pay_data, colWidths=[150, 300])
        net_pay_table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), colors.beige),
            ("FONTNAME", (0, 0), (-1, -1), "Helvetica-Bold"),
            ("ALIGN", (0, 0), (-1, -1), "LEFT"),
        ]))
        elements.append(net_pay_table)

        # Footer
        elements.append(Spacer(1, 30))
        footer = Paragraph("<font size=10><i>This is a system-generated payslip. No signature required.</i></font>", normal_style)
        elements.append(footer)

        # Generate PDF
        pdf.build(elements)
        buffer.seek(0)
        return FileResponse(buffer, as_attachment=True, filename=f"{employee.first_name}_{employee.last_name}_payslip_{payroll_record.month}_{payroll_record.year}.pdf")

    except Employee.DoesNotExist:
        return Response({"detail": "Employee details not found."}, status=status.HTTP_404_NOT_FOUND)
