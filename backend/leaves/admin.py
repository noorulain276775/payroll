from django.contrib import admin
from .models import Leave, LeaveAccrual,LeaveBalance


admin.site.register(Leave)
admin.site.register(LeaveAccrual)
admin.site.register(LeaveBalance)
