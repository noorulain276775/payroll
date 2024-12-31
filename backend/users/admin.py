from django.contrib import admin
from .models import CustomUser
from django.contrib.auth.admin import UserAdmin

class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'user_type', 'is_active', 'date_joined')
    fieldsets = (
        (None, {'fields': ('username', 'email', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name', 'user_type')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important Dates', {'fields': ('date_joined',)}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'user_type', 'is_active', 'is_staff'),
        }),
    )
    search_fields = ('username', 'email')
    list_filter = ('user_type', 'is_active', 'is_staff')
    exclude = ('last_login',)
    def save_model(self, request, obj, form, change):
        if not change:
            obj.set_password(obj.password)
        obj.save()
admin.site.register(CustomUser, CustomUserAdmin)
