from logic import logic_tools

tools = logic_tools()

#tools.process_directory()
best = tools.get_most_similar_song("03 - Queen - Another One Bites the Dust.mp3")
print(f"Best match: {best}")
