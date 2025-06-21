# Development Information for Flask API Routes

### Technical Information:
The code for the routes is located in the `routes.py` file.

### Route Usage:
> Base url -> http://127.0.0.1:5000

- `/songs/<int:song_id>`  
    - Used for retrieving song data using its unique id.

- `/login`
    - Used to login a user. Must send username and password values in json.
    If the login is success, the user id will be returned.

- `/users/<int:user_id>/playlists` 
    - Used to retrieve all playlist database entries from backend.

- `/playlists/<int:playlist_id>/songs` 
    - Get song info for each song in a given playlist.

- `/users` 
    - Used to create a user. Must also give username and password in json.

- `/songs/<string:name>/search` 
    - search songs by name.

- `/users/<int:user_id>/playlists` 
    - Create a playlist for a user. Must send palylist name in json.

- `/playlist/<int:playlist_id>/songs`
    - Get a list of song data for each song within the given playlist(playlist id).

- `/songs/<int:song_id>/similar`
    - Get five song data entries(as list) that are similar to the given song(song ID).

