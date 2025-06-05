from db.interface import db_interface # Database interface
from db.interface import wait_for_db # Function to pause startup unill the database is running.

print("[INFO] Backend application has started.")

# Run function to wait for db connection
wait_for_db(timeout=20)

# Test scripts for unit testing, uncomment the tests you want to run

from tests.db_interface_tests import run_all_tests
db_test_results = run_all_tests() # Run all database tests



