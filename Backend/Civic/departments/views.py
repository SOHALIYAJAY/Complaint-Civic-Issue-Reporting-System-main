from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from complaints.models import Complaint
from complaints.serializers import ComplaintSerializer
from accounts.models import CustomUser
from departments.models import Department, Officer
from departments.serializers import deptSerializer, OfficerSerializer
from rest_framework.generics import CreateAPIView
from django.db import IntegrityError
from rest_framework import status
from rest_framework.exceptions import ValidationError as DRFValidationError
from django.db.models import Count, Avg, Q
from django.utils import timezone
from datetime import timedelta, datetime
import json


class OfficerDetail(ListAPIView):
    queryset = Officer.objects.all()
    serializer_class = OfficerSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def department_profile(request):
    """
    Get department profile for the current user's department
    """
    try:
        user = request.user
        
        # Get department based on user's role and department
        department = None
        if hasattr(user, 'departments') and user.departments.exists():
            department = user.departments.first()
        elif hasattr(user, 'headed_department') and user.headed_department.exists():
            department = user.headed_department.first()
        
        if not department:
            return Response({'error': 'No department found for this user'}, status=status.HTTP_404_NOT_FOUND)
        
        # Calculate statistics
        total_officers = department.officers.count()
        
        # Get complaints assigned to this department's officers
        department_officers = department.officers.all()
        active_complaints = Complaint.objects.filter(
            officer_id__in=department_officers,
            status__in=['Pending', 'in-progress']
        ).count()
        resolved_complaints = Complaint.objects.filter(
            officer_id__in=department_officers,
            status='resolved'
        ).count()
        
        # Calculate average resolution time (in days)
        resolved_complaints_with_dates = Complaint.objects.filter(
            officer_id__in=department_officers,
            status='resolved'
        )
        
        avg_resolution_time = 0
        if resolved_complaints_with_dates.exists():
            total_time = sum([
                (timezone.now().date() - comp.current_time.date()).days 
                for comp in resolved_complaints_with_dates
            ])
            avg_resolution_time = total_time / resolved_complaints_with_dates.count()
        
        # Calculate satisfaction rate (using a placeholder since satisfaction_rating field doesn't exist)
        satisfaction_rate = 85.0  # Default satisfaction rate
        
        # Calculate performance score
        performance_score = min(100, (
            (resolved_complaints / max(1, active_complaints + resolved_complaints) * 50) +
            (satisfaction_rate * 0.5)
        ))
        
        profile_data = {
            'id': department.id,
            'name': department.name,
            'description': department.description,
            'head': department.head_officer.get_full_name() if department.head_officer else 'Not Assigned',
            'email': department.contact_email,
            'phone': department.contact_phone,
            'address': 'Department Address',  # You may need to add address field to model
            'website': '',
            'establishedYear': 2020,  # You may need to add this field to model
            'totalOfficers': total_officers,
            'activeComplaints': active_complaints,
            'resolvedComplaints': resolved_complaints,
            'avgResolutionTime': round(avg_resolution_time, 1),
            'satisfactionRate': round(satisfaction_rate, 1),
            'performanceScore': round(performance_score, 1),
            'budget': 1000000,  # You may need to add this field to model
            'category': department.get_category_display(),
            'status': 'Active'
        }
        
        return Response(profile_data)
        
    except Exception as e:
        print(f"Error in department_profile: {str(e)}")
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def department_officers(request):
    """
    Get officers in the current user's department
    """
    try:
        user = request.user
        
        # Get department based on user's role and department
        department = None
        if hasattr(user, 'departments') and user.departments.exists():
            department = user.departments.first()
        elif hasattr(user, 'headed_department') and user.headed_department.exists():
            department = user.headed_department.first()
        
        if not department:
            return Response({'error': 'No department found for this user'}, status=status.HTTP_404_NOT_FOUND)
        
        officers = department.officers.all()
        officers_data = []
        
        for officer in officers:
            # Calculate officer statistics
            handled_complaints = Complaint.objects.filter(officer_id=officer).count()
            resolved_complaints = Complaint.objects.filter(
                officer_id=officer, 
                status='resolved'
            ).count()
            
            # Calculate average resolution time
            resolved_complaints_with_dates = Complaint.objects.filter(
                officer_id=officer,
                status='resolved'
            )
            
            avg_resolution_time = 0
            if resolved_complaints_with_dates.exists():
                total_time = sum([
                    (timezone.now().date() - comp.current_time.date()).days 
                    for comp in resolved_complaints_with_dates
                ])
                avg_resolution_time = total_time / resolved_complaints_with_dates.count()
            
            # Calculate satisfaction rate (using placeholder)
            satisfaction_rate = 85.0
            
            # Calculate performance score
            performance_score = min(100, (
                (resolved_complaints / max(1, handled_complaints) * 50) +
                (satisfaction_rate * 0.5)
            ))
            
            officers_data.append({
                'id': officer.id,
                'name': officer.get_full_name(),
                'email': officer.email,
                'phone': getattr(officer, 'phone', 'Not Available'),
                'role': 'Officer',
                'department': department.name,
                'status': 'Active' if officer.is_active else 'Inactive',
                'joinedDate': officer.date_joined.strftime('%Y-%m-%d') if officer.date_joined else 'Unknown',
                'totalComplaintsHandled': handled_complaints,
                'avgResolutionTime': round(avg_resolution_time, 1),
                'satisfactionRate': round(satisfaction_rate, 1),
                'performanceScore': round(performance_score, 1)
            })
        
        return Response(officers_data)
        
    except Exception as e:
        print(f"Error in department_officers: {str(e)}")
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def department_complaints(request):
    """
    Get complaints for the current user's department
    """
    try:
        user = request.user
        
        # Get department based on user's role and department
        department = None
        if hasattr(user, 'departments') and user.departments.exists():
            department = user.departments.first()
        elif hasattr(user, 'headed_department') and user.headed_department.exists():
            department = user.headed_department.first()
        
        if not department:
            return Response({'error': 'No department found for this user'}, status=status.HTTP_404_NOT_FOUND)
        
        # Get complaints assigned to this department's officers
        department_officers = department.officers.all()
        complaints = Complaint.objects.filter(
            officer_id__in=department_officers
        ).order_by('-current_time')
        
        complaints_data = []
        
        for complaint in complaints:
            complaints_data.append({
                'id': complaint.id,
                'title': complaint.title or 'Untitled',
                'description': complaint.Description[:200] + '...' if len(complaint.Description) > 200 else complaint.Description,
                'category': complaint.Category.name if complaint.Category else 'Uncategorized',
                'priority': complaint.priority_level,
                'status': complaint.status,
                'submittedDate': complaint.current_time.strftime('%Y-%m-%d'),
                'assignedOfficer': complaint.officer_id.name if complaint.officer_id else 'Unassigned',
                'estimatedResolution': 'Not set',  # This field doesn't exist in the model
                'citizenName': complaint.user.get_full_name() if complaint.user else 'Unknown',
                'citizenEmail': complaint.user.email if complaint.user else 'Unknown',
                'citizenPhone': getattr(complaint.user, 'phone', 'Not Available'),
                'location': complaint.location_address or 'Not specified',
                'satisfactionRating': None  # This field doesn't exist in the model
            })
        
        return Response(complaints_data)
        
    except Exception as e:
        print(f"Error in department_complaints: {str(e)}")
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def department_performance(request):
    """
    Get performance metrics for the current user's department
    """
    try:
        user = request.user
        
        # Get department based on user's role and department
        department = None
        if hasattr(user, 'departments') and user.departments.exists():
            department = user.departments.first()
        elif hasattr(user, 'headed_department') and user.headed_department.exists():
            department = user.headed_department.first()
        
        if not department:
            return Response({'error': 'No department found for this user'}, status=status.HTTP_404_NOT_FOUND)
        
        # Get complaints assigned to this department's officers
        department_officers = department.officers.all()
        
        # Monthly statistics for the last 6 months
        monthly_stats = []
        for i in range(6):
            month_start = timezone.now() - timedelta(days=30*i)
            month_end = timezone.now() - timedelta(days=30*(i-1)) if i > 0 else timezone.now()
            
            month_complaints = Complaint.objects.filter(
                officer_id__in=department_officers,
                current_time__gte=month_start,
                current_time__lt=month_end
            )
            
            month_resolved = month_complaints.filter(status='resolved').count()
            month_pending = month_complaints.filter(status__in=['Pending', 'in-progress']).count()
            
            monthly_stats.append({
                'month': month_start.strftime('%b'),
                'complaints': month_complaints.count(),
                'resolved': month_resolved,
                'pending': month_pending
            })
        
        monthly_stats.reverse()  # Show oldest to newest
        
        # Category distribution
        category_stats = Complaint.objects.filter(
            officer_id__in=department_officers
        ).values(
            'Category__name'
        ).annotate(count=Count('id')).order_by('-count')
        
        category_distribution = []
        colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']
        
        for i, cat in enumerate(category_stats):
            category_distribution.append({
                'category': cat['Category__name'] or 'Uncategorized',
                'count': cat['count'],
                'color': colors[i % len(colors)]
            })
        
        # Priority distribution
        priority_stats = Complaint.objects.filter(
            officer_id__in=department_officers
        ).values(
            'priority_level'
        ).annotate(count=Count('id')).order_by('-count')
        
        priority_colors = {'High': '#EF4444', 'Medium': '#F59E0B', 'Low': '#10B981'}
        priority_distribution = []
        
        for stat in priority_stats:
            priority_distribution.append({
                'priority': stat['priority_level'],
                'count': stat['count'],
                'color': priority_colors.get(stat['priority_level'], '#6B7280')
            })
        
        # Officer performance
        officer_performance = []
        
        for officer in department_officers:
            handled = Complaint.objects.filter(officer_id=officer).count()
            resolved = Complaint.objects.filter(officer_id=officer, status='resolved').count()
            
            # Calculate average time
            resolved_with_dates = Complaint.objects.filter(
                officer_id=officer,
                status='resolved'
            )
            
            avg_time = 0
            if resolved_with_dates.exists():
                total_time = sum([
                    (timezone.now().date() - comp.current_time.date()).days 
                    for comp in resolved_with_dates
                ])
                avg_time = total_time / resolved_with_dates.count()
            
            # Calculate satisfaction (using placeholder)
            satisfaction = 85.0
            
            officer_performance.append({
                'officer': officer.get_full_name(),
                'handled': handled,
                'resolved': resolved,
                'avgTime': round(avg_time, 1),
                'satisfaction': round(satisfaction, 1)
            })
        
        performance_data = {
            'monthlyStats': monthly_stats,
            'categoryDistribution': category_distribution,
            'priorityDistribution': priority_distribution,
            'officerPerformance': officer_performance
        }
        
        return Response(performance_data)
        
    except Exception as e:
        print(f"Error in department_performance: {str(e)}")
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_department_profile(request):
    """
    Update department profile information
    """
    try:
        user = request.user
        
        # Only department heads can update profile
        department = None
        if hasattr(user, 'headed_department') and user.headed_department.exists():
            department = user.headed_department.first()
        
        if not department:
            return Response({'error': 'Only department heads can update profile'}, status=status.HTTP_403_FORBIDDEN)
        
        data = request.data
        
        # Update allowed fields
        if 'description' in data:
            department.description = data['description']
        if 'contact_email' in data:
            department.contact_email = data['contact_email']
        if 'contact_phone' in data:
            department.contact_phone = data['contact_phone']
        
        department.save()
        
        return Response({'message': 'Profile updated successfully'})
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

   