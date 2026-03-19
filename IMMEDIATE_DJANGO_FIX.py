# IMMEDIATE FIX: Replace your current complaint details serializer with this

from rest_framework import serializers
from .models import YourComplaintModel  # IMPORT YOUR ACTUAL MODEL

class ComplaintDetailSerializer(serializers.ModelSerializer):
    # This safely handles the image_video field
    image_video_url = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = YourComplaintModel  # REPLACE WITH YOUR ACTUAL MODEL NAME
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
        # IMPORTANT: Do NOT include 'image_video' in fields!
        # The error is caused by trying to serialize image_video directly
    
    def get_image_video_url(self, obj):
        """Safely get the image/video URL if it exists"""
        if hasattr(obj, 'image_video') and obj.image_video:
            try:
                request = self.context.get('request')
                if request:
                    return request.build_absolute_uri(obj.image_video.url)
                return obj.image_video.url
            except (ValueError, AttributeError):
                # Handle case where file doesn't exist
                return None
        return None

# ALSO UPDATE YOUR VIEW IF NEEDED:
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def complaint_details(request, id):
    try:
        complaint = YourComplaintModel.objects.get(id=id)
        serializer = ComplaintDetailSerializer(complaint, context={'request': request})
        return Response(serializer.data)
    except YourComplaintModel.DoesNotExist:
        return Response({'error': 'Complaint not found'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=500)
