# Authentication Setup Guide

## Overview
The Civic Issue Reporting System uses JWT (JSON Web Token) authentication with Django REST Framework and SimpleJWT.

## Configuration

### Environment Setup
- **Database**: PostgreSQL
- **Authentication**: JWT Tokens
- **CORS**: Enabled for localhost:3000 and localhost:3001
- **Token Lifetime**: 60 minutes (access), 7 days (refresh)

### Key Settings (Civic/settings.py)

```python
# Authentication Classes
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': [],  # Public by default
    'EXCEPTION_HANDLER': 'accounts.exceptions.custom_exception_handler',
}

# CORS Configuration
CORS_ALLOW_HEADERS = [
    'accept', 'accept-encoding', 'authorization', 'content-type',
    'dnt', 'origin', 'user-agent', 'x-csrftoken', 'x-requested-with',
]
CORS_EXPOSE_HEADERS = [
    'access-control-allow-credentials', 'authorization', 'content-type',
]
```

## API Endpoints

### Public Endpoints
- `POST /api/login/` - User login (returns JWT tokens)
- `POST /api/register/` - User registration
- `POST /api/google-login/` - Google OAuth login
- `GET /api/getpubliccomplaints/` - Get public complaints
- `GET /api/complaintinfo/` - Complaint information

### Protected Endpoints (Require Valid JWT Token)
- `GET /api/getcomplaint/` - Get user's complaints
- `GET /api/getcomplaintlimit/` - Get paginated complaints
- `GET /api/userdetails/` - Get user profile
- `POST /api/raisecomplaint/` - Submit new complaint
- `POST /api/logout/` - User logout
- `POST /api/token/refresh/` - Refresh access token

## Authentication Flow

### 1. Login
```bash
POST /api/login/
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response (200 OK):
{
  "success": true,
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "email": "user@example.com",
    "username": "username",
    "name": "Full Name",
    "role": "Civic-User"
  }
}
```

### 2. Access Protected Endpoint
```bash
GET /api/getcomplaint/
Authorization: Bearer <access_token>

Response (200 OK):
[
  {
    "id": 1,
    "title": "Complaint Title",
    "status": "Pending",
    ...
  }
]
```

### 3. Refresh Token
```bash
POST /api/token/refresh/
Content-Type: application/json

{
  "refresh": "<refresh_token>"
}

Response (200 OK):
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### 4. Logout
```bash
POST /api/logout/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "refresh_token": "<refresh_token>"
}

Response (200 OK):
{
  "success": true,
  "message": "Logged out successfully"
}
```

## Error Responses

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Authentication required. Please log in.",
  "error": "Authentication credentials were not provided."
}
```

### 400 Bad Request
```json
{
  "success": false,
  "message": "Invalid request.",
  "errors": {...}
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "You do not have permission to perform this action.",
  "error": "..."
}
```

## Testing Authentication

### Create Test Users
```bash
python create_test_users.py
```

This creates three test users:
- `user@test.com` / `testpass123` (Civic-User)
- `officer@test.com` / `officerpass123` (Officer)
- `admin@test.com` / `adminpass123` (Admin-User)

### Run Authentication Tests
```bash
python test_auth_api.py
```

## Frontend Integration

### Using React
```typescript
// Login
const response = await fetch('/api/login/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: userEmail,
    password: userPassword
  })
});
const { access_token, refresh_token } = await response.json();

// Store tokens
localStorage.setItem('access_token', access_token);
localStorage.setItem('refresh_token', refresh_token);

// Make authenticated request
const userResponse = await fetch('/api/userdetails/', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${access_token}`,
    'Content-Type': 'application/json'
  }
});

// Refresh token when expired
const refreshResponse = await fetch('/api/token/refresh/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    refresh: refresh_token
  })
});
const { access } = await refreshResponse.json();
localStorage.setItem('access_token', access);
```

## Troubleshooting

### 401 Errors on Protected Endpoints
1. Check that `Authorization` header is present with format: `Bearer <token>`
2. Verify token hasn't expired (refresh if needed)
3. Ensure user account is active (`is_active=True`)
4. Check that CORS headers are properly configured

### Login Returning 401
1. Verify username/password are correct
2. Check user exists in database
3. Confirm user account is active
4. Look at server logs for specific error message

### Token Refresh Returning 401
1. Verify refresh_token is valid (not expired)
2. Check token hasn't been blacklisted
3. Ensure format is correct: `{"refresh": "<token>"}`

## Token Expiration Strategy

- **Access Token**: 60 minutes (use for API calls)
- **Refresh Token**: 7 days (use to get new access token)
- Configure tokens to auto-rotate on refresh
- Implement refresh before expiration on frontend

## Security Considerations

1. **HTTPS in Production**: Always use HTTPS
2. **Token Storage**: Store tokens securely (HttpOnly cookies preferred)
3. **CORS**: Restrict to specific domains in production
4. **Secret Key**: Change SECRET_KEY in production
5. **Rate Limiting**: Implement rate limiting on login endpoint
6. **Token Rotation**: Enabled (ROTATE_REFRESH_TOKENS=True)
7. **Blacklist on Rotation**: Enabled (BLACKLIST_AFTER_ROTATION=True)

## User Roles

- **Civic-User**: Regular citizens filing complaints
- **Officer**: Officers assigned to handle complaints
- **Department-User**: Department administrators
- **Admin-User**: System administrators

Each role has different permissions on various endpoints.
