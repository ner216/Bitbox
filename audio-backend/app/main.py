from db.interface import db_interface # Database interface
from db.interface import wait_for_db # Function to pause startup unill the database is running.

print("[INFO] Backend application has started.")

# Run function to wait for db connection
wait_for_db(timeout=20)
# Create database interface object
database = db_interface()
database.load_schema("app/db/bitbox_schema.sql")
database.scan_music_files()

# Test scripts for unit testing, uncomment the tests you want to run

#from tests.db_interface_tests import run_all_tests
#db_test_results = run_all_tests() # Run all database tests

#from tests.music_metadata_tests import test_single_file
#test_single_file()

#song_table = database.execute_query("SELECT * FROM Songs", fetch_all=True)
#for i in song_table:
    #print(i)




