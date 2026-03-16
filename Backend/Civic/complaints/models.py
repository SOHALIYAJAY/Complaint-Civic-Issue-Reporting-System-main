from ast import mod
from pyexpat import model
from django.db import models
# from django.contrib.auth.models import User 
from django.utils import timezone
from departments.models import Officer
class Complaint(models.Model):

    CHOICE_PRIORITY=(
        ('Low','Low'),
        ('Medium','Medium'),
        ('High','High')
        )
    CHOICE_STATUS=(
        ('Pending','Pending'),
        ('in-progress','In Progress'),
        ('resolved','Resolved')
        )
    
    title=models.CharField(max_length=100)
    officer_id=models.ForeignKey(Officer, null=True, blank=True, on_delete=models.SET_NULL, related_name='assigned_complaints')
    Category=models.ForeignKey('ComplaintCategory', null=True, blank=True, on_delete=models.SET_NULL, related_name='complaints')
    Description=models.CharField(max_length=300)
    image_video=models.FileField(upload_to='media/', null=True, blank=True)
    location_address=models.CharField(max_length=200)
    location_District=models.CharField(max_length=100)
    location_taluk=models.CharField(max_length=100)
    priority_level=models.CharField(max_length=20, choices=CHOICE_PRIORITY, default='Medium')
    status=models.CharField(max_length=20, choices=CHOICE_STATUS, default='Pending')
    current_time=models.DateTimeField(default=timezone.now)
    is_assignd=models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.title} - {self.Category}"

class ComplaintAssignment(models.Model):
    PRIORITY_CHOICES = [
        ('High', 'High'),
        ('Medium', 'Medium'),
        ('Low', 'Low'),
    ]
    
    complaint = models.ForeignKey(Complaint, on_delete=models.CASCADE, related_name='assignments')
    officer = models.ForeignKey(Officer, on_delete=models.CASCADE, related_name='complaint_assignments')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='Medium')
    remarks = models.TextField(blank=True)
    class Meta:
        unique_together = ['complaint', 'officer']
    
    def __str__(self):
        return f"{self.complaint.title} -> {self.officer.name}"


class ComplaintCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True, blank=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name