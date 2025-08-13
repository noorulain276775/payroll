import os
from django.conf import settings
from django.core.files.storage import default_storage
from xhtml2pdf import pisa
from django.template.loader import render_to_string
from io import BytesIO

# Constants
PDF_UPLOAD_DIR = 'employee_payroll'
MAX_PDF_SIZE = 10 * 1024 * 1024  # 10MB

def generate_salary_pdf(employee, payroll_record):
    try:
        html_content = render_to_string('employees/salary_slip.html', {
            'employee': employee, 
            'payroll': payroll_record
        })
        pdf_output = BytesIO()
        pisa_status = pisa.CreatePDF(html_content, dest=pdf_output)
        
        if pisa_status.err:
            raise Exception(f"PDF generation failed: {pisa_status.err}")
        
        # Create directory if it doesn't exist
        pdf_dir = os.path.join(settings.MEDIA_ROOT, PDF_UPLOAD_DIR)
        os.makedirs(pdf_dir, exist_ok=True)
        
        # Generate safe filename
        safe_first_name = "".join(c for c in employee.first_name if c.isalnum() or c in (' ', '-', '_')).rstrip()
        safe_last_name = "".join(c for c in employee.last_name if c.isalnum() or c in (' ', '-', '_')).rstrip()
        
        pdf_filename = f'{safe_first_name}-{safe_last_name}_payroll_{payroll_record.month}_{payroll_record.year}.pdf'
        pdf_path = os.path.join(pdf_dir, pdf_filename)
        
        # Check file size before writing
        pdf_content = pdf_output.getvalue()
        if len(pdf_content) > MAX_PDF_SIZE:
            raise Exception("Generated PDF is too large")
        
        with default_storage.open(pdf_path, 'wb') as pdf_file:
            pdf_file.write(pdf_content)
        
        return pdf_path
        
    except Exception as e:
        # Log the error for debugging
        print(f"Error generating PDF for employee {employee.id}: {str(e)}")
        return None
    finally:
        # Clean up
        if 'pdf_output' in locals():
            pdf_output.close()
