from db.interface import db_interface

print("[INFO] Backend application is starting...")

print("[INFO] Starting db test...")
interface = db_interface()
interface.start()
interface.load_schema("app/db/bitbox_schema.sql")
interface.execute_query("SELECT * FROM Songs")

print("[INFO] TEST COMPLETE!")