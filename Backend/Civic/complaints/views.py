from django.shortcuts import render
from .models import Complaint
from .serializers import ComplaintSerializer
from django.views.generic import TemplateView, ListView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.mixins import LoginRequiredMixin
from rest_framework.generics import ListAPIView
from rest_framework import generics, status
from django.views.decorators.csrf import csrf_exempt


@api_view(['POST'])
@csrf_exempt
def createcomplaint(request):
    print("Received data:", request.data)  # Debug log
    serializer = ComplaintSerializer(data=request.data)

    if serializer.is_valid():
        complaint = serializer.save()
        return Response({
            'success': True,
            'message': 'Complaint Successfully Submitted',
            'complaint_id': complaint.id,
            'data': ComplaintSerializer(complaint).data
        }, status=status.HTTP_201_CREATED)
    
    print("Validation errors:", serializer.errors)  # Debug log
    return Response({
        'success': False,
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)
  