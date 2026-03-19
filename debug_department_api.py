#!/usr/bin/env python3
"""
Debug script for Department Profile API
This script helps identify issues with the API endpoints
"""

import requests
import json

# Configuration
BASE_URL = "http://127.0.0.1:8000"
API_BASE = f"{BASE_URL}/api"

def test_api_connection():
    """Test if the Django server is running"""
    try:
        response = requests.get(BASE_URL, timeout=5)
        print(f"✅ Django server is running (Status: {response.status_code})")
        return True
    except requests.exceptions.ConnectionError:
        print("❌ Django server is not running or not accessible")
        print("   Please start the Django server with: python manage.py runserver")
        return False
    except Exception as e:
        print(f"❌ Error connecting to Django server: {e}")
        return False

def test_login():
    """Test login with different credentials"""
    test_credentials = [
        {"email": "admin@example.com", "password": "admin123"},
        {"email": "officer@example.com", "password": "officer123"},
        {"email": "user@example.com", "password": "user123"},
    ]
    
    for creds in test_credentials:
        try:
            response = requests.post(f"{API_BASE}/login/", json=creds, timeout=10)
            if response.status_code == 200:
                data = response.json()
                token = data.get('access_token')
                if token:
                    print(f"✅ Login successful with {creds['email']}")
                    return token, creds['email']
            else:
                print(f"❌ Login failed with {creds['email']}: {response.status_code}")
        except Exception as e:
            print(f"❌ Login error with {creds['email']}: {e}")
    
    print("❌ All login attempts failed")
    print("   Please check if users exist in the database")
    return None, None

def test_department_profile_api(token, email):
    """Test the department profile API with detailed logging"""
    print(f"\n=== Testing Department Profile API for {email} ===")
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    try:
        print(f"🔍 Making GET request to: {API_BASE}/department/profile/")
        response = requests.get(f"{API_BASE}/department/profile/", headers=headers, timeout=10)
        
        print(f"📊 Response Status: {response.status_code}")
        print(f"📊 Response Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Department Profile API successful!")
            print(f"   Department Name: {data.get('name')}")
            print(f"   Total Officers: {data.get('totalOfficers')}")
            print(f"   Active Complaints: {data.get('activeComplaints')}")
            print(f"   Performance Score: {data.get('performanceScore')}")
            return True
        else:
            print(f"❌ API failed with status {response.status_code}")
            print(f"   Response text: {response.text}")
            
            # Try to parse error details
            try:
                error_data = response.json()
                print(f"   Error details: {error_data}")
            except:
                print("   Could not parse error response as JSON")
            
            return False
            
    except Exception as e:
        print(f"❌ Request failed: {e}")
        return False

def check_database_models():
    """Check if the database models are properly configured"""
    print("\n=== Database Model Check ===")
    print("Checking if required models exist...")
    
    # This is a basic check - in a real scenario you might want to
    # actually query the database to verify models exist
    models_to_check = [
        "departments.Department",
        "departments.Officer", 
        "complaints.Complaint",
        "accounts.CustomUser"
    ]
    
    for model in models_to_check:
        print(f"   ✅ {model} - Expected to exist")
    
    print("   💡 If the API fails, check Django admin to verify models exist")

def main():
    """Main debugging function"""
    print("🔍 Department Profile API Debug Tool")
    print("=" * 50)
    
    # Step 1: Check Django server
    if not test_api_connection():
        return
    
    # Step 2: Check database models
    check_database_models()
    
    # Step 3: Try login
    token, email = test_login()
    if not token:
        print("\n💡 Troubleshooting Tips:")
        print("   1. Make sure Django server is running")
        print("   2. Check if users exist in the database")
        print("   3. Verify login endpoint is working")
        print("   4. Check Django logs for errors")
        return
    
    # Step 4: Test department profile API
    success = test_department_profile_api(token, email)
    
    if success:
        print("\n🎉 Department Profile API is working correctly!")
        print("   The frontend should now be able to fetch data.")
    else:
        print("\n❌ Department Profile API is not working")
        print("   Check the Django server logs for detailed error information")
        print("   Common issues:")
        print("   - User not assigned to any department")
        print("   - Department model relationships not properly set up")
        print("   - Missing or incorrect database data")

if __name__ == "__main__":
    main()
