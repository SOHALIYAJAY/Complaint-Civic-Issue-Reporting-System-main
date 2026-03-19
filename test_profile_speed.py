#!/usr/bin/env python3
"""
Test script to verify Department Profile page loading speed
"""

import time
import requests
from datetime import datetime

def test_page_load_speed():
    """Test how fast the profile page loads"""
    print("🚀 Testing Department Profile Page Load Speed")
    print("=" * 50)
    
    # Test 1: API Response Time
    print("\n📊 Testing API Response Time...")
    try:
        start_time = time.time()
        response = requests.get('http://127.0.0.1:8000/api/department/profile/', timeout=10)
        end_time = time.time()
        
        if response.status_code == 200:
            api_time = (end_time - start_time) * 1000  # Convert to milliseconds
            print(f"✅ API Response Time: {api_time:.0f}ms")
            
            if api_time < 1000:
                print("   🟢 Excellent - Under 1 second")
            elif api_time < 3000:
                print("   🟡 Good - Under 3 seconds")
            else:
                print("   🔴 Slow - Over 3 seconds")
        else:
            print(f"❌ API Error: {response.status_code}")
    except Exception as e:
        print(f"❌ API Test Failed: {e}")
    
    # Test 2: Frontend Loading
    print("\n🖥️  Testing Frontend Loading...")
    print("   💡 Open your browser and navigate to: http://localhost:3000/department/profile")
    print("   💡 The page should load immediately with fallback data")
    print("   💡 Real data will load in the background within 5 seconds")
    
    # Test 3: Performance Tips
    print("\n💡 Performance Optimization Tips:")
    print("   ✅ Page loads immediately with fallback data")
    print("   ✅ Real API calls have 5-second timeout")
    print("   ✅ Failed API calls don't break the page")
    print("   ✅ Loading states are minimal")
    print("   ✅ Data is cached in component state")
    
    print("\n🎯 Expected Results:")
    print("   🟢 Page should appear instantly (< 100ms)")
    print("   🟢 Fallback data should be visible immediately")
    print("   🟢 Real data should load within 5 seconds if API is available")
    print("   🟢 Page should remain functional even if API fails")

if __name__ == "__main__":
    test_page_load_speed()
