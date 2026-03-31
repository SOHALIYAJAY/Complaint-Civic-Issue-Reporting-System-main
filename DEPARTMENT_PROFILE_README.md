# Department Profile System

A fully functional Department Profile management system with real database integration for the Civic Issue Reporting System.

## 🚀 Features

### Frontend Features
- **Real-time Data**: Live data from database (no dummy data)
- **Department Overview**: Complete department statistics and information
- **Officer Management**: View all officers with performance metrics
- **Complaint Tracking**: Real-time complaint statistics and status
- **Performance Analytics**: Charts and metrics for department performance
- **Profile Editing**: Department heads can update department information
- **Responsive Design**: Works on all devices

### Backend Features
- **RESTful APIs**: Complete API endpoints for all operations
- **Authentication**: Secure token-based authentication
- **Database Integration**: Real data from Django models
- **Performance Metrics**: Calculated statistics from actual data
- **Error Handling**: Comprehensive error handling and logging
- **Security**: Role-based access control

## 📁 File Structure

### Frontend Files
```
Frontend/app/department/profile/
├── page.tsx                 # Main department profile page
└── components/              # Reusable components
```

### Backend Files
```
Backend/Civic/departments/
├── views.py                 # API endpoints
├── models.py               # Database models
├── serializers.py          # Data serializers
└── urls.py                 # URL routing
```

## 🔧 API Endpoints

### 1. Department Profile
```
GET /api/department/profile/
```
- Returns complete department profile information
- Includes statistics (officers, complaints, performance)
- Authentication required

### 2. Department Officers
```
GET /api/department/officers/
```
- Returns list of all officers in the department
- Includes performance metrics for each officer
- Authentication required

### 3. Department Complaints
```
GET /api/department/complaints/
```
- Returns all complaints assigned to the department
- Includes complaint details and status
- Authentication required

### 4. Department Performance
```
GET /api/department/performance/
```
- Returns performance metrics and analytics
- Includes monthly statistics, categories, priorities
- Authentication required

### 5. Update Department Profile
```
PUT /api/department/update-profile/
```
- Updates department information
- Only accessible by department heads
- Authentication required

## 🗄️ Database Models

### Department Model
```python
class Department(models.Model):
    name = models.CharField(max_length=200)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    description = models.TextField(blank=True)
    contact_email = models.EmailField()
    contact_phone = models.CharField(max_length=15)
    head_officer = models.ForeignKey(CustomUser, on_delete=models.SET_NULL)
    officers = models.ManyToManyField(CustomUser, related_name='departments')
    created_at = models.DateTimeField(auto_now_add=True)
```

### Related Models
- **CustomUser**: User accounts and authentication
- **Complaint**: Complaint records and status
- **Officer**: Officer information and assignments

## 📊 Features in Detail

### Department Statistics
- **Total Officers**: Number of officers in department
- **Active Complaints**: Pending and in-progress complaints
- **Resolved Complaints**: Successfully resolved complaints
- **Average Resolution Time**: Mean time to resolve complaints
- **Satisfaction Rate**: Citizen satisfaction percentage
- **Performance Score**: Overall department performance metric

### Officer Performance
- **Complaints Handled**: Total complaints assigned to officer
- **Resolution Rate**: Percentage of complaints resolved
- **Average Resolution Time**: Mean time per complaint
- **Satisfaction Rate**: Citizen satisfaction with officer
- **Performance Score**: Individual officer performance

### Analytics Charts
- **Monthly Statistics**: Complaint trends over 6 months
- **Category Distribution**: Complaints by category
- **Priority Distribution**: Complaints by priority level
- **Officer Performance**: Comparative officer metrics

## 🔐 Authentication & Security

### Token-Based Authentication
- JWT tokens for secure API access
- Token expiration and refresh
- Role-based access control

### Permissions
- **Department Heads**: Can view and edit department profile
- **Officers**: Can view department information
- **Admin Users**: Full access to all departments

## 🚀 Getting Started

### Prerequisites
- Django backend running
- Database configured and populated
- Frontend development server running

### Backend Setup
1. Ensure Django models are migrated:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

2. Create superuser and test data:
   ```bash
   python manage.py createsuperuser
   ```

3. Start Django server:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup
1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Navigate to `/department/profile`

## 🧪 Testing

### Automated Testing
Run the test script to verify all API endpoints:
```bash
python test_department_profile.py
```

### Manual Testing
1. Login as a department user
2. Navigate to Department Profile page
3. Verify all data loads correctly
4. Test profile editing (if department head)

## 📝 API Response Examples

### Department Profile Response
```json
{
  "id": 1,
  "name": "Sanitation Department",
  "description": "Responsible for waste management...",
  "head": "Dr. Rajesh Kumar",
  "email": "sanitation@civic.gov.in",
  "phone": "+91 98765 43210",
  "totalOfficers": 15,
  "activeComplaints": 25,
  "resolvedComplaints": 150,
  "avgResolutionTime": 3.2,
  "satisfactionRate": 85.5,
  "performanceScore": 78.9,
  "category": "Sanitation & Garbage",
  "status": "Active"
}
```

### Officers Response
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+91 98765 43211",
    "role": "Officer",
    "department": "Sanitation Department",
    "status": "Active",
    "totalComplaintsHandled": 45,
    "avgResolutionTime": 2.8,
    "satisfactionRate": 92.1,
    "performanceScore": 88.5
  }
]
```

## 🔧 Customization

### Adding New Metrics
1. Update the backend views to calculate new metrics
2. Add the metrics to the API response
3. Update the frontend to display the new metrics

### Customizing Charts
1. Modify the performance analytics endpoint
2. Update chart data structure
3. Update frontend chart components

### Adding New Fields
1. Add fields to Django models
2. Run migrations
3. Update serializers
4. Update API endpoints
5. Update frontend components

## 🐛 Troubleshooting

### Common Issues

**"No department found for this user"**
- User is not assigned to any department
- Check user-department relationships in database

**Authentication errors**
- Token expired or invalid
- Check localStorage for valid token

**Missing data**
- Database not populated
- Check if complaints and officers exist

**Performance score calculation errors**
- Division by zero in calculations
- Check if complaints exist for calculations

### Debug Mode
Enable console logging in frontend:
```javascript
console.log('Department profile data:', data)
```

Enable Django debugging:
```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

## 📈 Performance Optimization

### Database Optimization
- Add indexes to frequently queried fields
- Use select_related and prefetch_related
- Implement caching for expensive queries

### API Optimization
- Implement pagination for large datasets
- Add caching headers
- Optimize query performance

### Frontend Optimization
- Implement lazy loading
- Add loading states
- Optimize re-renders

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📄 License

This project is part of the Civic Issue Reporting System.

## 📞 Support

For issues and questions:
- Check the troubleshooting section
- Review the API documentation
- Contact the development team
