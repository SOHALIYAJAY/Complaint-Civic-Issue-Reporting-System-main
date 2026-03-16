from django.contrib import admin
from .models import Department, Officer
from .models import Department
class AdminDept(admin.ModelAdmin):
    list_display=['name','category','contact_email','head_officer','created_at']
admin.site.register(Department,AdminDept)


class AdminOfficer(admin.ModelAdmin):
    list_display=['officer_id','name','email','phone','is_available']
admin.site.register(Officer,AdminOfficer)
