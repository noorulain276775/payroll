from django.utils import timezone
from django.db import transaction
from decimal import Decimal
from .models import Leave, LeaveBalance, LeaveAccrual
from .constants import LEAVE_TYPE_TO_BALANCE_FIELD, MONTHLY_LEAVE_ACCRUAL_DAYS, DEFAULT_PENDING_REMARKS, DEFAULT_APPROVED_REMARKS


class LeaveService:
    """Service class for leave-related business logic"""
    
    @staticmethod
    def calculate_leave_days(start_date, end_date):
        """Calculate the number of days between start and end dates"""
        return (end_date - start_date).days + 1
    
    @staticmethod
    def get_balance_field_for_leave_type(leave_type):
        """Get the corresponding balance field for a leave type"""
        return LEAVE_TYPE_TO_BALANCE_FIELD.get(leave_type)
    
    @staticmethod
    def process_leave_approval(leave, requested_by):
        """Process leave approval logic"""
        balance_field = LeaveService.get_balance_field_for_leave_type(leave.leave_type)
        
        if not balance_field:
            return LeaveService._reject_leave(leave, requested_by, "Invalid leave type")
        
        try:
            leave_balance = LeaveBalance.objects.get(employee=leave.employee)
            current_balance = getattr(leave_balance, balance_field, 0)
            
            if leave.leave_type == 'Unpaid':
                return LeaveService._process_unpaid_leave(leave, requested_by)
            elif current_balance >= leave.days_taken:
                return LeaveService._approve_leave(leave, requested_by, leave_balance, balance_field, current_balance)
            else:
                return LeaveService._reject_leave(leave, requested_by, "Not enough leave balance")
                
        except LeaveBalance.DoesNotExist:
            return LeaveService._reject_leave(leave, requested_by, "Leave balance not found")
    
    @staticmethod
    def _process_unpaid_leave(leave, requested_by):
        """Process unpaid leave approval"""
        if requested_by and requested_by.is_staff and requested_by != leave.employee.user:
            leave.status = 'Approved'
            leave.approved_by = requested_by
            leave.approved_on = timezone.now()
            leave.remarks = "Auto-approved by staff for unpaid leave"
            return True
        else:
            leave.status = 'Pending'
            leave.remarks = DEFAULT_PENDING_REMARKS
            return False
    
    @staticmethod
    def _approve_leave(leave, requested_by, leave_balance, balance_field, current_balance):
        """Approve leave and update balance"""
        if requested_by and requested_by.is_staff:
            setattr(leave_balance, balance_field, current_balance - leave.days_taken)
            leave_balance.save()
            leave.status = 'Approved'
            leave.approved_by = requested_by
            leave.approved_on = timezone.now()
            leave.remarks = "Auto-approved by staff"
            return True
        else:
            leave.status = 'Pending'
            leave.remarks = DEFAULT_PENDING_REMARKS
            return False
    
    @staticmethod
    def _reject_leave(leave, requested_by, reason):
        """Reject leave with reason"""
        leave.status = 'Rejected'
        leave.approved_by = requested_by if requested_by and requested_by.is_staff else None
        leave.approved_on = timezone.now()
        leave.remarks = reason
        return False

    @staticmethod
    def approve_leave(leave, approver):
        """Approve leave and update balance"""
        from .models import LeaveBalance
        
        balance_field = LeaveService.get_balance_field_for_leave_type(leave.leave_type)
        
        if not balance_field:
            return LeaveService._reject_leave(leave, approver, "Invalid leave type")
        
        try:
            leave_balance = LeaveBalance.objects.get(employee=leave.employee)
            current_balance = getattr(leave_balance, balance_field, 0)
            
            if leave.leave_type == 'Unpaid' or current_balance >= leave.days_taken:
                if leave.leave_type != 'Unpaid':
                    setattr(leave_balance, balance_field, current_balance - leave.days_taken)
                    leave_balance.save()
                
                leave.status = 'Approved'
                leave.approved_on = timezone.now()
                leave.approved_by = approver
                leave.save()
                return True
            else:
                return LeaveService._reject_leave(leave, approver, "Not enough leave balance")
                
        except LeaveBalance.DoesNotExist:
            return LeaveService._reject_leave(leave, approver, "Leave balance not found")
    
    @staticmethod
    def reject_leave(leave, approver=None):
        """Reject leave with reason"""
        leave.status = 'Rejected'
        leave.approved_on = timezone.now()
        leave.approved_by = approver
        leave.save()
        return False


class LeaveAccrualService:
    """Service class for leave accrual logic"""
    
    @staticmethod
    def should_accrue_leave(last_accrued_date, current_date):
        """Check if leave should be accrued for the current month"""
        return (last_accrued_date.year < current_date.year or 
                (last_accrued_date.year == current_date.year and 
                 last_accrued_date.month < current_date.month))
    
    @staticmethod
    def accrue_monthly_leave_for_employee(leave_accrual, current_date):
        """Accrue monthly leave for a specific employee"""
        with transaction.atomic():
            # Update the accrual record
            leave_accrual.leave_balance += Decimal(str(MONTHLY_LEAVE_ACCRUAL_DAYS))
            leave_accrual.last_accrued_date = current_date
            leave_accrual.save()
            
            # Update the leave balance
            try:
                leave_balance = LeaveBalance.objects.get(employee=leave_accrual.employee)
                leave_balance.annual_leave_balance += Decimal(str(MONTHLY_LEAVE_ACCRUAL_DAYS))
                leave_balance.save()
            except LeaveBalance.DoesNotExist:
                LeaveBalance.objects.create(
                    employee=leave_accrual.employee, 
                    annual_leave_balance=Decimal(str(MONTHLY_LEAVE_ACCRUAL_DAYS))
                )
