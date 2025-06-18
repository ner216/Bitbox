# app/routes.py

from flask import Blueprint, request, jsonify
from db.interface import db_interface  # Your DB interface class

api = Blueprint('api', __name__)  # This stays global

class APIRoutes:
    def __init__(self):
        self.db = db_interface()
        self.register_routes()

    def register_routes(self):
        # 1. Get a song by ID
        @api.route('/songs/<int:song_id>', methods=['GET'])
        def get_song(song_id):
            song = self.db.get_song_by_id(song_id)
            if song:
                return jsonify(song), 200
            return jsonify({'error': 'Song not found'}), 404

        # 2. Login
        @api.route('/login', methods=['POST'])
        def login():
            data = request.get_json()
            username = data.get("username")
            password = data.get("password")
            user_id = self.db.get_user_id(username, password)
            if user_id:
                return jsonify({"user_id": user_id}), 200
            return jsonify({"error": "Invalid credentials"}), 401

        # 3. Get playlists by user ID
        @api.route('/users/<int:user_id>/playlists', methods=['GET'])
        def get_playlists(user_id):
            playlists = self.db.get_playlist_by_user_id(user_id)
            return jsonify(playlists), 200

        # 4. Get songs by playlist ID
        @api.route('/playlists/<int:playlist_id>/songs', methods=['GET'])
        def get_song_ids(playlist_id):
            songs = self.db.get_playlistSongs_by_playlist_id(playlist_id)
            return jsonify(songs), 200

        # 5. Create user
        @api.route('/users', methods=['POST'])
        def create_user():
            data = request.get_json()
            username = data.get("username")
            password = data.get("password")
            success = self.db.create_user(username, password)
            if success:
                return jsonify({'message': 'User created'}), 201
            return jsonify({'error': 'User already exists or creation failed'}), 400

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

            # Assuming your db.interface has a method like create_playlist(user_id, playlist_name)
            # This method should return True on success, False on failure
            success = self.db.create_playlist(user_id, playlist_name)

            if success:
                return jsonify({'message': f'Playlist "{playlist_name}" created successfully for user {user_id}'}), 201
            return jsonify({'error': f'Failed to create playlist "{playlist_name}" for user {user_id}'}), 400

