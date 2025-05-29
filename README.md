# HR Management System

A powerful and flexible HR software solution designed to streamline and automate human resource operations. It features full employee lifecycle management, intelligent leave tracking, and scheduled automation — all accessible through secure, role-based portals.

---

## Features

### Employee Management
- Complete profile management
- Tracks job details, contact info, and employment history

### Role-Based Access Panels
- **Super Admin Panel** – Full control over users, roles, and global settings
- **Admin Panel** – Manage employees, approve/reject leaves, assign roles
- **Employee Dashboard** – Personal records, leave requests, leave history

### Leave Management System
- Supports multiple leave types:
  - Annual, Sick, Unpaid, Maternity, Paternity, Compassionate, Personal, Emergency, Other
- Real-time balance tracking and automatic day calculations
- Remarks field for approval/rejection decisions
- Auto-approval logic for staff-submitted requests with valid balance
- Auto-rejection with feedback for insufficient balance

### Automated Scheduling
- Monthly **leave accrual** runs automatically on the 1st at 12:00 AM
- Yearly **sick leave reset** on January 1st
- Powered by **Windows Task Scheduler**

### Security & Activity Logs
- Tracks approval/rejection actions with timestamps and approver identity
- JWT-secured API endpoints
- Role-based permissions for secure data access

### API Ready
- Easily integrates with frontend apps (React/Vue/Angular)
- Accepts employee and leave details from frontend
- Token-authenticated endpoints

---

## Tech Stack

- **Backend:** Django, Django REST Framework  
- **Frontend:** React (via REST API integration)  
- **Database:** PostgreSQL / MySQL  
- **Authentication:** JWT or Session-based  
- **Scheduling:** Windows Task Scheduler  
- **Deployment:** Compatible with local servers and cloud (Heroku, AWS, etc.)

---

## Setup Notes

- Make sure Task Scheduler is configured to run:
  - `accure_leave` monthly on the 1st
  - `reset_sick_leave` yearly on January 1st
- All leave and employee APIs are protected and require proper authentication

---
