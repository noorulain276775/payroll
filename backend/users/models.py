from django.db import models
from django.contrib.auth.models import AbstractUser


class CustomUser(AbstractUser):
    USER_TYPE_CHOICES = [
        ('Admin', 'Admin'),
        ('Employee', 'Employee'),
    ]

    COMPANY_TYPE_CHOICES = [
        ('Liya', 'Liya'),
        ('Opera', 'Opera'),
        ('Fusion', 'Fusion'),
    ]
    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES, default='Employee')
    company_name = models.CharField(max_length=255, choices=COMPANY_TYPE_CHOICES, default='Liya')

    def __str__(self):
        return f'{self.username} ({self.get_user_type_display()})'
