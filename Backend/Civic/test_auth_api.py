import requests
import json
from typing import Dict, Any

BASE_URL = "http://localhost:8000"

def test_login() -> Dict[str, Any]:
    """Test login endpoint"""
    print("\n" + "="*60)
    print("TEST 1: Login Endpoint")
    print("="*60)
    
    url = f"{BASE_URL}/api/login/"
    payload = {
        "email": "user@test.com",
        "password": "testpass123"
    }
    
    response = requests.post(url, json=payload)
    print(f"POST {url}")
    print(f"Payload: {json.dumps(payload, indent=2)}")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    return response.json() if response.status_code == 200 else None

def test_protected_endpoint_without_token():
    """Test protected endpoint without token"""
    print("\n" + "="*60)
    print("TEST 2: Protected Endpoint Without Token")
    print("="*60)
    
    url = f"{BASE_URL}/api/getcomplaint/"
    
    response = requests.get(url)
    print(f"GET {url}")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")

def test_protected_endpoint_with_token():
    """Test protected endpoint with token"""
    print("\n" + "="*60)
    print("TEST 3: Protected Endpoint With Token")
    print("="*60)
    
    # First login
    login_response = requests.post(
        f"{BASE_URL}/api/login/",
        json={"email": "user@test.com", "password": "testpass123"}
    )
    
    if login_response.status_code != 200:
        print("Login failed. Cannot proceed with token test.")
        return
    
    token = login_response.json()['access_token']
    
    url = f"{BASE_URL}/api/getcomplaint/"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    response = requests.get(url, headers=headers)
    print(f"GET {url}")
    print(f"Authorization: Bearer {token[:20]}...")
    print(f"Status Code: {response.status_code}")
    
    try:
        print(f"Response: {json.dumps(response.json(), indent=2)}")
    except:
        print(f"Response: {response.text}")

def test_user_details_protected():
    """Test user details endpoint with token"""
    print("\n" + "="*60)
    print("TEST 4: User Details (Protected)")
    print("="*60)
    
    # First login
    login_response = requests.post(
        f"{BASE_URL}/api/login/",
        json={"email": "user@test.com", "password": "testpass123"}
    )
    
    if login_response.status_code != 200:
        print("Login failed. Cannot proceed.")
        return
    
    token = login_response.json()['access_token']
    
    url = f"{BASE_URL}/api/userdetails/"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    response = requests.get(url, headers=headers)
    print(f"GET {url}")
    print(f"Status Code: {response.status_code}")
    
    try:
        print(f"Response: {json.dumps(response.json(), indent=2)}")
    except:
        print(f"Response: {response.text}")

def test_invalid_login():
    """Test login with invalid credentials"""
    print("\n" + "="*60)
    print("TEST 5: Invalid Login Credentials")
    print("="*60)
    
    url = f"{BASE_URL}/api/login/"
    payload = {
        "email": "user@test.com",
        "password": "wrongpassword"
    }
    
    response = requests.post(url, json=payload)
    print(f"POST {url}")
    print(f"Payload: {json.dumps(payload, indent=2)}")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")

if __name__ == "__main__":
    print("Testing Authentication and Protected Endpoints")
    print("=" * 60)
    
    # Wait a moment for server to start
    import time
    time.sleep(2)
    
    try:
        test_login()
        test_protected_endpoint_without_token()
        test_protected_endpoint_with_token()
        test_user_details_protected()
        test_invalid_login()
        
        print("\n" + "="*60)
        print("All tests completed!")
        print("="*60)
    
    except requests.exceptions.ConnectionError:
        print("ERROR: Could not connect to server. Make sure Django is running on port 8000")
    except Exception as e:
        print(f"ERROR: {e}")
        import traceback
        traceback.print_exc()
