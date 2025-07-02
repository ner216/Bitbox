# app/routes.py

from flask import Blueprint, request, jsonify, send_from_directory, abort
from db.interface import db_interface  # Your DB interface class

api = Blueprint('api', __name__)  # This stays global

class APIRoutes:
    def __init__(self):
        self.db = db_interface()
        self.register_routes()

    def register_routes(self):
        # This route PASSED tests performed by Nolan
        # Get a song by ID
        @api.route('/songs/<int:song_id>', methods=['GET'])
        def get_song(song_id):
            song = self.db.get_song_by_id(song_id)
            if song:
                return jsonify(song), 200
            return jsonify({'error': 'Song not found'}), 404


        # This route PASSED tests performed by Nolan
        # Login
        @api.route('/login', methods=['POST'])
        def login():
            data = request.get_json()
            username = data.get("username")
            password = data.get("password")
            user_id = self.db.get_user_id(username, password)
            if user_id:
                return jsonify({"user_id": user_id}), 200
            return jsonify({"error": "Invalid credentials"}), 401


        # This route PASSED tests performed by Nolan
        # Get playlists by user ID
        @api.route('/users/<int:user_id>/playlists', methods=['GET'])
        def get_playlists(user_id):
            playlists = self.db.get_playlist_by_user_id(user_id)
            return jsonify(playlists), 200


        # This route PASSED tests performed by Nolan
        # Create user
        @api.route('/users', methods=['POST'])
        def create_user():
            """
            Creates user entry in database.
            Expected input:
                - username (str): The name of the user.
                - password (str): The password for the user.
            """
            data = request.get_json()
            username = data.get("username")
            password = data.get("password")
            print(f"Registering user: {username} / {password}")
            success = self.db.create_user(username, password)
            print(f"Registration success? {success}")
            if success:
                return jsonify({'message': 'User created'}), 201
            return jsonify({'error': 'User already exists or creation failed'}), 400


        # This route PASSED tests performed by Nolan
        # Song search by name
        @api.route('/songs/<string:name>/search', methods=['GET'])
        def search_songs(name):
            """
            Searches for songs by name in the database.
            Expected input:
                - name (str): The name of the song to search for.
            Expected output:
                - If songs are found, returns a JSON array of song data with a 200 status.
                - If no songs are found, returns a JSON error message with a 404 status.
            """
            results = self.db.get_song_by_name(name)
            if results:
                return jsonify(results), 200
            return jsonify({"message": "No songs match search."}), 404


        # This route PASSED tests performed by Nolan
        # Create playlist
        @api.route('/users/<int:user_id>/playlists', methods=['POST'])
        def create_playlist(user_id):
            """
            Creates a new playlist for a given user.
            Expected input:
                - user_id (int): The ID of the user creating the playlist.
                - JSON body: {'playlist_name': 'My New Playlist Name'}
            Expected output:
                - If successful, returns a success message with a 201 status.
                - If failed, returns an error message with a 400 status.
            """
            data = request.get_json()
            playlist_name = data.get('playlist_name')

            if not playlist_name:
                return jsonify({'error': 'Playlist name is required'}), 400

            success = self.db.create_playlist(user_id, playlist_name)

            if success:
                print(f"Playlist '{playlist_name}' created successfully for user {user_id}")
                return jsonify({'message': f'Playlist "{playlist_name}" created successfully for user {user_id}'}), 201
            print(f"Failed to create playlist '{playlist_name}' for user {user_id}")
            return jsonify({'error': f'Failed to create playlist "{playlist_name}" for user {user_id}'}), 400
        
        
        # This route PASSED tests performed by Nolan
        # Add song to playlist
        @api.route('/playlist/<int:playlist_id>/add_song/<int:song_id>', methods=['POST'])
        def add_song_to_playlist(playlist_id:int, song_id:int):
            success = self.db.create_playlist_song(playlist_id, song_id)

            if success:
                return jsonify({'message': f'Added song ID {song_id} to playlist ID {playlist_id}'}), 201
            return jsonify({'error': f'Failed to add song ID {song_id} to playlist ID {playlist_id}'}), 400
        

        # This route PASSED tests performed by Nolan
        # Get user info with user_id
        @api.route('/users/<int:user_id>/info', methods=['GET'])
        def get_user_info_with_id(user_id:int):
            user_info = self.db.get_user_info(user_id)

            if user_info:
                return jsonify({'success': user_info}), 201
            return jsonify({'error': f'Failed to get user info for ID: {user_id}'}), 400
        

        # This route PASSED tests performed by Nolan
        # Remove playlist
        @api.route('/playlist/<int:playlist_id>/remove', methods=['DELETE'])
        def remove_playlist(playlist_id):
            success = self.db.remove_playlist_by_id(playlist_id)

            if success:
                print(f"Playlist {playlist_id} deleted successfully")
                return jsonify({'message': f'Playlist {playlist_id} deleted successfully'}), 200
            print(f"Failed to delete playlist {playlist_id}")
            return jsonify({'error': f'Failed to delete playlist {playlist_id}'}), 404


        # This route PASSED tests performed by Nolan
        # Get a song audio file from the backend given a file name.
        @api.route('/music/<string:filename>')
        def serve_music(filename:str):
            try:
                return send_from_directory("db/music/", filename, as_attachment=False)
            except FileNotFoundError:
                print("[ERROR] Unable to find music file! [routes::serve_music]")
                return None
            except Exception as e:
                print(f"[ERROR] Unable to send music file! [routes::serve_music]\n Err: {e}")
                return None


        # This route PASSED tests performed by Nolan
        # Get a list of songs that are in a given playlist
        @api.route('/playlist/<int:playlist_id>/songs', methods=['GET'])
        def get_playlist_songs(playlist_id):
            songs = self.db.get_songs_in_playlist(playlist_id)
            if songs:
                return jsonify(songs), 200
            else:
                return jsonify({"message": f"No songs found for playlist ID {playlist_id} or playlist does not exist."}), 404
            

        # This route PASSED tests performed by Nolan
        # Get a list of songs that are similar to the given song ID
        @api.route('/similar/<int:song_id>', methods=['GET'])
        def get_similar_songs(song_id):
            # Set this variable to change the # of similar songs returned
            TOTAL_SIMILAR_SONGS = 5
            entry_count = 0 # increment until equal to TOTAL_SIMILAR_SONGS
            used_urls = []
            similar_song_list = []

            song = self.db.get_song_by_id(song_id)
            while entry_count < TOTAL_SIMILAR_SONGS:
                similar_song_url = song["similar_file_url"]
                if similar_song_url not in used_urls:
                    similar_song_list.append(self.db.get_song_by_url(similar_song_url))
                    used_urls.append(similar_song_url)
                    entry_count = entry_count + 1
                if similar_song_url in used_urls:
                    print("[INFO] Breaking similar song loop to avoid infinite loop")
                    break
                song = self.db.get_song_by_url(similar_song_url)
                print("LOOP: " + str(entry_count))

            if similar_song_list:
                return jsonify(similar_song_list), 200
            else:
                return jsonify({"message": f"Unable to find similar for song ID {song_id}"}), 404


