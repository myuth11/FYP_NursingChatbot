#!/usr/bin/env python3
"""
Simple test script to check if the video functionality works
"""

import requests
import json

def test_video_endpoint():
    url = "http://localhost:8000/chat"
    
    # Test 1: Ask for video
    payload = {"question": "show me a video"}
    
    try:
        response = requests.post(url, json=payload)
        if response.status_code == 200:
            result = response.json()
            print("✅ Video request test:")
            print(f"Response: {json.dumps(result, indent=2)}")
            
            # Check if it has the expected fields
            if "video_prompt" in result and result["video_prompt"]:
                print("✅ Video prompt detected correctly")
            else:
                print("❌ Video prompt not detected")
                
        else:
            print(f"❌ Error: Status code {response.status_code}")
            print(f"Response: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Connection error - make sure the server is running on port 8000")
    except Exception as e:
        print(f"❌ Error: {e}")

    print("\n" + "="*50 + "\n")
    
    # Test 2: Select a video option
    payload2 = {"question": "1"}
    
    try:
        response2 = requests.post(url, json=payload2)
        if response2.status_code == 200:
            result2 = response2.json()
            print("✅ Video selection test:")
            print(f"Response: {json.dumps(result2, indent=2)}")
            
            # Check if it has video URLs
            if "video_urls" in result2:
                print("✅ Video URLs returned correctly")
                print(f"Number of videos: {len(result2['video_urls'])}")
            else:
                print("❌ Video URLs not found in response")
                
        else:
            print(f"❌ Error: Status code {response2.status_code}")
            print(f"Response: {response2.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Connection error - make sure the server is running on port 8000")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    print("Testing video functionality...\n")
    test_video_endpoint()
