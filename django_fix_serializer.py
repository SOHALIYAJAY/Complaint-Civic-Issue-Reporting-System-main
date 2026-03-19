# BACKEND FIX: Add this to your Django serializer file

from rest_framework import serializers
from .models import YourComplaintModel  # Replace with your actual model

class ComplaintDetailSerializer(serializers.ModelSerializer):
    # Add this field to handle the image_video file properly
    image_video_url = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = YourComplaintModel  # Replace with your actual model name
        fields = [
            'comp_name', 
            'filed_on', 
            'description', 
            'status', 
            'priority',
            'location_address', 
            'location_district', 
            'location_taluk',
            'officer_id',
            'image_video_url',  # Use this instead of image_video
        ]
        # OR exclude the problematic field entirely:
        # exclude = ['image_video']
    
    def get_image_video_url(self, obj):
        """Safely get the image/video URL if it exists"""
        if obj.image_video and hasattr(obj.image_video, 'url'):
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image_video.url)
            return obj.image_video.url
        return None
