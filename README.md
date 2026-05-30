# Overview:

Bitbox is an online music web-app; engineered for those who prioritize the sound of their music. Bitbox uses algorithms to intuitively help you discover new music that has the sound characteristics you love.

# Quick setup:

### Clone the repository:

> Run: `git clone https://github.com/ner216/Bitbox.git`  

### Software Requirements:
> - Docker engine
> - Python 3.9.23
> - Linux system/WSL

### Get required files:
This project uses the VGGish pre-trained model by TensorFlow.
- You can find this repository [HERE](https://github.com/tensorflow/models/tree/master)
- You need to download the `vggish_model.ckpt` file from [HERE](https://github.com/tensorflow/models/blob/master/research/audioset/vggish/README.md)
- You must add the downloaded `vggish_model.ckpt` file to `ai-logic-tools/models/vggish/`

This project uses a standalone audio library for serving music. To add music to Bitbox:
- Add your `.mp3` music files to the `audio-backend/app/db/music/` directory.

### Setting up AI features:

*Run the following commands in the project directory*
> 1. Create a **python 3.9.23** virtual environment in `ai-logic-tools/`
>    - Run: `python3.9 -m venv .venv`
> 2. Activate virtual environment 
>    - Run: `. .venv/bin/activate`
> 3. Install python modules with requirements file.
>    - Run: `.venv/bin/pip3 install -r requirements.txt`
> 4. Generate the song match data file.
>    - Run: `.venv/bin/python3 generate_vectors.py`

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

### Setup on Windows(via Docker):

> Using Ubuntu 24.04LTS in WSL, you can use the Docker snap package with `sudo snap install docker`.
> Next, navigate to the project directory, and run: `sudo docker compose up`  
> This will start all three containers(Postgres database, Python back-end, React front-end).

> **Note:** The first time you run this, Docker will pull and build all necessary images — this may take several minutes.

---
### How can I contribute to Bitbox?
For contribution guidelines for the Bitbox repository, see the `contribute.md` file in the root of
the Bitbox repository.


### Contact:

> For issues, open a GitHub issue here: https://github.com/ner216/Bitbox/issues
