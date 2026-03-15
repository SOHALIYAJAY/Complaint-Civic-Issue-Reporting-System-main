from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.generics import ListAPIView,UpdateAPIView
from rest_framework.views import APIView
<<<<<<< HEAD
from complaints.models import Complaint,ComplaintAssignment
from complaints.serializers import ComplaintSerializer,ComplaintAssignmentSerializer
from accounts.models import CustomUser
from departments.models import Department,Officer
from departments.serializers import deptSerializer, OfficerSerializer
from rest_framework.generics import CreateAPIView
from Categories.models import Category
=======
from complaints.models import Complaint
from complaints.serializers import ComplaintSerializer
from accounts.models import CustomUser
from rest_framework.permissions import IsAuthenticated
>>>>>>> 785306c2b3d62645f40837b44265315e3df2c188

class getcomplaint(ListAPIView):
    queryset=Complaint.objects.all()
    serializer_class=ComplaintSerializer
    
    
class getcomplaintlimit(ListAPIView):
    queryset=Complaint.objects.order_by()[:3]
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

class compinfo(APIView):

    def get(self,request):
        total_comp=Complaint.objects.all().count()
        resolved_comp=Complaint.objects.filter(status='resolved').count()
        pending_comp=Complaint.objects.filter(status='Pending').count()
        # inprogress_comp=Complaint.objects.filter(status='in-progress').count()
        active_dept=10
        data={
            'total_complaints':total_comp,
            'Resolved_complaints':resolved_comp,
            'Pending_complaints':pending_comp,
            'SLA_complaince': (resolved_comp/total_comp*100) if total_comp > 0 else 0,
            # 'inprogress_complaints':inprogress_comp,
            'Active_department':active_dept
        }

        return Response(data)

@api_view(['GET'])
def complaintDetails(pk):
    compdetail=Complaint.objects.get(pk=pk)
    return Response({'compdetail':compdetail})
  
class UserDetail(APIView):
    def get(self, request):
        try:
<<<<<<< HEAD
            user_detail = CustomUser.objects.first()
            if not user_detail:
                return Response({'error': 'No users found'}, status=404)
            return Response({
                'id': user_detail.id,
                'email': user_detail.email,
                'Date': user_detail.created_join
            })
        except Exception as e:
            return Response({'error': str(e)}, status=500)

class deptinfo(ListAPIView):
    queryset=Department.objects.all()[:3]
    serializer_class=deptSerializer

class complaintinfo(APIView):
    def get(self,request):
        total_comp=Complaint.objects.all().count()
        return Response({"total_comp":total_comp})
    
class DepartmentList(ListAPIView):
    queryset=Department.objects.all()
    serializer_class=deptSerializer


class complaintofficer(CreateAPIView):
    queryset = ComplaintAssignment.objects.all()
    serializer_class = ComplaintAssignmentSerializer

    def create(self, request, *args, **kwargs):
        # Normalize incoming data: allow complaint to be sent as 'CVT-13' or numeric
        data = request.data.copy()
        comp_val = data.get('complaint')
        if comp_val is not None and not str(comp_val).isdigit():
            # attempt to extract digits from strings like 'CVT-13'
            import re
            m = re.search(r"(\d+)", str(comp_val))
            if m:
                data['complaint'] = int(m.group(1))

        # If officer provided as object or email, try to normalize to officer_id
        # (frontend sends officer primary key normally; leave as-is otherwise)

        # Use serializer with cleaned data to provide clear validation errors
        serializer = self.get_serializer(data=data)
        try:
            serializer.is_valid(raise_exception=True)
        except Exception as e:
            # Return serializer errors for easier debugging on the client
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
            in_progress_comp = Complaint.objects.filter(officer_id=officer_id, status='in-progress').count()
            
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
            return Response({'error': 'Officer not found'}, status=404)


class officerkpi(APIView):
    def get(self, request):
        total_officers = Officer.objects.all().count()
        active_officers = Officer.objects.filter(is_available=True).count()
        total_assigned = Complaint.objects.exclude(officer_id=None).count()
        resolved_comp = Complaint.objects.filter(status='resolved').count()
        total_comp = Complaint.objects.all().count()
        sla_compliance = (resolved_comp / total_comp * 100) if total_comp > 0 else 0
        
        # Count overloaded officers (more than 20 active complaints)
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
    def get(self,request):
        total_comp=Complaint.objects.all().count()
        Pending_comp=Complaint.objects.filter(status='Pending').count()
        resolved_comp=Complaint.objects.filter(status='resolved').count()
        inprogress_comp=Complaint.objects.filter(status='in-progress').count()
        sla_compliance = (resolved_comp / total_comp * 100) if total_comp > 0 else 0

        return Response({
            'total_comp': total_comp,
            'Pending_comp':Pending_comp,
            'resolved_comp':resolved_comp,
            'inprogress_comp':inprogress_comp,
            'sla_compliance': round(sla_compliance, 1)
            
        })
        
class adimncomplaints(ListAPIView):
    queryset=Complaint.objects.all()
    serializer_class=ComplaintSerializer

class officerkpi(APIView):
    def get(self, request):
        total_officers = Officer.objects.all().count()
        active_officers = Officer.objects.filter(is_available=True).count()
        total_assigned = Complaint.objects.exclude(officer_id=None).count()
        resolved_comp = Complaint.objects.filter(status='resolved').count()
        total_comp = Complaint.objects.all().count()
        sla_compliance = (resolved_comp / total_comp * 100) if total_comp > 0 else 0
        
        # Count overloaded officers (more than 20 active complaints)
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

# from rest_framework.views import APIView

class ComplaintDelete(APIView):

    def delete(self, request, pk):
        try:
            complaint = Complaint.objects.get(pk=pk)
            complaint.delete()

            return Response({
                'success': True,
                'message': f'Complaint {pk} deleted successfully'
            }, status=status.HTTP_200_OK)

        except Complaint.DoesNotExist:
            return Response({
                'success': False,
                'error': 'Complaint not found'
            }, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class Updatecomp(UpdateAPIView):
    queryset = Complaint.objects.all()
    serializer_class = ComplaintSerializer


class assigncomp(APIView):
    def create(self, validated_data):     
        assignment = ComplaintAssignment.objects.create(**validated_data)
        # Update the complaint's officer_id field
        complaint = assignment.complaint
        complaint.officer_id = assignment.officer
        # Mark complaint as assigned using the boolean field
        try:
            complaint.is_assignd = True
        except Exception:
            # If field isn't available for some reason, leave as-is
            pass
        complaint.save()
        return assignment


class crateofficer(CreateAPIView):
    queryset=Officer.objects.all()
    serializer_class=OfficerSerializer

class CategoriesList(APIView):
    def get(self,request):
        categories = Category.objects.all()
        categoinfo = [
            {'id': c.id, 'name': c.name, 'code': c.code, 'department': c.department, 'total_comp': c.total_comp}
            for c in categories
        ]
        return Response(categoinfo)
=======
            # Get user from token if authenticated, otherwise get first user
            if request.user and request.user.is_authenticated:
                user_detail = request.user
            else:
                user_detail = CustomUser.objects.first()
            
            if not user_detail:
                return Response({'error': 'No user found'}, status=404)
            
            return Response({
                'id': user_detail.id,
                'Username': user_detail.username or user_detail.email.split('@')[0],
                'email': user_detail.email,
                'Date': user_detail.date_joined.strftime('%Y-%m-%d') if hasattr(user_detail, 'date_joined') else None
            })
        except Exception as e:
            return Response({'error': str(e)}, status=500)
>>>>>>> 785306c2b3d62645f40837b44265315e3df2c188
