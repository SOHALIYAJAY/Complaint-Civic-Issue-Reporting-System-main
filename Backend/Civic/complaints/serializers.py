from rest_framework import serializers
from .models import Complaint

class ComplaintSerializer(serializers.ModelSerializer):
    # Make image_video optional and handle it properly
    image_video = serializers.FileField(required=False, allow_null=True)
    
    class Meta:
        model = Complaint
        fields = '__all__'
        read_only_fields = ['current_time']
    
    def create(self, validated_data):
        # Remove image_video if it's None or empty string
        if 'image_video' in validated_data and not validated_data['image_video']:
            validated_data.pop('image_video')
        
        complaint = Complaint.objects.create(**validated_data)
        return complaint