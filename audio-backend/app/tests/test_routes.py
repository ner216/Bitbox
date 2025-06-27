import requests
import json

BASE_URL = "http://127.0.0.1:5000"


def test_get_song(song_id): # PASSED
    response = requests.get(f"{BASE_URL}/songs/{song_id}")
    print("Song data:", response.status_code, response.json())


def test_create_user(username:str, password:str): # PASSED
    payload = {"username": username, "password": password}
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


def test_search_song(song_name: str): # PASSED
    endpoint = f"/songs/{song_name}/search"
    url = f"{BASE_URL}{endpoint}"

    try:
        response = requests.get(url)

        # Check if the request was successful (status code 200)
        if response.status_code == 200:
            print(f"Successfully retrieved songs for '{song_name}'.")
            print(f"Response: {response.json()}")
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


def test_similar_song(song_id:int): # PASSED
    response = requests.get(f"{BASE_URL}/similar/{song_id}")
    print("Similar Songs:")
    for idx, song in enumerate(response.json()):
        print(f"Song[{idx}]: {song}")


def test_get_playlist_songs(playlist_id:int): # PASSED
    response = requests.get(f"{BASE_URL}/playlist/{playlist_id}/songs")
    print("Playlist Songs:")
    for idx, song in enumerate(response.json()):
        print(f"Song[{idx}]: {song}")

def test_add_song_to_playlist(playlist_id:int, song_id:int):
    response = requests.post(f"{BASE_URL}/playlist/{playlist_id}/add_song/{song_id}")
    print(response)

def test_remove_playlist(playlist_id:int):
    response = requests.delete(f"{BASE_URL}/playlist/{playlist_id}/remove")
    print(response)

def test_get_user_info(user_id:int):
    response = requests.get(f"{BASE_URL}/users/{user_id}/info")
    print(response.json())


def main():
    stop = False
    routes = {
        "get_song":"0",
        "create_user":"1",
        "test_login":"2",
        "get_playlist_with_user_id":"3",
        "search_song":"4",
        "create_playlist":"5",
        "add_song_to_playlist":"6",
        "get_playlist_songs":"7",
        "find_similar_songs":"8",
        "remove_playlist_by_id":"9",
        "get_user_info":"10"
    }

    while stop != True:
        print("\nRoutes:")
        for r in routes:
            print(f"  {r}:{routes[r]}")
        
        choice = input("Options [0,1,2,3,4,5,6,7,8,9,10,q] > ")
        if choice == "0":
            song_id = int(input("Enter song ID > "))
            test_get_song(song_id)
        elif choice == "1":
            username = input("username > ")
            password = input("password > ")
            test_create_user(username, password)
        elif choice == "2":
            username = input("username > ")
            password = input("password > ")
            test_login(username, password)
        elif choice == "3":
            user_id = int(input("user ID > "))
            test_get_playlists_by_user_id(user_id)
        elif choice == "4":
            search = input("song name > ")
            test_search_song(search)
        elif choice == "5":
            user_id = int(input("user ID > "))
            name = input("name > ")
            test_create_playlist(user_id, name)
        elif choice == "6":
            play_id = int(input("playlist ID > "))
            song_id = int(input("song ID > ")) 
            test_add_song_to_playlist(play_id, song_id)
        elif choice == "7":
            play_id = int(input("playlist ID > "))
            test_get_playlist_songs(play_id)
        elif choice == "8":
            song_id = int(input("song ID > ")) 
            test_similar_song(song_id)
        elif choice == "9":
            playlist_id = int(input("playlist ID > "))
            test_remove_playlist(playlist_id)
        elif choice == "10":
            user_id = int(input("user ID > "))
            test_get_user_info(user_id)
        elif choice == "q":
            stop = True


main()
