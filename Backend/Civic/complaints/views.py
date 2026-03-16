from django.shortcuts import render
from .models import Complaint, ComplaintAssignment, ComplaintCategory
from .serializers import ComplaintSerializer, ComplaintAssignmentSerializer
from django.views.generic import TemplateView, ListView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.mixins import LoginRequiredMixin
from rest_framework.generics import ListAPIView
from rest_framework import generics, status
from .models import ComplaintCategory
# from complaints.views import createcomplaint, CategoryList
# from .serializers import ComplaintCategorySerializer


@api_view(['POST'])
def createcomplaint(request):
    print("Received data:", request.data)  # Debug log
    data = request.data.copy()
    cat_val = data.get('Category')
    if cat_val is not None and not str(cat_val).isdigit():
        try:
            cc = ComplaintCategory.objects.filter(name__iexact=str(cat_val)).first()
            if not cc:
                cc = ComplaintCategory.objects.filter(slug__iexact=str(cat_val).lower()).first()
            if not cc:
                cc = ComplaintCategory.objects.filter(description__icontains=str(cat_val)).first()
            if cc:
                data['Category'] = cc.id
        except Exception:
                pass

    serializer = ComplaintSerializer(data=data)

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

