# BACKEND FIX: Update your view to handle FileField properly

from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import YourComplaintModel
from .serializers import ComplaintDetailSerializer

@api_view(['GET'])
def complaint_details(request, id):
    try:
        complaint = YourComplaintModel.objects.get(id=id)
        serializer = ComplaintDetailSerializer(
            complaint, 
            context={'request': request}
        )
        
        # Manual handling of FileField if needed
        data = serializer.data
        
        # Ensure image_video is properly handled
        if hasattr(complaint, 'image_video') and complaint.image_video:
            data['image_video_url'] = request.build_absolute_uri(complaint.image_video.url)
        else:
            data['image_video_url'] = None
            
        return Response(data)
        
    except YourComplaintModel.DoesNotExist:
        return Response({'error': 'Complaint not found'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=500)
