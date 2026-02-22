from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from complaints.models import Complaint
from complaints.serializers import ComplaintSerializer


class getcomplaint(ListAPIView):
    queryset=Complaint.objects.all()
    serializer_class=ComplaintSerializer
    

@api_view(['GET'])
def complaintsinfo(request):
    total_comp=Complaint.objects.all().count()
    resolved_comp=Complaint.objects.filter(status='resolved').count()
    pending_comp=Complaint.objects.filter(status='Pending').count()
    inprogress_comp=Complaint.objects.filter(status='in-progress').count()

    data={
        'total_comp':total_comp,
        'resolved_comp':resolved_comp,
        'pending_comp':pending_comp,
        'inprogress_comp':inprogress_comp
    }

    return Response(data)

@api_view(['GET'])
def complaintDetails(pk):
    compdetail=Complaint.objects.get(pk=pk)
    return Response({'compdetail':compdetail})
    
