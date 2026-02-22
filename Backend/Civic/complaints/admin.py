from django.contrib import admin
from complaints.models import Complaint

class AdminComplaint(admin.ModelAdmin):
    list_display=['title','Category','Description','location_address','location_District','location_taluk','priority_level','current_time','status']

admin.site.register(Complaint,AdminComplaint)