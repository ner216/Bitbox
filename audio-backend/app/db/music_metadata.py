from mutagen.mp3 import MP3
from mutagen.id3 import ID3NoHeaderError, ID3
import os

# This file contains functions to read music metadata

# Enter path to music storage location here
MUSIC_DIRECTORY = ""


def read_metadata(music_file_path:str) -> dict:
    metadata = {
        "title": "N/A",
        "artist": "N/A",
        "genre": "N/A",
        "duration_sec": "N/A"
    }

    try:
        audio = MP3(music_file_path, ID3=ID3)
        print(audio.tags)
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
    

#def scan_music_files(music_library_path):

        