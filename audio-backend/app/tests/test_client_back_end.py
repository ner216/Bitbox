import requests
import json

BASE_URL = "http://127.0.0.1:5000"


def test_get_song(song_id): # PASSED
    response = requests.get(f"{BASE_URL}/songs/{song_id}")
    print("Song data:", response.status_code, response.json())


def test_create_user(): # PASSED
    payload = {"username": "nolan", "password": "secret"}
    response = requests.post(f"{BASE_URL}/users", json=payload)
    print("Create User:", response.status_code, response.json())


def test_login(username, password): # PASSED
    url = f"{BASE_URL}/login"
    payload = {"username": username, "password": password}
    headers = {"Content-Type": "application/json"}
    try:
        response = requests.post(url, data=json.dumps(payload), headers=headers)
        print(f"Status Code: {response.status_code}")
        print(f"Response Body: {json.dumps(response.json(), indent=2)}")
        if response.status_code == 200:
            print(f"Test Passed: User {username} logged in successfully.")
        elif response.status_code == 401:
            print(f"Test Passed: Invalid credentials for {username} as expected.")
        else:
            print(f"Test Failed: Unexpected status code {response.status_code}.")
    except requests.exceptions.ConnectionError:
        print("Test Failed: Could not connect to the Flask app. Is it running?")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")


def test_get_playlists_by_user_id(user_id: int): # PASSED
    url = f"{BASE_URL}/users/{user_id}/playlists"
    try:
        response = requests.get(url)
        print(f"Status Code: {response.status_code}")
        print(f"Response Body: {json.dumps(response.json(), indent=2)}")
        if response.status_code == 200:
            print(f"Test Passed: Playlists for user {user_id} retrieved successfully.")
        else:
            print(f"Test Failed: Unexpected status code {response.status_code}.")
    except requests.exceptions.ConnectionError:
        print("Test Failed: Could not connect to the Flask app. Is it running?")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")


def test_add_song_to_playlist(playlist_id: int, song_id: int): # PASSED
    url = f"{BASE_URL}/playlists/{playlist_id}/add_song"
    payload = {"song_id": song_id}
    headers = {"Content-Type": "application/json"}
    try:
        response = requests.post(url, data=json.dumps(payload), headers=headers)
        print(f"Status Code: {response.status_code}")
        print(f"Response Body: {json.dumps(response.json(), indent=2)}")
        if response.status_code == 200:
            print(f"Test Passed: Song {song_id} added to playlist {playlist_id} successfully.")
        elif response.status_code == 400:
            print(f"Test Passed: Failed to add song {song_id} to playlist {playlist_id} as expected.")
        else:
            print(f"Test Failed: Unexpected status code {response.status_code}.")
    except requests.exceptions.ConnectionError:
        print("Test Failed: Could not connect to the Flask app. Is it running?")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")


def test_search_song(song_name: str): # PASSED
    endpoint = f"/songs/{song_name}/search"
    url = f"{BASE_URL}{endpoint}"

    try:
        response = requests.get(url)

        # Check if the request was successful (status code 200)
        if response.status_code == 200:
            print(f"Successfully retrieved songs for '{song_name}'.")
            return response.json()
        elif response.status_code == 404:
            print(f"No songs found with the name '{song_name}' (Status: 404 Not Found).")
            print(f"Response: {response.json()}")
            return response.json() # Still return the message for inspection
        else:
            print(f"Error searching for song '{song_name}'. Status code: {response.status_code}")
            print(f"Response text: {response.text}")
            return None
    except requests.exceptions.ConnectionError as e:
        print(f"Connection Error: Could not connect to the backend at {BASE_URL}. Is your Docker container running and accessible?")
        print(f"Error details: {e}")
        return None
    except requests.exceptions.Timeout as e:
        print(f"Timeout Error: The request to {url} timed out.")
        print(f"Error details: {e}")
        return None
    except requests.exceptions.RequestException as e:
        print(f"An unexpected error occurred during the request: {e}")
        return None
    

def test_create_playlist(user_id:int, playlist_name:str): # PASSED
    endpoint = f"{BASE_URL}/users/{user_id}/playlists"
    payload = {"playlist_name": f"{playlist_name}"}
    response = requests.post(endpoint, json=payload)

    if response:
        print("Test success, created playlist!")
        print(f"RESPONSE: {response}")
    else:
        print("Test fialed, unable to create playlist!")



test_get_song(12)
#test_create_user()
#test_login("nolan","secret")
#test_get_playlists_by_user_id(1)
#test_add_song_to_playlist(1, 42)
#test_search_song("Maria Maria")
#test_create_playlist(1, "test_playlist")
