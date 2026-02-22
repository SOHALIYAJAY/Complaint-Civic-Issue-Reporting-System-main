from django.contrib import admin
from reports.models import report

class AdminReport(admin.ModelAdmin):
    list_display=['full_name','email','phone_number','subject','message']
    
admin.site.register(report,AdminReport)