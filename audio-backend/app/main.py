from flask import Flask
from flask_cors import CORS

from db.interface import wait_for_db, load_schema, scan_music_files
import os

# Stores if db is set up. 1 or 0
DB_SETUP_STAT = os.environ.get("DB_SETUP_STAT")

# Wait for db to start
wait_for_db(40)
if DB_SETUP_STAT == "0":
    load_schema("app/db/bitbox_schema.sql")
    scan_music_files()
    os.environ['DB_SETUP_STATUS'] = "1" # stop setup process from repeating
elif DB_SETUP_STAT == "1":
    print("[INFO] Database already set, skipping setup process.")
else:
    print("[ERROR] DB_SETUP_STAT env variable is not valid. Database not loaded.")

from routes import api, APIRoutes
app = Flask(__name__)
CORS(app)
APIRoutes()  # Initializes and binds the routes
app.register_blueprint(api)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)





