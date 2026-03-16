from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from complaints.models import Complaint
from complaints.serializers import ComplaintSerializer
from accounts.models import CustomUser
from rest_framework.permissions import IsAuthenticated
from departments.models import Department
from departments.serializers import deptSerializer
from .models import Officer
from .serializers import OfficerSerializer
from rest_framework.generics import CreateAPIView
from django.db import IntegrityError
from rest_framework import status
from rest_framework.exceptions import ValidationError as DRFValidationError


class OfficerDetail(ListAPIView):
    queryset = Officer.objects.all()
    serializer_class = OfficerSerializer


# class CreateOfficer(CreateAPIView):
#     queryset = Officer.objects.all()
#     serializer_class = OfficerSerializer

#     def create(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data=request.data)
#         try:
#             serializer.is_valid(raise_exception=True)
#             self.perform_create(serializer)
#         except DRFValidationError as e:
#             return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
#         except IntegrityError as e:
#             return Response({'error': 'Integrity error', 'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
#         except Exception as e:
#             return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

#         headers = self.get_success_headers(serializer.data)
#         return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

   