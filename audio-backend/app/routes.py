# app/routes.py

from flask import Blueprint, request, jsonify, send_from_directory, abort
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

        # 5. Create user
        @api.route('/users', methods=['POST'])
        def create_user():
            data = request.get_json()
            username = data.get("username")
            password = data.get("password")
            print(f"👤 Registering user: {username} / {password}")
            success = self.db.create_user(username, password)
            print(f"✅ Registration success? {success}")
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
        def create_playlist(user_id): # Removed playlist_name from here
            print(f"🛠 Attempting to create playlist for user {user_id}")
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
        

        # Delete playlist
        @api.route('/playlists/<int:playlist_id>', methods=['DELETE'])
        def delete_playlist(playlist_id):
            """
            Deletes a playlist for a given user.
            Expected input:
                - user_id (int): The ID of the user whose playlist is being deleted.
                - playlist_id (int): The ID of the playlist to delete.
            Expected output:
                - If successful, returns a success message with a 200 status.
                - If the playlist is not found or deletion fails, returns an error message with a 404 or 400 status.
            """
            success = self.db.remove_playlist_by_id(playlist_id)

            if success:
                print(f"Playlist {playlist_id} deleted successfully")
                return jsonify({'message': f'Playlist {playlist_id} deleted successfully'}), 200
            print(f"Failed to delete playlist {playlist_id}")
            return jsonify({'error': f'Failed to delete playlist {playlist_id}'}), 404


        @api.route('/music/<filename>')
        def serve_music(filename):
            try:
                return send_from_directory("app/db/music/", filename, as_attachment=False)
            except FileNotFoundError:
                print("[ERROR] Unable to find music file! [routes::serve_music]")
                return
            except Exception as e:
                print(f"[ERROR] Unable to send music file! [routes::serve_music]\n Err: {e}")
                return


        @api.route('/playlist/<int:playlist_id>/songs', methods=['GET'])
        def get_playlist_songs_route(playlist_id):
            # Access the DatabaseInterface instance from g
            songs = self.db.get_songs_in_playlist(playlist_id)
            if songs:
                return jsonify(songs), 200
            else:
                return jsonify({"message": f"No songs found for playlist ID {playlist_id} or playlist does not exist."}), 404


