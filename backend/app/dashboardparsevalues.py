import asyncio
from datetime import datetime, timedelta
from supabase import create_client
import app.config as config

supabase = create_client(config.SUPABASE_URL, config.SUPABASE_KEY)

async def json_energy_consumption(household_code):
    today = datetime.now().date()
    start_of_week = today - timedelta(days=today.weekday())  # Monday of the current week
    end_of_week = start_of_week + timedelta(days=6)  # Sunday of the current week

    response = supabase.table('analytics').select('*').eq('household_code', household_code).execute()
    data = response.data

    day_consumption = [0] * 7
    week_consumption = [0] * 52
    month_consumption = [0] * 12
    year_consumption = [0] * 2  # Assuming we want to show data for the current and next year

    for entry in data:
        start_time = datetime.fromisoformat(entry['start_time'])
        energy_consumed = entry['energy_consumed'] / 1000  # Convert wattage to kWh

        if start_of_week <= start_time.date() <= end_of_week:
            day_index = start_time.weekday()
            day_consumption[day_index] += energy_consumed

    # Extrapolate values for week, month, and year
    daily_average = sum(day_consumption) / 7
    yearly_average = daily_average * 365

    # Adjust weekly consumption based on the month
    for i in range(52):
        month = (i // 4) % 12  # Approximate month index
        if month in [5, 6, 7, 8]:  # Summer months (June to September)
            weekly_average = daily_average * 7 * 1.2  # 20% higher consumption
        elif month in [11, 0, 1]:  # Winter months (December to February)
            weekly_average = daily_average * 7 * 0.8  # 20% lower consumption
        else:
            weekly_average = daily_average * 7  # Normal consumption
        week_consumption[i] = {"name": f"Week {i + 1}", "value": weekly_average}

    # Adjust monthly consumption based on the season
    for i in range(12):
        if i in [5, 6, 7, 8]:  # Summer months (June to September)
            monthly_average = daily_average * 30 * 1.2  # 20% higher consumption
        elif i in [11, 0, 1]:  # Winter months (December to February)
            monthly_average = daily_average * 30 * 0.8  # 20% lower consumption
        else:
            monthly_average = daily_average * 30  # Normal consumption
        month_consumption[i] = {"name": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i], "value": monthly_average}

    for i in range(7):
        day_consumption[i] = {"name": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i], "value": day_consumption[i]}

    for i in range(2):
        year_consumption[i] = {"name": str(today.year + i), "value": yearly_average}

    result = {
        "day": day_consumption,
        "week": week_consumption,
        "month": month_consumption,
        "year": year_consumption}
    return result

async def roomjson(household_code):
    # Fetch devices and rooms for the given household code
    devices_response = supabase.table('devices').select('*').eq('household_code', household_code).execute()
    devices = devices_response.data

    rooms_response = supabase.table('rooms').select('*').eq('household_code', household_code).execute()
    rooms = rooms_response.data

    # Create a dictionary to map room_id to room_name
    room_id_to_name = {room['room_id']: room['room_name'] for room in rooms}

    # Initialize a dictionary to store the total consumption per room
    room_consumption = {room['room_name']: 0 for room in rooms}

    # Fetch analytics data for the given household code
    analytics_response = supabase.table('analytics').select('*').eq('household_code', household_code).execute()
    analytics = analytics_response.data

    # Calculate total consumption per room
    total_consumption = 0
    for entry in analytics:
        device_id = entry['device_id']
        energy_consumed = entry['energy_consumed'] / 1000  # Convert wattage to kWh
        total_consumption += energy_consumed

        # Find the room_id for the device
        device = next((device for device in devices if device['device_id'] == device_id), None)
        if device:
            room_id = device['room_id']
            room_name = room_id_to_name.get(room_id)
            if room_name:
                room_consumption[room_name] += energy_consumed

    # Convert the room consumption dictionary to the desired JSON format with percentages
    result = [{"name": room_name, "value": int((consumption / total_consumption) * 100)} for room_name, consumption in room_consumption.items()]
    return result

async def devicecatjson(household_code):
    # Fetch devices for the given household code
    devices_response = supabase.table('devices').select('*').eq('household_code', household_code).execute()
    devices = devices_response.data

    # Initialize a dictionary to store the total consumption per device category
    category_consumption = {}

    # Fetch analytics data for the given household code
    analytics_response = supabase.table('analytics').select('*').eq('household_code', household_code).execute()
    analytics = analytics_response.data

    # Calculate total consumption per device category
    for entry in analytics:
        device_id = entry['device_id']
        energy_consumed = entry['energy_consumed'] / 1000  # Convert wattage to kWh

        # Find the device category for the device
        device = next((device for device in devices if device['device_id'] == device_id), None)
        if device:
            category = device['device_category']
            if category in category_consumption:
                category_consumption[category] += energy_consumed
            else:
                category_consumption[category] = energy_consumed

    # Convert the category consumption dictionary to the desired JSON format
    result = [{"name": category, "usage": consumption} for category, consumption in category_consumption.items()]
    return result

async def statsjson(household_code):
    # Constants
    KG_CO2_PER_KWH = 0.45  # Example value for kg of carbon per kWh
    COST_PER_KWH = 0.29  # Cost per kWh in dollars
    MAX_ENERGY_CONSUMPTION = 1000  # Example maximum energy consumption in kWh
    MIN_ENERGY_CONSUMPTION = 0  # Minimum energy consumption in kWh

    # Fetch devices for the given household code
    devices_response = supabase.table('devices').select('*').eq('household_code', household_code).execute()
    devices = devices_response.data

    # Fetch analytics data for the given household code
    analytics_response = supabase.table('analytics').select('*').eq('household_code', household_code).execute()
    analytics = analytics_response.data

    # Initialize variables
    total_energy_consumed = 0
    peak_power_usage = 0
    device_energy_consumption = {}

    # Calculate total energy consumption and peak power usage
    for entry in analytics:
        device_id = entry['device_id']
        energy_consumed = entry['energy_consumed'] / 1000  # Convert wattage to kWh
        total_energy_consumed += energy_consumed

        # Track energy consumption per device to find peak power usage
        if device_id in device_energy_consumption:
            device_energy_consumption[device_id] += energy_consumed
        else:
            device_energy_consumption[device_id] = energy_consumed

    # Find the device with the highest energy consumption (peak power usage)
    peak_power_usage = max(device_energy_consumption.values(), default=0)

    # Calculate carbon footprint and cost savings
    carbon_footprint = total_energy_consumed * KG_CO2_PER_KWH
    cost_savings = total_energy_consumed * COST_PER_KWH

    # Calculate efficiency score
    if total_energy_consumed <= MIN_ENERGY_CONSUMPTION:
        efficiency_score = 100
    elif total_energy_consumed >= MAX_ENERGY_CONSUMPTION:
        efficiency_score = 0
    else:
        efficiency_score = 100 - ((total_energy_consumed - MIN_ENERGY_CONSUMPTION) / (MAX_ENERGY_CONSUMPTION - MIN_ENERGY_CONSUMPTION) * 100)

    # Prepare the result in the desired JSON format
    result = {
        "efficiencyScore": round(efficiency_score),
        "electricityUsage": round(total_energy_consumed, 3),
        "peakPowerUsage": round(peak_power_usage, 3),
        "carbonFootprint": round(carbon_footprint, 3),
        "costSavings": round(cost_savings, 2),
    }
    return result