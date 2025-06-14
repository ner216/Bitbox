import psycopg2
from psycopg2 import OperationalError
from psycopg2.pool import SimpleConnectionPool
from mutagen.mp3 import MP3
from mutagen.id3 import ID3NoHeaderError, ID3
import os
import time
import socket

# Get envirnment variables from linux container
DB_NAME = os.getenv("DB_NAME")
DB_HOST = os.getenv("DB_HOST")
DB_USER = os.getenv("DB_USER")
DB_PASS = os.getenv("DB_PASSWORD")
DB_PORT = os.getenv("DB_PORT")

MUSIC_DIRECTORY = "app/db/.music/"

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



class db_interface(object):
    def __init__(self):
        # Composition of conn_pool object for conn management
        self.pool = conn_pool(1, 15)

        # Show current directory in container
        print(f"[INFO] Current directory '{os.getcwd()}' [db_interface::__init__]")


    # Method to load database schema into Postgres container -------------------------------------------------------
    def load_schema(self, schema_file_path) -> bool:
        if not os.path.exists(schema_file_path):
            print("[ERROR] Schema file does not exist! [db_interface::load_schema]")
            return False

        try:
            with open(schema_file_path, "r") as file:
                sql_script = file.read()

            # Get connection from pool
            conn = self.pool.get_conn()
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
                conn.commit()
                curr.close()
            if conn:
                self.pool.return_conn(conn)


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
    def create_user(self, username: str, password: str):
        self.execute_query(
            "INSERT INTO Users (username, password) VALUES (%s, %s)",
            params=(username, password),
            commit=True
        )
    

    def create_song(self, title:str, artist:str, genre:str, duration:int, audio_file_url:str):
        self.execute_query(
            "INSERT INTO Songs (title,artist,genre,duration_seconds,audio_file_url) VALUES (%s,%s,%s,%s,%s)",
            params=(title,artist,genre,duration,audio_file_url),
            commit=True
        )
    

    def create_playlist(self, user_id:int, name:str, desc:str):
        self.execute_query(
            "INSERT INTO Playlists (user_id, name, description) VALUES (%s,%s,%s)",
            params=(user_id, name, desc),
            commit=True
        )
    

    def create_playlist_song(self, playlist_id:int, song_id:int):
        self.execute_query(
            "INSERT INTO PlaylistSongs (playlist_id, song_id) VALUES (%s,%s)",
            params=(playlist_id, song_id),
            commit=True
        )
    

    # Methods for searching the database ----------------------------------------------------------------------------------
    def get_song_by_name(self, name:str) -> list:
        result = self.execute_query(
            "SELECT * FROM Songs WHERE name = %s",
            params=(name),
            fetch_one=True
        )

        return result
    
    
    def get_song_by_id(self, id:int) -> list:
        result = self.execute_query(
            "SELECT * FROM Songs WHERE id = %s",
            params=(id),
            fetch_one=True
        )

        return result
    

    def get_user_by_id(self, id:int) -> list:
        result = self.execute_query(
            "SELECT * FROM Users WHERE id = %s",
            params=(id),
            fetch_one=True
        )

        return result
    
    
    def get_playlist_by_user_id(self, id:int) -> list:
        result = self.execute_query(
            "SELECT * FROM Playlists WHERE user_id = %s",
            params=(id),
            fetch_all=True
        )

        return result
    

    def get_playlist_by_id(self, id:int) -> list:
        result = self.execute_query(
                "SELECT * FROM Playlists WHERE id = %s",
                params=(id),
                fetch_one=True
            )

        return result
    
    
    def get_playlistSongs_by_playlist_id(self, id:int):
        result = self.execute_query(
                "SELECT * FROM PlaylistSongs WHERE playlist_id = %s",
                params=(id),
                fetch_all=True
            )

        return result
    
    
    # Methods for scanning music into the database ---------------------------------------------------------------------------------
    def read_metadata(self, music_file_path:str) -> dict:
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
        

    def scan_music_files(self):
        # Create interface object
        database = db_interface()

        for song in os.listdir(MUSIC_DIRECTORY):
            if ".mp3" in song:
                file_url = f"app/db/.music/{song}"
                metadata = self.read_metadata(MUSIC_DIRECTORY + song)
                database.create_song(metadata["title"], metadata["artist"], metadata["genre"], int(metadata["duration_sec"]), file_url)
            