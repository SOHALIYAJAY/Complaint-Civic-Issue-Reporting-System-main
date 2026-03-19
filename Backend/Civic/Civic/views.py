from django.shortcuts import render
from django.http import JsonResponse
import traceback
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView, CreateAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count
from complaints.models import Complaint
from Categories.models import Category
from accounts.models import CustomUser
from departments.models import Department, Officer
from departments.serializers import deptSerializer, OfficerSerializer
from Categories.serializers import ComplaintCategorySerializer
from complaints.serializers import ComplaintSerializer,ComplaintAssignmentSerializer
from complaints.models import ComplaintAssignment
from django.db.models import Count
from django.db.models.functions import ExtractMonth, ExtractYear
import calendar
from datetime import datetime


class getcomplaint(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ComplaintSerializer

    def get_queryset(self):
        return Complaint.objects.filter(user=self.request.user)


class getcomplaintlimit(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ComplaintSerializer
    def get_queryset(self):
        return Complaint.objects.filter(user=self.request.user).order_by('-id')[:3]


class getpubliccomplaints(ListAPIView):
    serializer_class = ComplaintSerializer
    
    def get_queryset(self):
        return Complaint.objects.all().order_by('-id')[:10]



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def complaintsinfo(request):
    total_comp = Complaint.objects.filter(user=request.user).count()
    resolved_comp = Complaint.objects.filter(status='resolved' , user=request.user).count()
    pending_comp = Complaint.objects.filter(status='Pending' , user=request.user).count()
    inprogress_comp = Complaint.objects.filter(status='iin-progress' , user=request.user).count()
    
    return Response({
        'total_comp': total_comp,
        'resolved_comp': resolved_comp,
        'pending_comp': pending_comp,
        'inprogress_comp': inprogress_comp
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def recent_complaints_admin(request):
    """
    Get recent complaints for admin dashboard (maximum 6)
    """
    try:
        # Get 6 most recent complaints ordered by current_time (most recent first)
        recent_complaints = Complaint.objects.all().order_by('-current_time')[:6]
        
        # Serialize the complaints
        serializer = ComplaintSerializer(recent_complaints, many=True)
        
        return Response({
            'success': True,
            'data': serializer.data,
            'count': len(serializer.data)
        })
        
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e),
            'message': 'Failed to fetch recent complaints'
        }, status=500)


class compinfo(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self,request):
        total_comp = Complaint.objects.filter(user=self.request.user).count()
        resolved_comp = Complaint.objects.filter(status='resolved', user=self.request.user).count()
        pending_comp = Complaint.objects.filter(status='Pending',user=self.request.user).count()
        In_progress_comp = Complaint.objects.filter(status='iin-progress',user=self.request.user).count()
        total_categories = Category.objects.all().count()
        return Response({
            'total_complaints': total_comp,
            'Resolved_complaints': resolved_comp,
            'Pending_complaints': pending_comp,
            'SLA_complaince': (resolved_comp / total_comp * 100) if total_comp > 0 else 0,
            'in_progress_complaints': In_progress_comp,
            'total_categories': total_categories
        })


@api_view(['GET'])
def complaintDetails(request, pk):
    try:
        compdetail = Complaint.objects.get(pk=pk)
    except Complaint.DoesNotExist:
        return Response({'error': 'Complaint not found'}, status=status.HTTP_404_NOT_FOUND)
    serializer = ComplaintSerializer(compdetail)
    return Response({'compdetail': serializer.data})


class UserDetail(APIView):
    def get(self, request):
        try:
         
            if hasattr(request, 'user') and request.user.is_authenticated:
                user_detail = request.user
            else:
                user_detail = CustomUser.objects.first()
            
            if not user_detail:
                return Response({
                    'error': 'No users found',
                    'message': 'Please create a user account first'
                }, status=404)
            
            return Response({
                'id': user_detail.id,
                'email': user_detail.email,
                'username': getattr(user_detail, 'username', ''),
                'first_name': getattr(user_detail, 'first_name', ''),
                'last_name': getattr(user_detail, 'last_name', ''),
                'created_join': getattr(user_detail, 'created_join', None),
                'is_staff': getattr(user_detail, 'is_staff', False),
                'is_superuser': getattr(user_detail, 'is_superuser', False)
            })
            
        except Exception as e:
            print(f"UserDetail error: {e}")  # Debug print
            return Response({
                'error': str(e),
                'message': 'Failed to fetch user details'
            }, status=500)


class ComplaintStatusStats(APIView):
    def get(self, request):
        try:
            complaints = Complaint.objects.fitler(user=self.request.user)
            
            # Count complaints by status
            status_counts = {
                'open': complaints.filter(status='Pending',user=self.request.user).count(),
                'in_progress': complaints.filter(status='iin-progress',user=self.request.user).count(),
                'resolved': complaints.filter(status='resolved',user=self.request.user).count(),
                'pending': complaints.filter(status='Pending',user=self.request.user).count()
            }
            
            return Response(status_counts)
            
        except Exception as e:
            return Response({
                'error': str(e),
                'message': 'Failed to fetch complaint status statistics'
            }, status=500)


class ComplaintMonthlyStats(APIView):
    def get(self, request):
        try:
            from django.db.models import Count
            from django.db.models.functions import ExtractMonth
            import calendar
            
            # Get monthly complaint counts
            monthly_data = {}
            
            # Initialize all months with 0
            for month_num in range(1, 13):
                month_name = calendar.month_name[month_num]
                monthly_data[month_name] = 0
            
            # Count complaints by month (using current_time field instead of created_at)
            complaints_by_month = (
                Complaint.objects
                .annotate(month=ExtractMonth('current_time'))
                .values('month')
                .annotate(count=Count('id'))
                .order_by('month')
            )
            
            # Fill in actual counts
            for item in complaints_by_month:
                month_name = calendar.month_name[item['month']]
                monthly_data[month_name] = item['count']
            
            return Response(monthly_data)
            
        except Exception as e:
            return Response({
                'error': str(e),
                'message': 'Failed to fetch monthly complaint statistics'
            }, status=500)


class DepartmentDashboardStats(APIView):
    def get(self, request):
        try:
            complaints = Complaint.objects.all()
            
            # Calculate statistics
            total = complaints.count()
            pending = complaints.filter(status='Pending').count()
            in_progress = complaints.filter(status='iin-progress').count()
            resolved = complaints.filter(status='resolved').count()
            
            # Calculate performance metrics
            resolved_complaints = complaints.filter(status='resolved')
            avg_resolution_time = 4.2  # Mock data - calculate from actual timestamps
            sla_compliance = 87.5  # Mock data - calculate from SLA requirements
            officer_workload = 12  # Mock data - calculate from assignments
            citizen_satisfaction = 4.3  # Mock data - from feedback system
            
            # Get recent complaints
            recent = complaints.order_by('-current_time')[:5]
            recent_data = []
            for comp in recent:
                recent_data.append({
                    'id': comp.id,
                    'title': comp.title,
                    'description': comp.Description,
                    'status': comp.status,
                    'priority': comp.priority_level,
                    'current_time': comp.current_time,
                    'location_address': comp.location_address,
                    'Category': str(comp.Category) if comp.Category else ''
                })
            
            # Get recent activity (mock data for now)
            recent_activity = [
                {
                    'id': '1',
                    'type': 'complaint',
                    'description': f'New complaint: {recent[0].title if recent else "Street Light Issue"}',
                    'time': '2 hours ago',
                    'officer': 'John Doe'
                },
                {
                    'id': '2',
                    'type': 'resolution',
                    'description': f'Complaint #{recent[1].id if len(recent) > 1 else "1234"} resolved by Jane Smith',
                    'time': '3 hours ago'
                },
                {
                    'id': '3',
                    'type': 'assignment',
                    'description': f'Officer assigned to complaint #{recent[2].id if len(recent) > 2 else "1235"}',
                    'time': '5 hours ago'
                }
            ]
            
            return Response({
                'stats': {
                    'total': total,
                    'pending': pending,
                    'inProgress': in_progress,
                    'resolved': resolved
                },
                'performance': {
                    'avgResolutionTime': avg_resolution_time,
                    'slaCompliance': sla_compliance,
                    'officerWorkload': officer_workload,
                    'citizenSatisfaction': citizen_satisfaction
                },
                'recentComplaints': recent_data,
                'recentActivity': recent_activity
            })
            
        except Exception as e:
            return Response({
                'error': str(e),
                'message': 'Failed to fetch department dashboard statistics'
            }, status=500)


class deptinfo(ListAPIView):
    queryset = Department.objects.all()[:3]
    serializer_class = deptSerializer


class complaintinfo(APIView):
    def get(self, request):
        total_comp = Complaint.objects.all().count()
        return Response({"total_comp": total_comp})


class DepartmentList(ListAPIView):
    queryset = Department.objects.all()
    serializer_class = deptSerializer


class complaintofficer(CreateAPIView):
    queryset = ComplaintAssignment.objects.all()
    serializer_class = ComplaintAssignmentSerializer

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        comp_val = data.get('complaint')
        if comp_val is not None and not str(comp_val).isdigit():
            m = re.search(r"(\d+)", str(comp_val))
            if m:
                data['complaint'] = int(m.group(1))

        serializer = self.get_serializer(data=data)
        try:
            serializer.is_valid(raise_exception=True)
        except Exception:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class officerprofile(APIView):
    def get(self, request, officer_id):
        try:
            officer = Officer.objects.get(officer_id=officer_id)
            officer_serializer = OfficerSerializer(officer)

            resolved_comp = Complaint.objects.filter(officer_id=officer_id, status='resolved').count()
            total_comp = Complaint.objects.filter(officer_id=officer_id).count()
            pending_comp = Complaint.objects.filter(officer_id=officer_id, status='Pending').count()
            in_progress_comp = Complaint.objects.filter(officer_id=officer_id, status='iin-progress').count()

            assigned_complaints = Complaint.objects.filter(officer_id=officer_id)
            complaints_serializer = ComplaintSerializer(assigned_complaints, many=True)

            return Response({
                'officer': officer_serializer.data,
                'resolved_comp': resolved_comp,
                'total_comp': total_comp,
                'pending_comp': pending_comp,
                'in_progress_comp': in_progress_comp,
                'assigned_complaints': complaints_serializer.data
            })
        except Officer.DoesNotExist:
            return Response({'error': 'Officer not found'}, status=status.HTTP_404_NOT_FOUND)


class officerkpi(APIView):
    def get(self, request):
        total_officers = Officer.objects.all().count()
        active_officers = Officer.objects.filter(is_available=True).count()
        total_assigned = Complaint.objects.exclude(officer_id=None).count()
        resolved_comp = Complaint.objects.filter(status='resolved').count()
        total_comp = Complaint.objects.all().count()
        sla_compliance = (resolved_comp / total_comp * 100) if total_comp > 0 else 0

        overloaded = 0
        for officer in Officer.objects.all():
            active_count = Complaint.objects.filter(officer_id=officer.officer_id).exclude(status='resolved').count()
            if active_count > 20:
                overloaded += 1

        return Response({
            'total_officers': total_officers,
            'active_officers': active_officers,
            'total_assigned': total_assigned,
            'sla_compliance': round(sla_compliance, 1),
            'overloaded': overloaded
        })


class adminallcomplaintcart(APIView):
    def get(self, request):
        total_comp = Complaint.objects.all().count()
        Pending_comp = Complaint.objects.filter(status='Pending').count()
        resolved_comp = Complaint.objects.filter(status='resolved').count()
        inprogress_comp = Complaint.objects.filter(status='iin-progress').count()
        sla_compliance = (resolved_comp / total_comp * 100) if total_comp > 0 else 0

        return Response({
            'total_comp': total_comp,
            'Pending_comp': Pending_comp,
            'resolved_comp': resolved_comp,
            'inprogress_comp': inprogress_comp,
            'sla_compliance': round(sla_compliance, 1)
        })


class adimncomplaints(ListAPIView):
    queryset = Complaint.objects.all()
    serializer_class = ComplaintSerializer


class ComplaintDelete(APIView):
    def delete(self, request, pk):
        try:
            complaint = Complaint.objects.get(pk=pk)
            complaint.delete()
            return Response({'success': True, 'message': f'Complaint {pk} deleted successfully'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'success': False, 'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class Updatecomp(APIView):
    def patch(self, request, pk):
        try:
            complaint = Complaint.objects.get(pk=pk)
        except Complaint.DoesNotExist:
            return Response({'error': 'Complaint not found'}, status=status.HTTP_404_NOT_FOUND)

        allowed = ['title', 'Description', 'priority_level', 'status', 'location_address', 'location_District', 'location_taluk']
        data = {k: v for k, v in request.data.items() if k in allowed}

        serializer = ComplaintSerializer(complaint, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, 'data': serializer.data}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class assigncomp(APIView):
    def post(self, request, pk):
        try:
            complaint = Complaint.objects.get(pk=pk)
            officer_id = request.data.get('officer_id')
            officer = Officer.objects.get(officer_id=officer_id)
            complaint.officer_id = officer
            complaint.save()
            return Response({'success': True}, status=status.HTTP_200_OK)
        except Complaint.DoesNotExist:
            return Response({'error': 'Complaint not found'}, status=status.HTTP_404_NOT_FOUND)
        except Officer.DoesNotExist:
            return Response({'error': 'Officer not found'}, status=status.HTTP_404_NOT_FOUND)


class crateofficer(CreateAPIView):
    queryset = Officer.objects.all()
    serializer_class = OfficerSerializer


class CategoriesList(APIView):
    def get(self, request):
        categories = Category.objects.all()
        categoinfo = [
            {'id': c.id, 'name': c.name, 'code': c.code, 'department': c.department, 'total_comp': c.total_comp}
            for c in categories
        ]
        return Response(categoinfo)

    def post(self, request):
        serializer = ComplaintCategorySerializer(data=request.data)
        if serializer.is_valid():
            category = serializer.save()
            return Response(
                {'id': category.id, 'name': category.name, 'code': category.code, 'department': category.department, 'total_comp': category.total_comp},
                status=status.HTTP_201_CREATED
            )
        return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

 
 
class CategoryDelete(APIView):
    def delete(self, request, pk):
        try:
            category = Category.objects.get(pk=pk)
            category.delete()
            return Response({'success': True, 'message': f'Category {pk} deleted'}, status=status.HTTP_200_OK)
        except Category.DoesNotExist:
            return Response({'error': 'Category not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class CategoryUpdate(APIView):

    def patch(self, request, pk):
        try:
            category = Category.objects.get(pk=pk)
        except Category.DoesNotExist:
            return Response({'error': 'Category not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = ComplaintCategorySerializer(category, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, 'data': serializer.data}, status=status.HTTP_200_OK)
        return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class adminstats(APIView):
    def get(self, request):
        return Response({
            'total_users': CustomUser.objects.all().count(),
            'total_categories': Category.objects.all().count(),
            'total_officers': Officer.objects.all().count(),
        })


class admindashboardcard(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            # Get all complaints statistics
            total_complaints = Complaint.objects.all().count()
            resolved_complaints = Complaint.objects.filter(status='resolved').count()
            pending_complaints = Complaint.objects.filter(status='Pending').count()
            inprogress_complaints = Complaint.objects.filter(status='iin-progress').count()
            
            return Response({
                'total_complaints': total_complaints,
                'resolved_complaints': resolved_complaints,
                'pending_complaints': pending_complaints,
                'inprogress_complaints': inprogress_complaints,
                'total_comp': total_complaints,
                'resolved_comp': resolved_complaints,
                'Pending_comp': pending_complaints,
                'inprogress_comp': inprogress_complaints
            })
        except Exception as e:
            return Response({
                'error': str(e),
                'message': 'Failed to fetch dashboard statistics'
            }, status=500)


class UserRoleDistribution(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            # Get user role distribution using correct role names from CustomUser model
            regular_users = CustomUser.objects.filter(User_Role='Civic-User').count()
            officers = CustomUser.objects.filter(User_Role='Department-User').count()
            admins = CustomUser.objects.filter(User_Role='Admin-User').count()
            
            return Response({
                'regular_users': regular_users,
                'officers': officers,
                'admins': admins
            })
        except Exception as e:
            return Response({
                'error': str(e),
                'message': 'Failed to fetch user role distribution'
            }, status=500)


class ComplaintStatusTrends(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            # Get monthly complaint trends for the last 6 months
            from django.db.models import Count
            from django.utils import timezone
            from datetime import timedelta
            
            # Calculate date ranges
            end_date = timezone.now()
            start_date = end_date - timedelta(days=180)
            
            # Get monthly complaint counts
            monthly_data = []
            for i in range(6):
                month_start = start_date + timedelta(days=30*i)
                month_end = month_start + timedelta(days=30)
                
                month_name = month_start.strftime('%b')
                total_count = Complaint.objects.filter(
                    created_at__gte=month_start,
                    created_at__lt=month_end
                ).count()
                
                monthly_data.append({
                    'month': month_name,
                    'complaints': total_count
                })
            
            return Response(monthly_data)
        except Exception as e:
            return Response({
                'error': str(e),
                'message': 'Failed to fetch complaint trends'
            }, status=500)


class CivicUserActivityView(APIView):
    def get(self, request):
        try:
            # Get user from request
            user = request.user
            if not user.is_authenticated:
                return Response({'error': 'Authentication required'}, status=401)
            
            # Get user's complaints
            user_complaints = Complaint.objects.filter(user=user).order_by('-created_at')[:10]
            
            # Create activity data from user's complaints
            activities = []
            for complaint in user_complaints:
                activity = {
                    'id': f'complaint_{complaint.id}',
                    'type': 'submitted' if complaint.status == 'Pending' else 'updated' if complaint.status == 'iin-progress' else 'resolved',
                    'title': f'Complaint {complaint.status}',
                    'description': complaint.title or 'No description available',
                    'timestamp': complaint.current_time.isoformat(),
                }
                activities.append(activity)
            
            # Add login activity
            activities.append({
                'id': 'login_recent',
                'type': 'login',
                'title': 'Login',
                'description': f'Successfully logged in as {user.username}',
                'timestamp': timezone.now().isoformat(),
            })
            
            # Sort by timestamp (most recent first)
            activities.sort(key=lambda x: x['timestamp'], reverse=True)
            
            return Response({
                'data': activities[:10]  # Return only 10 most recent activities
            })
            
        except Exception as e:
            return Response({
                'error': str(e),
                'message': 'Failed to fetch user activity'
            }, status=500)

class CategoryList(ListAPIView):
    queryset=Category.objects.all()
    serializer_class=ComplaintCategorySerializer
    
    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            serializer = self.get_serializer(queryset, many=True)
            
            # Add complaint counts to each category
            categories_with_counts = []
            for category in serializer.data:
                complaint_count = Complaint.objects.filter(Category_id=category['id']).count()
                categories_with_counts.append({
                    'id': category['id'],
                    'name': category['name'],
                    'code': category['code'],
                    'department': category['department'],
                    'total_comp': complaint_count
                })
            
            return Response(categories_with_counts)
        except Exception as e:
            print(f"Error in CategoryList: {str(e)}")
            return Response([])

class TotalCategories(APIView):
    def get(self, request):
        try:
            print("DEBUG: TotalCategories endpoint called")
            
            # Get all categories and count complaints for each
            categories = Category.objects.all()
            result = []
            
            for category in categories:
                # Count complaints using the foreign key relationship
                count = Complaint.objects.filter(Category_id=category.id).count()
                result.append({
                    'name': category.name,
                    'total_comp': count
                })
                print(f"DEBUG: Category '{category.name}' has {count} complaints")
            
            print(f"DEBUG: Returning {len(result)} categories")
            return Response(result)
            
        except Exception as e:
            print(f"Error in TotalCategories: {str(e)}")
            import traceback
            traceback.print_exc()
            # Return empty list on error to prevent frontend crashes
            return Response([])

class TestCategories(APIView):
    def get(self, request):
        """Simple test endpoint to verify frontend-backend connection"""
        try:
            print("DEBUG: TestCategories endpoint called")
            
            # Return some hardcoded test data first
            test_data = [
                {'name': 'Roads & Infrastructure', 'total_comp': 25},
                {'name': 'Water Supply', 'total_comp': 18},
                {'name': 'Sanitation', 'total_comp': 12},
                {'name': 'Street Lighting', 'total_comp': 8},
                {'name': 'Drainage', 'total_comp': 6}
            ]
            
            print(f"DEBUG: Returning test data: {test_data}")
            return Response(test_data)
            
        except Exception as e:
            print(f"ERROR in TestCategories: {str(e)}")
            return Response([], status=500)

class TrackComplaint(APIView):
    def get(self, request, pk=None):
        try:
            complaint = Complaint.objects.get(id=pk)
            serializer = ComplaintSerializer(complaint)
            return Response({
                'success': True,
                'data': serializer.data
            })
        except Complaint.DoesNotExist:
            return Response({
                'success': False,
                'error': 'Complaint not found'
            }, status=404)
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=500)

class ComplaintMonthWise(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self,request):
        # Check if user is authenticated
        if not request.user or not request.user.is_authenticated:
            return Response({
                'error': 'Authentication required'
            }, status=401)
            
        month={1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0,11:0,12:0}
        try:
            for i in month:
                month[i]=Complaint.objects.filter(current_time__month=i,user=request.user).count()
            return Response(month)
        except Exception as e:
            print(f"Error in ComplaintMonthWise: {e}")
            # Return default values if there's an error
            return Response({1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0,11:0,12:0})

class ComplaintStatus(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            # Check if user is authenticated
            if not request.user or not request.user.is_authenticated:
                return Response({
                    'error': 'Authentication required'
                }, status=401)
                
            status_counts = {
                'Pending': Complaint.objects.filter(status='Pending', user=request.user).count(),
                'In Progress': Complaint.objects.filter(status='iin-progress', user=request.user).count(),
                'Resolved': Complaint.objects.filter(status='resolved', user=request.user).count(),
                'Rejected': Complaint.objects.filter(status='rejected', user=request.user).count(),
            }
            return Response(status_counts)
        except Exception as e:
            print(f"Error in ComplaintStatus: {e}")
            # Return default values if there's an error
            return Response({
                'Pending': 0,
                'In Progress': 0,
                'Resolved': 0,
                'Rejected': 0
            })

class OfficerDelete(APIView):
    def delete(self, request, pk=None):
        try:
            from departments.models import Officer
            officer = Officer.objects.get(officer_id=pk)
            officer.delete()
            return Response({
                'success': True,
                'message': 'Officer deleted successfully'
            })
        except Officer.DoesNotExist:
            return Response({
                'success': False,
                'error': 'Officer not found'
            }, status=404)
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=500)

class OfficerUpdate(APIView):
    def put(self, request, pk=None):
        try:
            from departments.models import Officer
            officer = Officer.objects.get(officer_id=pk)
            
            # Update fields
            officer.name = request.data.get('name', officer.name)
            officer.email = request.data.get('email', officer.email)
            officer.phone = request.data.get('phone', officer.phone)
            officer.is_available = request.data.get('is_available', officer.is_available)
            
            officer.save()
            
            return Response({
                'success': True,
                'message': 'Officer updated successfully',
                'data': {
                    'officer_id': officer.officer_id,
                    'name': officer.name,
                    'email': officer.email,
                    'phone': officer.phone,
                    'is_available': officer.is_available
                }
            })
        except Officer.DoesNotExist:
            return Response({
                'success': False,
                'error': 'Officer not found'
            }, status=404)
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=500)

class AdminUserStats(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            # Get user statistics
            total_users = CustomUser.objects.all().count()
            active_users = CustomUser.objects.filter(is_active=True).count()
            inactive_users = total_users - active_users
            
            # Get role distribution using correct role names
            civic_users = CustomUser.objects.filter(User_Role='Civic-User').count()
            department_users = CustomUser.objects.filter(User_Role='Department-User').count()
            admin_users = CustomUser.objects.filter(User_Role='Admin-User').count()
            
            # Get total complaints count
            total_complaints = Complaint.objects.all().count()
            
            return Response({
                'totalUsers': total_users,
                'activeUsers': active_users,
                'inactiveUsers': inactive_users,
                'totalComplaints': total_complaints,
                'roleDistribution': [
                    { 'name': 'Civic User', 'value': civic_users, 'color': '#8b5cf6' },
                    { 'name': 'Department User', 'value': department_users, 'color': '#10b981' },
                    { 'name': 'Admin User', 'value': admin_users, 'color': '#ef4444' }
                ]
            })
        except Exception as e:
            return Response({
                'error': str(e),
                'message': 'Failed to fetch user statistics'
            }, status=500)


class ComplaintPriorityDistribution(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            # Get complaint distribution by priority
            high_priority = Complaint.objects.filter(priority_level='High').count()
            medium_priority = Complaint.objects.filter(priority_level='Medium').count()
            low_priority = Complaint.objects.filter(priority_level='Low').count()
            
            # Get complaint distribution by status
            pending_status = Complaint.objects.filter(status='Pending').count()
            inprogress_status = Complaint.objects.filter(status='iin-progress').count()
            resolved_status = Complaint.objects.filter(status='resolved').count()
            
            # Get monthly complaint trends (last 6 months)
            from django.db.models import Count
            from django.utils import timezone
            from datetime import timedelta
            
            end_date = timezone.now()
            monthly_trends = []
            
            for i in range(6):
                start_date = end_date - timedelta(days=30)
                month_name = start_date.strftime('%B %Y')
                
                month_complaints = Complaint.objects.filter(
                    current_time__gte=start_date,
                    current_time__lt=end_date
                ).count()
                
                monthly_trends.append({
                    'month': month_name,
                    'complaints': month_complaints
                })
                
                end_date = start_date
            
            return Response({
                'priority_distribution': [
                    { 'name': 'High Priority', 'value': high_priority, 'color': '#ef4444' },
                    { 'name': 'Medium Priority', 'value': medium_priority, 'color': '#f59e0b' },
                    { 'name': 'Low Priority', 'value': low_priority, 'color': '#10b981' }
                ],
                'status_distribution': [
                    { 'name': 'Pending', 'value': pending_status, 'color': '#f59e0b' },
                    { 'name': 'In Progress', 'value': inprogress_status, 'color': '#3b82f6' },
                    { 'name': 'Resolved', 'value': resolved_status, 'color': '#10b981' }
                ],
                'monthly_trends': monthly_trends
            })
            
        except Exception as e:
            return Response({
                'error': str(e),
                'message': 'Failed to fetch complaint distribution data'
            }, status=500)


class OfficerAnalytics(APIView):
    def get(self, request):
        try:
            from departments.models import Officer
            from django.db.models import Count, Q
            
            # Total officers
            total_officers = Officer.objects.count()
            
            # Available vs Unavailable
            available_officers = Officer.objects.filter(is_available=True).count()
            unavailable_officers = total_officers - available_officers
            
            # Officers with active complaints
            officers_with_complaints = Complaint.objects.filter(
                officer_id__isnull=False,
                status__in=['Pending', 'iin-progress']
            ).values('officer_id').distinct().count()
            
            # Department distribution
            department_stats = {}
            for officer in Officer.objects.all():
                # Get complaints assigned to this officer
                complaint_count = Complaint.objects.filter(
                    officer_id=officer.officer_id,
                    status__in=['Pending', 'iin-progress']
                ).count()
                
                # Get department from complaints (assuming each officer belongs to a department)
                complaints = Complaint.objects.filter(officer_id=officer.officer_id)
                if complaints.exists():
                    # Get department from the first complaint's category
                    dept = complaints.first().Category
                    if dept:
           
                        dept_name = dept.name
                        if dept_name not in department_stats:
                            department_stats[dept_name] = {
                                'officers': 0,
                                'active_complaints': 0
                            }
                        department_stats[dept_name]['officers'] += 1
                        department_stats[dept_name]['active_complaints'] += complaint_count
            
            # Workload distribution
            workload_data = []
            for officer in Officer.objects.all():
                # Count all assigned complaints (both active and resolved)
                total_assigned = Complaint.objects.filter(officer_id=officer.officer_id).count()
                # Count only active complaints
                active_complaints = Complaint.objects.filter(
                    officer_id=officer.officer_id,
                    status__in=['Pending', 'iin-progress']
                ).count()
                
                workload_data.append({
                    'officer_id': officer.officer_id,
                    'name': officer.name,
                    'total_assigned': total_assigned,
                    'active_complaints': active_complaints,
                    'resolved_complaints': total_assigned - active_complaints,
                    'is_available': officer.is_available
                })
            
            return Response({
                'total_officers': total_officers,
                'available_officers': available_officers,
                'unavailable_officers': unavailable_officers,
                'officers_with_complaints': officers_with_complaints,
                'department_stats': department_stats,
                'workload_data': workload_data,
                'availability_percentage': round((available_officers / total_officers) * 100, 1) if total_officers > 0 else 0
            })
            
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=500)

class Logout(APIView):
    def post(self, request):
        try:
            # Clear session data
            if hasattr(request, 'session'):
                request.session.flush()
            
            # Clear any authentication tokens
            response = Response({
                'success': True,
                'message': 'Logged out successfully'
            })
            
            # Clear cookies if any
            response.delete_cookie('sessionid')
            response.delete_cookie('csrftoken')
            
            return response
            
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=500)
            

class ComplaintInDetail(APIView):
    def get(self, request, pk=None):
        try:
            if pk:
                # Return specific complaint details
                comp = Complaint.objects.get(pk=pk)
                return Response({
                    'id': comp.id,
                    'comp_name': comp.title,
                    'filed_on': comp.current_time,
                    'description': comp.Description,
                    'upload_image': comp.image_video,
                    'status': comp.status,
                    'priority': comp.priority_level,
                    'location_address': comp.location_address,
                    'location_district': comp.location_District,
                    'location_taluk': comp.location_taluk,
                    'officer_id': comp.officer_id
                })
            else:
                # Return all complaints with basic details
                complaints = Complaint.objects.all()
                complaint_list = []
                for comp in complaints:
                    complaint_list.append({
                        'id': comp.id,
                        'comp_name': comp.title,
                        'filed_on': comp.current_time,
                        'description': comp.Description,
                        'upload_image': comp.image_video,
                        'status': comp.status,
                        'priority': comp.priority_level,
                        'location_address': comp.location_address,
                        'location_district': comp.location_District,
                        'location_taluk': comp.location_taluk,
                        'officer_id': comp.officer_id
                    })
                return Response(complaint_list)
        except Complaint.DoesNotExist:
            return Response({'error': 'Complaint not found'}, status=404)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
        
    
class UserDistrictWise(APIView):
    def get(self,request):
        districthwise={
            'Ahmedabad':0,'Amreli':0,'Anand':0,'Aravalli':0,'Banaskantha':0,'Bharuch':0,'Bhavnagar':0,'Botad':0,
            'Chhota Udaipur':0,'Dahod':0,'Dang':0,'Devbhoomi Dwarka':0,'Gandhinagar':0,'Gir Somnath':0,
            'Jamnagar':0,'Junagadh':0,'Kachchh':0,'Kheda':0,'Mahisagar':0,'Mehsana':0,'Morbi':0,'Narmada':0,
            'Navsari':0,'Palanpur':0,'Patan':0,'Porbandar':0,'Rajkot':0,'Sabarkantha':0,'Surat':0,'Surendranagar':0,
            'Tapi':0,'Vadodara':0,'Valsad':0,'Vav-Tharad':0
        }

        for dist in districthwise:
            districthwise[dist]=CustomUser.objects.filter(District=dist).count()
        return Response(districthwise)


class UserMonthlyRegistrations(APIView):
    def get(self, request):
        try:
            
            # Get current year
            current_year = datetime.now().year
            
            # Initialize monthly data for current year
            monthly_data = {}
            for month_num in range(1, 13):
                month_name = calendar.month_name[month_num]
                monthly_data[month_name] = 0
            
            # Count user registrations by month for current year
            users_by_month = (
                CustomUser.objects
                .filter(created_join__year=current_year)
                .annotate(month=ExtractMonth('created_join'))
                .values('month')
                .annotate(count=Count('id'))
                .order_by('month')
            )
            
            # Fill in actual counts
            for item in users_by_month:
                month_name = calendar.month_name[item['month']]
                monthly_data[month_name] = item['count']
            
            return Response({
                'year': current_year,
                'monthly_data': monthly_data,
                'total_registrations': CustomUser.objects.filter(created_join__year=current_year).count()
            })
            
        except Exception as e:
            return Response({
                'error': str(e),
                'message': 'Failed to fetch monthly user registration statistics'
            }, status=500)