from flask import Flask
from flask_cors import CORS

from db.interface import wait_for_db, load_schema, scan_music_files
import os

wait_for_db(40)
if not os.path.exists("app/db/.setup_done"):
    load_schema("app/db/bitbox_schema.sql")
    scan_music_files()
    with open("app/db/.setup_done", "w") as f:
        f.write("setup complete")
    print("[INFO] Setup complete.")
else:
    print("[INFO] Database already set, skipping setup process.")


from routes import api, APIRoutes
app = Flask(__name__)
CORS(app)
APIRoutes()  # Initializes and binds the routes
app.register_blueprint(api)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)





