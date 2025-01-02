from xhtml2pdf import pisa
from django.template.loader import render_to_string
from io import BytesIO
from django.core.files.storage import default_storage

def generate_salary_pdf(employee, payroll_record):
    # Render the HTML template with the context data
    html_content = render_to_string('employees/salary_slip.html', {'employee': employee, 'payroll': payroll_record})
    
    # Create a BytesIO object to store the generated PDF
    pdf_output = BytesIO()
    
    # Use pisa.CreatePDF to convert the HTML to PDF
    pisa_status = pisa.CreatePDF(html_content, dest=pdf_output)
    
    # Check if PDF creation was successful
    if pisa_status.err:
        return None  # You can handle the error more specifically
    
    # Define the path for saving the PDF file
    pdf_path = f'payroll_slips/{employee.first_name}-{employee.last_name}_payroll_{payroll_record.month}_{payroll_record.year}.pdf'
    
    # Save the generated PDF to the default storage
    with default_storage.open(pdf_path, 'wb') as pdf_file:
        pdf_file.write(pdf_output.getvalue())
    
    # Return the path to the generated PDF
    return pdf_path
