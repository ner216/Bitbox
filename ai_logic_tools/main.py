from logic import logic_tools
import os
import yaml

tools = logic_tools()

def find_all_similar():
    data = {}
    
    generate_vectors = input("Generate vectors for music(create vector file)? (y/n): ")
    if generate_vectors == "y":
        tools.process_directory()
    
    for song in os.listdir("music"):
        most_similar_song = tools.get_most_similar_song(song)
        data[song] = most_similar_song
        print(f"Success -> {song} is most similar to: {most_similar_song}")

    # Save to YAML file
    with open('mathed_songs.yaml', 'w') as file:
        yaml.dump(data, file, default_flow_style=False)
    print("Done.")

find_all_similar()