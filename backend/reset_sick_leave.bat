@echo off
cd /d C:\Users\nooru\Repos\Application\payroll\backend
call venv\Scripts\activate
python manage.py reset_sick_leave
