from django.db import models
from django.contrib.auth.models import AbstractUser


class CustomUser(AbstractUser):
    USER_TYPE_CHOICES = [
        ('Admin', 'Admin'),
        ('Employee', 'Employee'),
        ('Both', 'Both'),
    ]

    COMPANY_TYPE_CHOICES = [
        ('ShanIbrahim&Co', 'ShanIbrahim&Co'),
    ]
    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES, default='Employee')
    company_name = models.CharField(max_length=255, choices=COMPANY_TYPE_CHOICES, default='ShanIbrahim&Co')

    def __str__(self):
        return f'{self.username} ({self.get_user_type_display()})'
