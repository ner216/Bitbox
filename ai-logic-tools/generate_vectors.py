from logic import logic_tools

# Initialize logic_tools class
tools = logic_tools()

# Call process directory function which will generate vectors for each music file
generate_vectors = input("Generate vectors for music(create vector file)? (y/n): ")
if generate_vectors == "y":
    tools.process_directory()

