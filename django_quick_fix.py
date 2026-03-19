# QUICK BACKEND FIX: Exclude the problematic field

# In your serializer.py, simply exclude the image_video field:

class ComplaintDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = YourComplaintModel  # Replace with your actual model
        exclude = ['image_video']  # This excludes the problematic field
        
        # OR specify only the fields you need:
        fields = [
            'comp_name', 
            'filed_on', 
            'description', 
            'status', 
            'priority',
            'location_address', 
            'location_district', 
            'location_taluk',
            'officer_id'
        ]
