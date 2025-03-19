from datetime import datetime, timedelta
from supabase import create_client
import app.config as config

supabase = create_client(config.SUPABASE_URL, config.SUPABASE_KEY)

# Dictionary to keep track of device sessions
device_sessions = {}

def start_device_session(device_id):
    # Fetch the device's wattage from the Supabase table
    device = supabase.table("devices").select("power").eq("device_id", device_id).execute()
    if not device.data:
        return {"success": False, "message": "Device not found."}

    wattage = device.data[0]["power"]
    start_time = datetime.now()

    # Store the session start time and wattage
    device_sessions[device_id] = {
        "start_time": start_time,
        "wattage": wattage
    }

    return {"success": True, "message": "Device session started."}

def calculate_live_consumption(device_id):
    if device_id not in device_sessions:
        return {"success": False, "message": "Device session not found."}

    session = device_sessions[device_id]
    start_time = session["start_time"]
    wattage = session["wattage"]

    # Calculate the duration in hours
    duration = (datetime.now() - start_time).total_seconds() / 3600

    # Calculate the live consumption in kWh
    live_consumption = (wattage / 1000) * duration

    return {"success": True, "live_consumption": live_consumption}

def end_device_session(device_id):
    if device_id not in device_sessions:
        return {"success": False, "message": "Device session not found."}

    session = device_sessions[device_id]
    start_time = session["start_time"]
    wattage = session["wattage"]

    # Calculate the duration in hours
    end_time = datetime.now()
    duration = (end_time - start_time).total_seconds() / 3600

    # Calculate the total consumption in kWh
    total_consumption = (wattage / 1000) * duration

    # Store the session data in the Supabase table
    supabase.table("device_sessions").insert({
        "device_id": device_id,
        "start_time": start_time.isoformat(),
        "end_time": end_time.isoformat(),
        "duration": duration,
        "total_consumption": total_consumption
    }).execute()

    # Remove the session from the dictionary
    del device_sessions[device_id]

    return {"success": True, "message": "Device session ended."}