# QUICK FIX: Just exclude the problematic field

# Find your ComplaintDetailSerializer and change the Meta class to:

class ComplaintDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = YourComplaintModel  # Replace with your actual model
        exclude = ['image_video']  # THIS EXCLUDES THE PROBLEMATIC FIELD
        
        # OR instead of exclude, list only the fields you need:
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
        # NOTICE: 'image_video' is NOT in this list
