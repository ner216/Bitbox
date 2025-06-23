import psycopg2
from psycopg2 import OperationalError, Error
from psycopg2.pool import SimpleConnectionPool
from psycopg2.extras import RealDictCursor

from mutagen.mp3 import MP3
from mutagen.id3 import ID3NoHeaderError, ID3

import os
import time
import socket
import yaml

# Get envirnment variables from linux container
DB_NAME = os.getenv("DB_NAME")
DB_HOST = os.getenv("DB_HOST")
DB_USER = os.getenv("DB_USER")
DB_PASS = os.getenv("DB_PASSWORD")
DB_PORT = os.getenv("DB_PORT")


MUSIC_DIRECTORY = "app/db/music/"

# A function to pause execution untill the database is online
def wait_for_db(timeout=int):
    time.sleep(4)
    start_time = time.time()

    while True:
        try:
            with socket.create_connection((DB_HOST, DB_PORT), timeout=2):
                print(f"[INFO] Database is available at port {DB_PORT}")
                return
        except OSError:
            print(f"[INFO] Waiting for database at {DB_HOST}:{DB_PORT}...")
            time.sleep(1)
            if time.time() - start_time > timeout:
                print("[INFO] Server timeout reached waiting for db!")
                exit()


class conn_pool(object):
    def __init__(self, min_conn, max_conn): # Take max and min db connections as parameter
        self.min_conn = min_conn
        self.max_conn = max_conn
        self.db_pool = None

        try:
            self.db_pool = SimpleConnectionPool(
                minconn=self.min_conn,
                maxconn=self.max_conn,
                database=DB_NAME,
                user=DB_USER,
                host=DB_HOST,
                port=DB_PORT,
                password=DB_PASS
            )
            print("[INFO] Successfully connected to database!")
            print(f"[INFO] psycopg2 connection pool initialized with max={self.max_conn} and min={self.min_conn}")
        except Exception as e:
            print(f"[ERROR] Unable to initialize connection pool! [conn_pool::__init__]\n Error: {e}")
            exit()

    def get_conn(self): # Borrow a connection from the pool
        try:
            return self.db_pool.getconn()
        except Exception as e:
            print(f"[ERROR] Unable to borrow connection [conn_pool::get_conn]\n Error: {e}")
            exit()
    
    def return_conn(self, conn):
        try:
            self.db_pool.putconn(conn)
        except Exception as e:
            print(f"[ERROR] Unable to return conn to pool! [conn_pool::return_conn]\n Error: {e}")
            exit()
    
    def close_pool(self):
        try:
            self.db_pool.closeall()
            print("[INFO] Pool has been closed!")
        except Exception as e:
            print(f"[ERROR] Unable to close conn pool! [conn_pool::close_pool]\n Error: {e}")


# Method to load database schema into Postgres container -------------------------------------------------------
def load_schema(schema_file_path) -> bool:
    if not os.path.exists(schema_file_path):
        print("[ERROR] Schema file does not exist! [db_interface::load_schema]")
        return False

    try:
        with open(schema_file_path, "r") as file:
            sql_script = file.read()

        # Get connection
        conn = psycopg2.connect(
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASS,
            host=DB_HOST,
            port=DB_PORT
        )
        conn.autocommit = True  # Schema setup typically needs autocommit
        curr = conn.cursor()
        
        curr.execute(sql_script)
        print(f"[INFO] Schema from '{schema_file_path}' loaded successfully! [db_interface::load_schema]")
        return True
    except psycopg2.Error as e:
        print(f"[ERROR] Schema file from '{schema_file_path}' could not be loaded/read! [db_interface::load_schema] \nError: {e}")
        if not conn.autocommit:
            conn.rollback()
        return False
    finally: # Return the conn after use
        if curr:
            curr.close()
        if conn:
            conn.close()


# Methods for scanning music into the database ---------------------------------------------------------------------------------
def read_metadata(music_file_path:str) -> dict:
    metadata = {
        "title": "N/A",
        "artist": "N/A",
        "genre": "N/A",
        "duration_sec": 0
    }

    try:
        audio = MP3(music_file_path, ID3=ID3)
        if audio.tags:
            if 'TIT2' in audio.tags:
                metadata["title"] = str(audio.tags["TIT2"])
            if 'TPE1' in audio.tags:
                metadata["artist"] = str(audio.tags["TPE1"])
            if "TCON" in audio.tags:
                metadata["genre"] = str(audio.tags["TCON"])
            
        if audio.info:
            metadata["duration_sec"] = audio.info.length
    except ID3NoHeaderError as e:
        print(f"[ERROR] No ID3 header found in '{music_file_path}' [read_metadata]\n Err: {e}")
        return metadata
    except FileNotFoundError as e:
        print(f"[ERROR] Music file at '{music_file_path}' not found. [read_metadata]\n Err: {e}")
        return metadata
    except Exception as e:
        print(f"[ERROR] Unable to read/find metadata. [read_metadata]\n Err: {e}")
        return metadata
    finally:
        return metadata
    

def scan_music_files():
    total_songs_loaded = 0
    sql_query = "INSERT INTO Songs (title,artist,genre,duration_seconds,audio_file_url,similar_song_url) VALUES (%s,%s,%s,%s,%s,%s);"

    # Get connection
    conn = psycopg2.connect(
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASS,
        host=DB_HOST,
        port=DB_PORT
    )
    conn.autocommit = True
    curr = conn.cursor()

    # Get song match dictionary
    with open('app/db/matched_songs.yaml', 'r') as file:
        song_dictionary = yaml.safe_load(file)

    for song in os.listdir(MUSIC_DIRECTORY):
        if ".mp3" in song:
            file_url = f"app/db/music/{song}"
            metadata = read_metadata(MUSIC_DIRECTORY + song)
            # Create tuple of parameters
            params = (metadata["title"], metadata["artist"], metadata["genre"], int(metadata["duration_sec"]), file_url, song_dictionary[song])
            try:
                curr.execute(sql_query, params)
                total_songs_loaded += 1
            except psycopg2.Error as e:
                print(f"[ERROR] Unable fullfill transaction! [db_interface::execute_query]\n Error: {e}")
                conn.rollback()
            except Exception as e:
                print(f"[ERROR] Unable fullfill transaction! [db_interface::execute_query]\n Error: {e}")
                conn.rollback()
    conn.close()
    print(f"[INFO] Finished scanning {total_songs_loaded} songs to db. [interface::scan_music_files]")

        



class db_interface(object):
    def __init__(self):
        # Composition of conn_pool object for conn management
        self.pool = conn_pool(1, 15)

        # Show current directory in container
        print(f"[INFO] Current directory '{os.getcwd()}' [db_interface::__init__]")


    # General method for PostgreSQL queries ------------------------------------------------------------------------
    def execute_query(self, sql, params=None ,fetch_one=False, fetch_all=False, commit=False):
        try:
            result = None
            conn = self.pool.get_conn()
            curr = conn.cursor()
            
            curr.execute(sql, params)
            
            if fetch_all == True and fetch_one == False and commit == False:
                result = curr.fetchall()
            elif fetch_one == True and fetch_all == False and commit == False:
                result = curr.fetchone()
            # If a commit is requested for a DML opteration
            elif commit == True and fetch_all == False and fetch_one == False: 
                conn.commit()
            elif commit == False and fetch_one == False and fetch_all == False:
                pass # For DDL operation or SELECT where fetch is not needed.
            else:  
                print(f"[ERROR] Improper parameter sent to execute_query [db_interface::execute_query]\n Error: {e}")

        except psycopg2.Error as e:
            print(f"[ERROR] Unable fullfill transaction! [db_interface::execute_query]\n Error: {e}")
            conn.rollback()
        except Exception as e:
            print(f"[ERROR] Unable fullfill transaction! [db_interface::execute_query]\n Error: {e}")
            conn.rollback()
        finally:
            if curr:
                curr.close()
            if conn:
                conn.commit()
                self.pool.return_conn(conn)

        return result
    

    # Methods for creating database entries --------------------------------------------------------------------------
    def create_user(self, username: str, password: str) -> bool:
        try:
            self.execute_query(
                "INSERT INTO Users (username, password) VALUES (%s, %s);",
                params=(username, password),
                commit=True
            )
            return True
        except Exception as e:
            print(f"[ERROR] Unable to execute create-user query. [db_interface::create_user]\n Err: {e}")
            return False
    


    def create_song(self, title:str, artist:str, genre:str, duration:int, audio_file_url:str, similar_song_url:str) -> bool:
        try:
            self.execute_query(
                "INSERT INTO Songs (title,artist,genre,duration_seconds,audio_file_url,similar_song_url) VALUES (%s,%s,%s,%s,%s,%s);",
                params=(title,artist,genre,duration,audio_file_url,similar_song_url),
                commit=True
            )
            return True
        except Exception as e:
            print(f"[ERROR] Unable to execute create-song query. [db_interface::create_song]\n Err: {e}")
            return False
    

    def create_playlist(self, user_id:int, name:str) -> bool:
        try:
            self.execute_query(
                "INSERT INTO Playlists (user_id, name) VALUES (%s,%s);",
                params=(user_id, name),
                commit=True
            )
            return True
        except Exception as e:
            print(f"[ERROR] Unable to execute create_playlist query. [db_interface::create_playlist]\n Err: {e}")
            return False
    

    def create_playlist_song(self, playlist_id:int, song_id:int) -> bool:
        try:
            self.execute_query(
                "INSERT INTO PlaylistSongs (playlist_id, song_id) VALUES (%s,%s);",
                params=(playlist_id, song_id),
                commit=True
            )
            return True
        except Exception as e:
            print(f"[ERROR] Unable to execute create-playlist-song query. [db_interface::create_playlist_song]\n Err: {e}")
            return False
        
    
    # Methods for deleting entries from the database ----------------------------------------------------------------------
    def remove_playlist_by_id(self, playlist_id:int) -> bool:
        try:
            self.execute_query(
                "DELETE FROM Playlists WHERE playlist_id = %s",
                params=(playlist_id,),
                commit=True
            )
            return True
        except Exception as e:
            print(f"[ERROR] Unable to execute remove-playlist query. [db_interface::remove_playlist]\n Err: {e}")
            return False


    # Methods for searching the database ----------------------------------------------------------------------------------
    def get_song_by_name(self, name:str) -> list:
        try:
            result = self.execute_query(
                "SELECT * FROM Songs WHERE title LIKE %s;",
                params=(name,),
                fetch_one=True
            )
            return result
        except Exception as e:
            print(f"[ERROR] Unable find song [db_interface::get_song_by_name]\n Err: {e}")
            return []
        
        
    def get_song_by_url(self, file_url:str) -> list:
        try:
            url = f"%{file_url}%"
            result = self.execute_query(
                "SELECT * FROM Songs WHERE audio_file_url LIKE %s;",
                params=(url,),
                fetch_one=True
            )
            print(f"INTERFACE: {result}")
            return result
        except Exception as e:
            print(f"[ERROR] Unable find song [db_interface::get_song_by_url]\n Err: {e}")
            return []
    
    
    def get_song_by_id(self, id:int) -> list:
        try:
            result = self.execute_query(
                "SELECT * FROM Songs WHERE song_id = %s;",
                params=(str(id),),
                fetch_one=True
            )
            return result
        except Exception as e:
            print(f"[ERROR] Unable find song [db_interface::get_song_by_id]\n Err: {e}")
            return []
    

    def get_user_id(self, username:str, password:str):
        try:
            result = self.execute_query(
                "SELECT * FROM Users WHERE username = %s AND password = %s;",
                params=(username, password),

                fetch_one=True
            )
            return result[0] # Return the id of the user
        except Exception as e:
            print(f"[ERROR] Unable to find user. [db_interface::get_user_id]\n Err: {e}")
            return "None"
        
        
    def get_user_info(self, user_id:int) -> list:
        try:
            result = self.execute_query(
                "SELECT FROM Users WHERE user_id = %s",
                params=(user_id,),
                fetch_one=True
            )
            return result
        except Exception as e:
            print(f"[ERROR] Unable to find user. [db_interface::get_user_info]\n Err: {e}")
            return "None"
    
    
    def get_playlist_by_user_id(self, id:int) -> list:
        try:
            result = self.execute_query(
                "SELECT * FROM Playlists WHERE user_id = %s;",
                params=(str(id),),

                fetch_all=True
            )
            return result
        except Exception as e:
            print(f"[ERROR] Unable find playlists [db_interface::get_playlist_by_user_id]\n Err: {e}")
            return []
    

    def get_playlist_by_id(self, id:int) -> list:
        try:
            result = self.execute_query(
                    "SELECT * FROM Playlists WHERE playlist_id = %s;",
                    params=(str(id),),
                    fetch_one=True
                )
            return result
        except Exception as e:
            print(f"[ERROR] Unable find playlist [db_interface::get_playlist_by_id]\n Err: {e}")
            return []
    
    
    def get_playlistSongs_by_playlist_id(self, id:int):
        try:
            result = self.execute_query(
                    "SELECT song_id FROM PlaylistSongs WHERE playlist_id = %s;",
                    params=(str(id),),
                    fetch_all=True
                )
            return result
        except Exception as e:
            print(f"[ERROR] Unable find playlist songs [db_interface::get_playlistSongs_by_playlist_id]\n Err: {e}")
            return []
        
    
    # Return a list of songs in a given playlist using the playlist id.
    def get_songs_in_playlist(self, playlist_id) -> list:
        """
        Retrieves all song entries from a given playlist ID.

        Args:
            playlist_id (int): The ID of the playlist.

        Returns:
            list: A list of dictionaries, where each dictionary represents a song.
                  Returns an empty list if no songs are found or an error occurs.
        """
        songs = []
        conn = self.pool.get_conn()
        if not conn:
            return songs # Return empty list if no connection

        try:
            # Use RealDictCursor to get results as dictionaries (column_name: value)
            with conn.cursor(cursor_factory=RealDictCursor) as curr:
                query = """
                SELECT
                    s.song_id, s.title, s.artist, s.genre, s.duration_seconds, s.audio_file_url
                FROM
                    songs s
                JOIN
                    PlaylistSongs ps ON s.song_id = ps.song_id
                JOIN
                    Playlists p ON ps.playlist_id = p.playlist_id
                WHERE
                    p.playlist_id = %s;
                """
                curr.execute(query, (playlist_id,)) # Pass the playlist_id as a tuple
                songs = curr.fetchall() # Fetch all matching rows
        except Error as e:
            print(f"Error executing query to get songs for playlist {playlist_id}: {e}")
        finally:
            if curr:
                curr.close()
            if conn:
                self.pool.return_conn(conn)

        return songs
    