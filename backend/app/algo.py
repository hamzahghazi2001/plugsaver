from datetime import datetime, timedelta
from supabase import create_client
import app.config as config
import time

supabase = create_client(config.SUPABASE_URL, config.SUPABASE_KEY)
supabase.table("analytics").update({"energy_used": wattage}).eq("device_id", device_id).execute()
def calculate_live_consumption(device_id):
    with session_lock:
        if device_id not in device_sessions:
            return {"success": False, "message": "Device session not found."}

        session = device_sessions[device_id]
        wattage = session["wattage"]

    def update_consumption():
        while True:
            with session_lock:
                if device_id not in device_sessions:
                    break

            # Update the database with the total wattage used
            supabase.table("analytics").update({"energy_used": wattage}).eq("device_id", device_id).execute()

            # Wait for 5 seconds before updating again
            time.sleep(5)

    # Start a new thread to update the consumption
    Thread(target=update_consumption).start()

    return {"success": True, "wattage": wattage}