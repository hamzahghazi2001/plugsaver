import asyncio
from datetime import datetime, timedelta
from supabase import create_client
import app.config as config

supabase = create_client(config.SUPABASE_URL, config.SUPABASE_KEY)

async def json_energy_consumption(household_code):
    while True:
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
        weekly_average = daily_average * 7
        monthly_average = daily_average * 30
        yearly_average = daily_average * 365

        for i in range(7):
            day_consumption[i] = {"name": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i], "value": day_consumption[i]}

        for i in range(52):
            week_consumption[i] = {"name": f"Week {i + 1}", "value": weekly_average}

        for i in range(12):
            month_consumption[i] = {"name": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i], "value": monthly_average}

        for i in range(2):
            year_consumption[i] = {"name": str(today.year + i), "value": yearly_average}

        result = {
            "day": day_consumption,
            "week": week_consumption,
            "month": month_consumption,
            "year": year_consumption
        }

        # Need help with this part
        print(result)
        await asyncio.sleep(10)  # Run every 10 seconds