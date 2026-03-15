from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework import status
from .models import CustomUser
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from google.oauth2 import id_token
from google.auth.transport import requests
from accounts.serializers import UserRegister
from complaints.models import Complaint

class LoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        try:
            user = CustomUser.objects.get(email=email)
            if user.check_password(password):
                refresh = RefreshToken.for_user(user)
                return Response({
                    'success': True,
                    'access_token': str(refresh.access_token),
                    'refresh_token': str(refresh),
                    'user': {
                        'email': user.email,
                        'username': user.username,
                        'name': user.get_full_name() or user.email,
                        'role': user.User_Role
                    }
                })
            return Response({'success': False, 'message': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        except CustomUser.DoesNotExist:
            return Response({'success': False, 'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

class RegisterView(APIView):
    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        role = request.data.get('role', 'Civic-User')

        if CustomUser.objects.filter(email=email).exists():
            return Response({'success': False, 'message': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)

        if username and CustomUser.objects.filter(username=username).exists():
            return Response({'success': False, 'message': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)

        user = CustomUser.objects.create_user(
            email=email,
            password=password,
            username=username or email.split('@')[0],
            User_Role=role
        )
        
        # Auto-login after signup
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'success': True,
            'message': 'User registered successfully',
            'access_token': str(refresh.access_token),
            'refresh_token': str(refresh),
            'user': {
                'email': user.email,
                'username': user.username,
                'role': user.User_Role
            }
        }, status=status.HTTP_201_CREATED)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh_token')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            return Response({'success': True, 'message': 'Logged out successfully'}, status=status.HTTP_200_OK)
        except Exception:
            return Response({'success': True, 'message': 'Logged out successfully'}, status=status.HTTP_200_OK)

class GoogleLoginView(APIView):
    def post(self, request):
        token = request.data.get('token')
        
        try:
            GOOGLE_CLIENT_ID = '368010718950-mpbp3m0379j51abunusi6n1o2jtnq715.apps.googleusercontent.com'
            idinfo = id_token.verify_oauth2_token(token, requests.Request(), GOOGLE_CLIENT_ID)
            
            email = idinfo.get('email')
            name = idinfo.get('name')
            
            user, created = CustomUser.objects.get_or_create(
                email=email,
                defaults={
                    'username': email.split('@')[0],
                    'first_name': name.split()[0] if name else '',
                    'last_name': ' '.join(name.split()[1:]) if name and len(name.split()) > 1 else '',
                    'User_Role': 'Civic-User'
                }
            )
            
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'success': True,
                'access_token': str(refresh.access_token),
                'refresh_token': str(refresh),
                'user': {
                    'email': user.email,
                    'username': user.username,
                    'name': user.get_full_name() or user.email,
                    'role': user.User_Role
                }
            }, status=status.HTTP_200_OK)
            
        except ValueError:
            return Response({
                'success': False,
                'message': 'Invalid Google token'
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({
                'success': False,
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UserDetail(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            user = request.user
            total_complaints = Complaint.objects.filter(user=user).count()
            return Response({
                'id': user.id,
                'Username': user.username,
                'email': user.email,
                'Date': user.date_joined.strftime('%Y-%m-%d') if hasattr(user, 'date_joined') else None,
                'role': user.User_Role if hasattr(user, 'User_Role') else 'Civic-User',
                'total_complaints': total_complaints
            })
        except Exception as e:
            return Response({'error': str(e)}, status=500)


