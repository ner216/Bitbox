import psycopg2
from psycopg2 import OperationalError
from psycopg2.pool import SimpleConnectionPool
import os

# Get envirnment variables from linux container
DB_NAME = os.getenv("DB_NAME")
DB_HOST = os.getenv("DB_HOST")
DB_USER = os.getenv("DB_USER")
DB_PASS = os.getenv("DB_PASSWORD")
DB_PORT = os.getenv("DB_PORT")

class db_interface(object):
    def __init__(self):
        # Connection and cursur variables for psycopg2
        self.conn = None
        self.curr = None

        # Show current directory in container
        print(f"[INFO] Current directory '{os.getcwd()}' [db_interface::__init__]")


    # A function to initialize the connection between the back-end and the database
    def start(self):
        try:
            self.conn = psycopg2.connect(database=DB_NAME, user=DB_USER, password=DB_PASS, host=DB_HOST, port=DB_PORT)
            print("[INFO] Connection to database successful! [db_interface::start]")
        except Exception as e:
            print(f"[ERROR] unable to connect to database. [db_interface::start] \nError: {e}")
            return

    def load_schema(self, schema_file_path) -> bool:
        if not os.path.exists(schema_file_path):
            print("[ERROR] Schema file does not exist! [db_interface::load_schema]")
            return False

        try:
            with open(schema_file_path, "r") as file:
                sql_script = file.read()

            self.curr = self.conn.cursor()
            self.curr.execute(sql_script) 
            print(f"[INFO] Schema from '{schema_file_path}' loaded successfully! [db_interface::load_schema]")
            return True
        except psycopg2.Error as e:
            print(f"[ERROR] Schema file from '{schema_file_path}' could not be loaded/read! [db_interface::load_schema] \nError: {e}")
            if not self.conn.autocommit:
                self.conn.rollback()
            return False
        finally:
            if self.curr:
                self.curr.close()
            if self.conn:
                self.conn.close()


    def execute_query(self, sql, params=None ,fetch_one=False, fetch_all=False, commit=False):
        try:
            if self.conn == None:
                return None # Return none if database is not connected
            
            self.curr.execute(sql, params)
            
            if fetch_all == True:
                result = self.curr.fetchall()
            elif fetch_one == True:
                result = self.curr.fetchone()
            elif commit == True: # If a commit is requested for a DML opteration
                self.conn.commit()
            else: # For DDL operation or SELECT where fetch is not needed. 
                pass
        except psycopg2.Error as e:
            print(f"[ERROR] Unable fullfill transaction! [db_interface::execute_query]\n Error: {e}")
            self.conn.rollback()
        except Exception as e:
            print(f"[ERROR] Unable fullfill transaction! [db_interface::execute_query]\n Error: {e}")
            self.conn.rollback()
        finally:
            if self.curr:
                self.curr.close()
            if self.conn:
                self.conn.close()

        return result


    def test(self):
        curr = self.conn.cursor()

        curr.execute("SELECT * FROM Songs")

        records = curr.fetchall()
        print(records)