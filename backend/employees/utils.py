from weasyprint import HTML
from django.template.loader import render_to_string
from io import BytesIO
from django.core.files.storage import default_storage

def generate_salary_pdf(employee, payroll_record):
    html_content = render_to_string('employees/salary_slip.html', {'employee': employee, 'payroll': payroll_record})
    pdf_file = HTML(string=html_content).write_pdf()
    pdf_path = f'payroll_slips/{employee.first_name}-{employee.last_name}_payroll_{payroll_record.month}_{payroll_record.year}.pdf'
    with default_storage.open(pdf_path, 'wb') as pdf:
        pdf.write(pdf_file)
    
    return pdf_path
