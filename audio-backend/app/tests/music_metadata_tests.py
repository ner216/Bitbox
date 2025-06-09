import sys
import os

# These tests are designed to be run seperate from project.

# Get absolute path of the directory containing 'app'
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(current_dir, '..', '..'))

# Add project to sys.path
sys.path.append(project_root)

# Import class to be tested
from app.db.music_metadata import read_metadata

# Enter the path to a single music file for the `test_single_file()` test
SINGLE_MUSIC_FILE_PATH = "app/tests/.music/Bird_Set_Free.mp3"

def test_single_file():
    print("Starting test to read metadata from a single music file:")
    data = read_metadata(music_file_path=SINGLE_MUSIC_FILE_PATH)
    print(data)
    print("TEST COMPLETE\n")



# Run tests
test_single_file()