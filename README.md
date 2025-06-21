# Overview:

Bitbox is an online music web-app; engineered for those who prioritize the sound of their music. Bitbox uses algorithms to intuitively help you discover new music that has the sound characteristics you love.

# Quick setup:

### Clone the repository:

> Run: `git clone https://github.com/ner216/Bitbox.git`  

### Software Requirements:
> - Docker engine
> - Python 3.9

### Setting up AI features:

*Run the following commands in the project directory*
> 1. Add your vggish checkpoint file to `ai-logic-tools/models/vggish/`
>    - This file stores pre-trained data for the ai model.
> 2. Add the music library to `audio-backend/app/db/music/`
> 3. Create a **python 3.9** virtual environment in `ai-logic-tools/`
>    - Run: `python3.9 -m venv .venv`
> 4. Activate virtual environment 
>    - Run: `. .venv/bin/activate`
> 5. Install python modules with requirements file.
>    - Run: `.venv/bin/pip3 install -r requirements.txt`
> 6. Generate the song match data file.
>    - Run: `.venv/bin/python3 find_similar_songs.py`

### Running the project:
> In the root of the project directory, run: `sudo docker compose up`.
> This will build the entire project and run it.

*For Instructions regarding the web-app itself, see `docs-app-manual/README.md`.*

# Project Overview/Explanation:
This application consists of three parts; 
- A react-native front-end website
    - Location: `bitbox/`
- A python backend Flask application
    - Location: `audio-backend/`
- A postgres database.
    - This is a pre-made docker image that is pulled from dockerhub
    - Database resources are at `audio-backend/app/db/`

> Each of the above parts have there own docker container--outlined in the docker-compose.yaml file. 
> There is another, seperate python application inside of the `ai_logic_tools/` directory. 
> This application scans the music library and generates a list of song similarity matches. 
> These are used for Bitbox's 'find similar song' feature.
### For Development:
> The audio-backend and front-end website docker containers can be run seperate from the other containers. 
> You can do this by building and running the dockerfile.
> The dockerfile for the audio-backend is located at `audio-backend/dockerfile`. 
> The dockerfile for the front-end is located at `bitbox/dockerfile`.

# Setup tips for Windows:
*For running the front-end web-app seperate without a docker container:*
> Download NVM from: https://github.com/coreybutler/nvm-windows/releases  
> Then, run the `nvm-setup.exe` file. **Be sure to allow nvm to manage system path.**

> To install Node.js, run:  
> `nvm install lts`  
> Then: `nvm use lts`

> Download and install Java from: https://adoptium.net

> Install Visual Studio Code: https://code.visualstudio.com/  
> (Optional) Install Android Studio (for emulator use): https://developer.android.com/studio

> Install Docker Desktop: https://www.docker.com/products/docker-desktop  
> Enable WSL 2 integration during installation

### (Optional) Run the mobile app:

> Open the `android` folder in Android Studio  
> Launch an emulator or connect a device  
> Then run the app using Android Studio or:  
> `npx react-native run-android`

### Setup on Windows(via Docker):

> Open your **WSL terminal**, navigate to the project directory, and run:  
> `sudo docker compose up`  
> This will start all backend services (API, databases, etc.) automatically.

> **Note:** The first time you run this, Docker will pull and build all necessary images — this may take several minutes.

---

### Contact:

> For issues, open a GitHub issue here: https://github.com/ner216/Bitbox/issues
