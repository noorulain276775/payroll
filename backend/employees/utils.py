import os
from django.conf import settings
from django.core.files.storage import default_storage
from xhtml2pdf import pisa
from django.template.loader import render_to_string
from io import BytesIO

def generate_salary_pdf(employee, payroll_record):
    html_content = render_to_string('employees/salary_slip.html', {'employee': employee, 'payroll': payroll_record})
    pdf_output = BytesIO()
    pisa_status = pisa.CreatePDF(html_content, dest=pdf_output)
    
    if pisa_status.err:
        return None
    pdf_dir = os.path.join(settings.MEDIA_ROOT, 'employee_payroll')
    if not os.path.exists(pdf_dir):
        os.makedirs(pdf_dir)
    pdf_path = os.path.join(pdf_dir, f'{employee.first_name}-{employee.last_name}_payroll_{payroll_record.month}_{payroll_record.year}.pdf')
    with default_storage.open(pdf_path, 'wb') as pdf_file:
        pdf_file.write(pdf_output.getvalue())
    return pdf_path
