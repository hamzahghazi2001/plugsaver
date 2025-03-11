from datetime import datetime

def calculate_electricity_cost(kwh):
    if kwh <= 2000:
        price_per_kwh = 0.20
    elif kwh <= 4000:
        price_per_kwh = 0.24
    elif kwh <= 6000:
        price_per_kwh = 0.28
    else:
        price_per_kwh = 0.33
    
    total_cost = kwh * price_per_kwh
    return total_cost

def calculate_device_kwh(device_type, hours_on):
    #this can be changed based on table
    device_power_usage = {
        'light_bulb': 0.06,
        'fan': 0.075,
        'heater': 1.5,
        'ac': 2.0
    }
    if device_type not in device_power_usage:
        raise ValueError("Unknown device type")
    kwh = device_power_usage[device_type] * hours_on
    return kwh

#start time and endtime needs to be passed to backend from front end
def increment_usage(device_type, start_time, end_time):    
    hours_on = (end_time - start_time).total_seconds() / 3600
    # Calculate the cost based on the device type and hours on
    total_use = calculate_device_kwh(device_type, hours_on)
    return total_use