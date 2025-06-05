from db.interface import db_interface


def run_all_tests() -> bool:
    print("[INFO] Running db tests...")
    test_results = [basic_query()]
    if False in test_results:
        return False
    else:
        return True

def basic_query() -> bool:
    try:
        print("[INFO] Starting db basic query test...")
        interface = db_interface()
        interface.load_schema("app/db/bitbox_schema.sql")

        result = interface.execute_query(
            "INSERT INTO users (username, email) VALUES ('example_user', 'email');",
            commit=True
            )
        print(f"TEST INSERT:\n{result}")

        result = interface.execute_query("SELECT * FROM Users;", fetch_all=True)
        print(f"TEST SELECT:\n{result}")
        print("[INFO] TEST IS SUCCESSFULL!")
        return True
    except Exception as e:
        print(f"[ERROR] basic query test failed! [db_test::basic_query]\n Error: {e}")
        return False