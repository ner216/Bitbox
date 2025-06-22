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

        # Get playlists by user ID
        @api.route('/users/<int:user_id>/playlists', methods=['GET'])
        def get_playlists(user_id):
            playlists = self.db.get_playlist_by_user_id(user_id)
            return jsonify(playlists), 200

        # Create user
        @api.route('/users', methods=['POST'])
        def create_user():
            data = request.get_json()
            username = data.get("username")
            password = data.get("password")
            success = self.db.create_user(username, password)
            if success:
                return jsonify({'message': 'User created'}), 201
            return jsonify({'error': 'User already exists or creation failed'}), 400
        

        # Get user info
        @api.route('/users/<int:user_id>/info', methods=['GET'])
        def get_user_info(user_id):
            user = self.db.get_user_info(user_id)
            if user:
                return jsonify(user), 200
            return jsonify({'error': 'User not found'}), 404


        # Song search by name
        @api.route('/songs/<string:name>/search', methods=['GET'])
        def search_songs(name):
            results = self.db.get_song_by_name(name)
            if results:
                return jsonify(results), 200
            return jsonify({"message": "No songs match search."}), 404
        

        # Create playlist
        @api.route('/users/<int:user_id>/playlists', methods=['POST'])
        def create_playlist(user_id):
            data = request.get_json()
            playlist_name = data.get('playlist_name')

            if not playlist_name:
                return jsonify({'error': 'Playlist name is required'}), 400

            success = self.db.create_playlist(user_id, playlist_name)

            if success:
                return jsonify({'message': f'Playlist "{playlist_name}" created successfully for user {user_id}'}), 201
            return jsonify({'error': f'Failed to create playlist "{playlist_name}" for user {user_id}'}), 400
        

        # Remove playlist
        @api.route('/playlist/<int:playlist_id>', methods=['DELETE'])
        def remove_playlist(playlist_id):
            success = self.db.remove_playlist_by_id(playlist_id)

            if success:
                return jsonify({'message': f'Playlist "{playlist_id}" deleted successfully'}), 201
            return jsonify({'error': f'Failed to delete playlist "{playlist_id}"'}), 400
        

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
            

        @api.route('/songs/<int:song_id>/similar', methods=['GET'])
        def get_similar_songs(song_id):
            similar_song_list = []

            song = self.db.get_song_by_id(song_id)
            for i in range(5):
                similar_song_url = song[-1]
                similar_song_list.append(self.db.get_song_by_url(similar_song_url))
                song = self.db.get_song_by_url(similar_song_url)

            if len(similar_song_list) == 5:
                return jsonify(similar_song_list), 200
            else:
                return jsonify({"message": f"Unable to find similar for song ID {song_id}"}), 404


