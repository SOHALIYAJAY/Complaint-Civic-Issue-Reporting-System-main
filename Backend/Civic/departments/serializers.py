from rest_framework import serializers
from .models import Department, Officer

class deptSerializer(serializers.ModelSerializer):
    head_officer_name = serializers.SerializerMethodField()
    officer_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Department
        fields = ['id', 'name', 'category', 'description', 'contact_email', 'contact_phone', 'head_officer_name', 'officer_count', 'created_at']
    
    def get_head_officer_name(self, obj):
        return obj.head_officer.email if obj.head_officer else None
    
    def get_officer_count(self, obj):
        return obj.officers.count()

class OfficerSerializer(serializers.ModelSerializer):
    class Meta:
        model=Officer
        fields='__all__'

    