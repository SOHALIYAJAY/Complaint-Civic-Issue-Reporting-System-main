from rest_framework import serializers
from .models import contact_us

class contactusSerializer(serializers.ModelSerializer):
    class Meta:
        model=contact_us
        fields='__all__'