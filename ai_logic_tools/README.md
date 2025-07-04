# Generate the matched_songs file required for Bitbox:
Use the instructions below to generate the `matched_songs.yaml` file
which is used by Bitbox to find song recommendations.

## Setup Instructions:
**REQUIRES PYTHON VERSION 3.9**
### Create a virtual env here:
>`python3 -m venv .venv`
### Activate:
>`. .venv/bin/activate`
### Install dependancies:
>`.venv/bin/pip3 install -r requirements.txt`
### Run the main script:
>`.venv/bin/python3 find_similar_songs.py`
**Now the application is ready to be run with `sudo docker compose up`.**
---
## Technical Information for Development:
This application inside of the `ai_logic_tools/` directory is seperate
from the Python backend application located in `audio-backend/` directory.
The purpose of this application is to pre-process all of the music 
in the Bitbox library rather than processing in the backend at runtime. This
drastically improves application performance.

