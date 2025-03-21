import time
from datetime import datetime, timedelta
from supabase import create_client
import app.config as config
import time


def calculate_live_consumption(household_code):
    supabase = create_client(config.SUPABASE_URL, config.SUPABASE_KEY)
    query = f"SELECT device_id, power, user_id FROM devices WHERE household_code = {recipient_email} AND isOn = TRUE"
    response = supabase.rpc("sql", {"query": query}).execute()
    """
    Continuously checks devices that match the given household_code and are turned on.
    Inserts them into analytics if not present, updates their wattage every 5 seconds,
    and when a device turns off, ends that entry by setting its duration.
    """

    while True:
        # Fetch devices with matching household_code and isOn = TRUE
        on_devices = get_on_devices_for_household(household_code)  # Placeholder

        for device in on_devices:
            device_id = device["device_id"]
            user_id = device["user_id"]
            power = device["power"]

            # If not in analytics, insert a new row with start_time and date
            if not is_in_analytics(device_id):
                insert_new_analytics_entry(
                    household_code, device_id, user_id, datetime.now()
                )
            # Update wattage in analytics
            update_device_wattage(device_id, power)

        # Check if any devices have turned off and finalize those entries
        off_devices = get_off_devices_for_household(household_code)
        for device in off_devices:
            device_id = device["device_id"]
            finalize_device_entry(device_id, datetime.now())

        time.sleep(5)