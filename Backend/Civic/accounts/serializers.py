from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import serializers
# class LoginSerializer(serializers.Serializer):
#     email = serializers.EmailField()
#     password = serializers.CharField(write_only=True)

#     def validate(self, data):
#         email = data.get("email")
#         password = data.get("password")

#         user = authenticate(email=email, password=password)

#         if user is None:
#             raise serializers.ValidationError("Invalid email or password")

#         data["user"] = user
#         return data

class UserRegister(serializers.ModelSerializer):
    password2=serializers.CharField(write_only=True)
    class Meta:
        model=User
        fields=['username','email','password','password2']

    def validate(self,data):
        if data['password']!=data['password2']:
            raise  serializers.ValidationError('Password Not Match')
        
        return data
    
    def creteuser(self,validate_data):
        user=User.objects.create_user(
            username=validate_data['username'],
            email=validate_data['email'],
            password=validate_data['password']
        )

        return user