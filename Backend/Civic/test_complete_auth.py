import requests
import json
import time
from typing import Dict, Any

BASE_URL = "http://localhost:8000"

def print_header(title):
    print("\n" + "="*70)
    print(f"  {title}")
    print("="*70)

def test_complete_auth_flow():
    """Test complete authentication flow including token refresh"""
    print_header("Complete Authentication Flow Test")
    
    # Step 1: Login
    print("\n[STEP 1] Login User")
    print("-" * 70)
    login_url = f"{BASE_URL}/api/login/"
    login_payload = {
        "email": "user@test.com",
        "password": "testpass123"
    }
    
    response = requests.post(login_url, json=login_payload)
    print(f"POST {login_url}")
    print(f"Status: {response.status_code}")
    
    if response.status_code != 200:
        print(f"❌ Login failed: {response.json()}")
        return False
    
    login_data = response.json()
    access_token = login_data['access_token']
    refresh_token = login_data['refresh_token']
    
    print(f"✅ Login successful")
    print(f"   Access Token: {access_token[:30]}...")
    print(f"   Refresh Token: {refresh_token[:30]}...")
    
    # Step 2: Test protected endpoint with token
    print("\n[STEP 2] Access Protected Endpoint with Token")
    print("-" * 70)
    protected_url = f"{BASE_URL}/api/userdetails/"
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    
    response = requests.get(protected_url, headers=headers)
    print(f"GET {protected_url}")
    print(f"Status: {response.status_code}")
    
    if response.status_code != 200:
        print(f"❌ Protected endpoint failed: {response.json()}")
        return False
    
    user_data = response.json().get('data', {})
    print(f"✅ Successfully retrieved user data")
    print(f"   Email: {user_data.get('email')}")
    print(f"   Username: {user_data.get('username')}")
    print(f"   Role: {user_data.get('User_Role')}")
    
    # Step 3: Refresh token
    print("\n[STEP 3] Refresh Access Token")
    print("-" * 70)
    refresh_url = f"{BASE_URL}/api/token/refresh/"
    refresh_payload = {
        "refresh": refresh_token
    }
    
    response = requests.post(refresh_url, json=refresh_payload)
    print(f"POST {refresh_url}")
    print(f"Status: {response.status_code}")
    
    if response.status_code != 200:
        print(f"❌ Token refresh failed: {response.json()}")
        return False
    
    response_data = response.json()
    new_access_token = response_data.get('access')
    
    print(f"✅ Token refreshed successfully")
    print(f"   New Access Token: {new_access_token[:30]}...")
    
    # Step 4: Test protected endpoint with new token
    print("\n[STEP 4] Access Protected Endpoint with New Token")
    print("-" * 70)
    new_headers = {
        "Authorization": f"Bearer {new_access_token}",
        "Content-Type": "application/json"
    }
    
    response = requests.get(protected_url, headers=new_headers)
    print(f"GET {protected_url}")
    print(f"Status: {response.status_code}")
    
    if response.status_code != 200:
        print(f"❌ Failed with new token: {response.json()}")
        return False
    
    print(f"✅ Successfully accessed with refreshed token")
    
    # Step 5: Test without token (should fail)
    print("\n[STEP 5] Access Protected Endpoint Without Token (Expected to Fail)")
    print("-" * 70)
    response = requests.get(protected_url)
    print(f"GET {protected_url}")
    print(f"Status: {response.status_code}")
    
    if response.status_code != 401:
        print(f"❌ Should have failed with 401, got {response.status_code}")
        return False
    
    print(f"✅ Correctly rejected unauthenticated request (401)")
    
    # Step 6: Test invalid token (should fail)
    print("\n[STEP 6] Access Protected Endpoint With Invalid Token (Expected to Fail)")
    print("-" * 70)
    bad_headers = {
        "Authorization": "Bearer invalid.token.here",
        "Content-Type": "application/json"
    }
    
    response = requests.get(protected_url, headers=bad_headers)
    print(f"GET {protected_url}")
    print(f"Status: {response.status_code}")
    
    if response.status_code != 401:
        print(f"❌ Should have failed with 401, got {response.status_code}")
        return False
    
    print(f"✅ Correctly rejected invalid token (401)")
    
    # Step 7: Logout
    print("\n[STEP 7] Logout User")
    print("-" * 70)
    logout_url = f"{BASE_URL}/api/logout/"
    logout_payload = {
        "refresh_token": refresh_token
    }
    logout_headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    
    response = requests.post(logout_url, json=logout_payload, headers=logout_headers)
    print(f"POST {logout_url}")
    print(f"Status: {response.status_code}")
    
    if response.status_code != 200:
        print(f"⚠️  Logout returned {response.status_code}")
    else:
        print(f"✅ Logged out successfully")
    
    return True

def test_error_handling():
    """Test error handling for various scenarios"""
    print_header("Error Handling Tests")
    
    # Test 1: Missing credentials
    print("\n[TEST 1] Missing Email and Password")
    print("-" * 70)
    response = requests.post(f"{BASE_URL}/api/login/", json={})
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    
    if response.status_code == 400:
        print("✅ Correctly returned 400 for missing fields")
    else:
        print("⚠️  Expected 400, got different status")
    
    # Test 2: Invalid email
    print("\n[TEST 2] User Not Found")
    print("-" * 70)
    response = requests.post(
        f"{BASE_URL}/api/login/",
        json={"email": "nonexistent@test.com", "password": "password"}
    )
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    
    if response.status_code == 404:
        print("✅ Correctly returned 404 for non-existent user")
    else:
        print(f"⚠️  Expected 404, got {response.status_code}")
    
    # Test 3: Wrong password
    print("\n[TEST 3] Invalid Password")
    print("-" * 70)
    response = requests.post(
        f"{BASE_URL}/api/login/",
        json={"email": "user@test.com", "password": "wrongpassword"}
    )
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    
    if response.status_code == 401:
        print("✅ Correctly returned 401 for invalid password")
    else:
        print(f"⚠️  Expected 401, got {response.status_code}")

def test_cors_headers():
    """Test CORS headers"""
    print_header("CORS Headers Test")
    
    print("\n[TEST] Preflight Request (OPTIONS)")
    print("-" * 70)
    response = requests.options(
        f"{BASE_URL}/api/login/",
        headers={
            "Origin": "http://localhost:3000",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "authorization, content-type"
        }
    )
    
    print(f"Status: {response.status_code}")
    
    # Check CORS headers
    cors_headers = {k: v for k, v in response.headers.items() if k.startswith('access-control')}
    
    if cors_headers:
        print("✅ CORS headers present:")
        for k, v in cors_headers.items():
            print(f"   {k}: {v}")
    else:
        print("⚠️  No CORS headers found")

if __name__ == "__main__":
    print("\n" + "█"*70)
    print("    COMPLETE AUTHENTICATION API TEST SUITE")
    print("█"*70)
    
    # Wait for server
    time.sleep(1)
    
    try:
        # Run all tests
        if test_complete_auth_flow():
            print_header("✅ Complete Auth Flow Test PASSED")
        else:
            print_header("❌ Complete Auth Flow Test FAILED")
        
        test_error_handling()
        test_cors_headers()
        
        print_header("✅ ALL TESTS COMPLETED")
        
    except requests.exceptions.ConnectionError:
        print("\n❌ ERROR: Could not connect to server at localhost:8000")
        print("   Make sure Django is running with: python manage.py runserver 0.0.0.0:8000")
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc()
