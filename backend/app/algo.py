import asyncio
import time
from datetime import datetime
from supabase import create_client
import app.config as config

supabase = create_client(config.SUPABASE_URL, config.SUPABASE_KEY)

async def is_in_analytics(device_id):
    # Check if the device is already in the analytics table
    response = supabase.table('analytics').select('*', count='exact').eq('device_id', device_id).is_('end_time', None).execute()
    return response.count > 0

async def insert_new_analytics_entry(household_code, device_id, user_id, start_time):
    # Convert datetime to string
    start_time_str = start_time.isoformat()
    # Insert a new row into the analytics table with start_time
    response = supabase.table('analytics').insert({
        'household_code': household_code,
        'device_id': device_id,
        'user_id': user_id,
        'start_time': start_time_str
    }).execute()

async def update_device_wattage(device_id, power):
    # Get the current energy_consumed value
    response = supabase.table('analytics').select('energy_consumed').eq('device_id', device_id).is_('end_time', None).execute()
    current_energy_consumed = response.data[0]['energy_consumed']
    
    # If current_energy_consumed is None, set it to 0
    if current_energy_consumed is None:
        current_energy_consumed = 0
    
    # Update the energy_consumed in the analytics table for the given device
    response = supabase.table('analytics').update({
        'energy_consumed': current_energy_consumed + power
    }).eq('device_id', device_id).is_('end_time', None).execute()

async def get_off_devices_for_household(household_code):
    # Get the list of devices that have turned off for the given household
    response = supabase.table('devices').select('device_id').eq('household_code', household_code).eq('isOn', False).execute()
    return response.data if response.data else []

async def finalize_device_entry(device_id, end_time):
    # Convert datetime to string
    end_time_str = end_time.isoformat()
    # Finalize the entry in the analytics table by setting the end_time
    response = supabase.table('analytics').update({
        'end_time': end_time_str
    }).eq('device_id', device_id).is_('end_time', None).execute()

async def calculate_live_consumption(household_code):
    while True:
        response = supabase.table('devices').select('device_id', 'power', 'user_id').eq('household_code', household_code).eq('isOn', True).execute()

        # Fetch devices with matching household_code and isOn = TRUE
        for device in response.data:
            device_id = device["device_id"]
            user_id = device["user_id"]
            power_str = device["power"]

            # Extract numeric part from power string and convert to integer
            power = int(power_str.rstrip('W'))

            # If not in analytics, insert a new row with start_time
            if not await is_in_analytics(device_id):
                start_time = datetime.now()
                await insert_new_analytics_entry(
                    household_code, device_id, user_id, start_time
                )
            
            # Update energy_consumed in analytics
            await update_device_wattage(device_id, power)

        # Check if any devices have turned off and finalize those entries
        off_devices = await get_off_devices_for_household(household_code)
        for device in off_devices:
            device_id = device["device_id"]
            end_time = datetime.now()
            # Finalize the entry for the device
            await finalize_device_entry(device_id, end_time)
            print(f"Device {device_id} has been turned off and its entry finalized.")

        # Wait for 5 seconds before the next iteration
        await asyncio.sleep(5)