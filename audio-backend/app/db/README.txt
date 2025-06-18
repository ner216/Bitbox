This folder will contain python files that serve as an interface
with the database. For example, it would contain python code that
adds music and vectors to the database. It will also contain code
that retrieves music and its vectors from the database.


INTERFACE USAGE:

IMPORTING THE INTERFACE:
from db.db_interface import db_interface

GENERAL QUERY METHOD INFO: (SENDING CUSTOM COMMANDS)
The general query method: execute_query(sql, params, fetch_all, fetch_one, commit)
- sql -- a sql command as a parameterized string.
- params -- parameters for the sql command as tuple. Default value is None.
- fetch_all -- Used to return all entries that are found. Such as a search for all songs in a playlist.
    Default value is False.
- fetch_one -- Used to return only the first entry found. Such as a search for a single user corresponding to an id.
    Default value is False.
- commit -- Used to specify if you would like to save changes to the database. (if making changes)
    Default value is False.

CLASS METHODS: (SENDING PRECONFIGURED COMMANDS) (USE THESE METHODS WHEN POSSIBLE)
All other class methods other than the one above are meant for specific tasks. Such as
creating a new user. These methods simply call the method above and with the proper
sql command and configuration.

SEE INTERFACE.PY FILE FOR REFERENCE ON USAGE DESCRIBED HERE


DATA STORAGE FOR SONGS:
Ex-> {'id': 4, 'title': 'Seven Seas of Rhye', 'artist': 'Queen', 'genre': 'art rock', 'duration_sec': 168.4, 'similar': 2}
You will get a list that looks like this: (4, 'Seven Seas of Rhye', 'Queen', 'art rock', 168.4, 2)



ROUTE USAGE:
Base url -> http://127.0.0.1:5000

- '/songs/<int:song_id>'  Used for retrieving song data using its unique id.

- '/login' Used to login a user. Must send username and password values in json.
    If the login is success, the user id will be returned.

- '/users/<int:user_id>/playlists' Used to retrieve all playlist database entries from backend.

- '/playlists/<int:playlist_id>/songs' Get song info for each song in a given playlist.

- '/users' Used to create a user. Must also give username and password in json.

- '/songs/<string:name>/search' search songs by name.

- '/users/<int:user_id>/playlists' Create a playlist for a user. Must send palylist name in json.



