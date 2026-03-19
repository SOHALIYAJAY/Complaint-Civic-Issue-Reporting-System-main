#!/usr/bin/env python3
"""
Test script for Department Profile API endpoints
Run this script to test the backend functionality
"""

import requests
import json
import sys

# Configuration
BASE_URL = "http://127.0.0.1:8000"
API_BASE = f"{BASE_URL}/api"

# Test credentials (you'll need to update these with actual user credentials)
TEST_USER = {
    "email": "test@example.com",
    "password": "testpassword123"
}

def login_and_get_token():
    """Login and get authentication token"""
    try:
        response = requests.post(f"{API_BASE}/login/", json=TEST_USER)
        if response.status_code == 200:
            data = response.json()
            return data.get('access_token')
        else:
            print(f"Login failed: {response.status_code}")
            print(f"Response: {response.text}")
            return None
    except Exception as e:
        print(f"Login error: {e}")
        return None

def test_department_profile(token):
    """Test department profile endpoint"""
    print("\n=== Testing Department Profile ===")
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.get(f"{API_BASE}/department/profile/", headers=headers)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Department Profile API working!")
            print(f"Department Name: {data.get('name')}")
            print(f"Total Officers: {data.get('totalOfficers')}")
            print(f"Active Complaints: {data.get('activeComplaints')}")
            print(f"Resolved Complaints: {data.get('resolvedComplaints')}")
            print(f"Performance Score: {data.get('performanceScore')}")
            return True
        else:
            print(f"❌ Failed: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_department_officers(token):
    """Test department officers endpoint"""
    print("\n=== Testing Department Officers ===")
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.get(f"{API_BASE}/department/officers/", headers=headers)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Department Officers API working!")
            print(f"Number of Officers: {len(data)}")
            if data:
                print(f"First Officer: {data[0].get('name')}")
            return True
        else:
            print(f"❌ Failed: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_department_complaints(token):
    """Test department complaints endpoint"""
    print("\n=== Testing Department Complaints ===")
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.get(f"{API_BASE}/department/complaints/", headers=headers)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Department Complaints API working!")
            print(f"Number of Complaints: {len(data)}")
            if data:
                print(f"First Complaint: {data[0].get('title')}")
            return True
        else:
            print(f"❌ Failed: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_department_performance(token):
    """Test department performance endpoint"""
    print("\n=== Testing Department Performance ===")
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.get(f"{API_BASE}/department/performance/", headers=headers)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Department Performance API working!")
            print(f"Monthly Stats: {len(data.get('monthlyStats', []))} months")
            print(f"Categories: {len(data.get('categoryDistribution', []))}")
            print(f"Officers Performance: {len(data.get('officerPerformance', []))}")
            return True
        else:
            print(f"❌ Failed: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_update_profile(token):
    """Test update department profile endpoint"""
    print("\n=== Testing Update Department Profile ===")
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    update_data = {
        "description": "Updated description for testing",
        "contact_email": "updated@example.com",
        "contact_phone": "+91 98765 43211"
    }
    
    try:
        response = requests.put(f"{API_BASE}/department/update-profile/", 
                               headers=headers, json=update_data)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Update Profile API working!")
            print(f"Message: {data.get('message')}")
            return True
        else:
            print(f"❌ Failed: {response.text}")
            # This might fail if user is not department head, which is expected
            return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def main():
    """Main test function"""
    print("🚀 Testing Department Profile API Endpoints")
    print("=" * 50)
    
    # Login and get token
    print("🔐 Logging in...")
    token = login_and_get_token()
    
    if not token:
        print("❌ Cannot proceed without authentication token")
        sys.exit(1)
    
    print("✅ Login successful!")
    
    # Run tests
    tests = [
        ("Department Profile", test_department_profile),
        ("Department Officers", test_department_officers),
        ("Department Complaints", test_department_complaints),
        ("Department Performance", test_department_performance),
        ("Update Profile", test_update_profile)
    ]
    
    results = []
    for test_name, test_func in tests:
        try:
            result = test_func(token)
            results.append((test_name, result))
        except Exception as e:
            print(f"❌ {test_name} failed with exception: {e}")
            results.append((test_name, False))
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 TEST RESULTS SUMMARY")
    print("=" * 50)
    
    passed = 0
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status}: {test_name}")
        if result:
            passed += 1
    
    print(f"\nTotal: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! Department Profile API is working correctly.")
    else:
        print("⚠️  Some tests failed. Please check the backend implementation.")

if __name__ == "__main__":
    main()
