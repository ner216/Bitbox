from logic import logic_tools
import os

tools = logic_tools()

# Get the directory where myscript.py is located
current_dir = os.path.dirname(__file__)

# Build the relative path to the YAML file
db_dir_path = os.path.join(current_dir, '..', 'audio-backend', 'app', 'db')

# Normalize the path
db_dir_path = os.path.abspath(db_dir_path)


def find_all_similar():
    data = {}
    
    generate_vectors = input("Generate vectors for music(create vector file)? (y/n): ")
    if generate_vectors == "y":
        tools.process_directory()

find_all_similar()