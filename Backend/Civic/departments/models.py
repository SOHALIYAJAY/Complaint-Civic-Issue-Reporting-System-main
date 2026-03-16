from django.db import models
from accounts.models import CustomUser

class Department(models.Model):
    CATEGORY_CHOICES = [
        ('ROADS', 'Roads & Infrastructure'),
        ('TRAFFIC', 'Traffic & Road Safety'),
        ('WATER', 'Water Supply'),
        ('SEWERAGE', 'Sewerage & Drainage'),
        ('SANITATION', 'Sanitation & Garbage'),
        ('LIGHTING', 'Street Lighting'),
        ('PARKS', 'Parks & Public Spaces'),
        ('ANIMALS', 'Stray Animals'),
        ('ILLEGAL_CONSTRUCTION', 'Illegal Construction'),
        ('ENCROACHMENT', 'Encroachment'),
        ('PROPERTY_DAMAGE', 'Public Property Damage'),
        ('ELECTRICITY', 'Electricity & Power Issues'),
        ('OTHER', 'Other'),
    ]
    
    name = models.CharField(max_length=200)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, unique=True)
    description = models.TextField(blank=True)
    contact_email = models.EmailField()
    contact_phone = models.CharField(max_length=15)
    head_officer = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True, related_name='headed_department')
    officers = models.ManyToManyField(CustomUser, related_name='departments', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name


class Officer(models.Model):
    officer_id = models.CharField(max_length=10, primary_key=True)
    # complaint = models.ForeignKey('complaints.Complaint', on_delete=models.CASCADE, related_name='assigned_officers')
    name=models.CharField(max_length=100)
    email=models.EmailField()
    phone=models.CharField(max_length=15)
    is_available=models.BooleanField(default=True)
