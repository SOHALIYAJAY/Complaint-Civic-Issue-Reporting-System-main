from django.db import models
from django.contrib.auth.models import AbstractUser, PermissionsMixin
from .managers import CustomUserManager
from datetime import datetime as dt

class CustomUser(AbstractUser, PermissionsMixin):
    CHOICE_FIELDS = (
        ('Civic-User', 'Civic-User'),
        ('Department-User', 'Department-User'),
        ('Admin-User', 'Admin-User')
    )
    email = models.EmailField(unique=True)
    created_join = models.DateField(default=dt.now)
    password = models.CharField(max_length=200)
    User_Role = models.CharField(choices=CHOICE_FIELDS, max_length=200)
    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self):
        return self.email