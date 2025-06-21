# Audio Backend
### Explanation:
This directory contains the Python application files for the
Python backend application.
### Directory Information:
- `app/` This is where the Python backend application files are stored.
- `app/db/` This is where database resources and the database interface is stored.
- `app/db/music/` This is where music files for the Bitbox library are to be stored.
- `app/tests/` This is where unit test modules and scripts are stored.
### Development Information:
This application is developed using Python version `3.13`.
The app uses Flask for backend routes. You can find informationn on
the backend api routes at `audio-backend/app/README.md`.

### Important Development Guidelines:
When the Python app is functional, do not forget to generate a
requirements.txt file with "pip freeze > requirements.txt".
The requirements file allows you to quickly setup a Python envirnment
using the exact dependancies stored in the file.
