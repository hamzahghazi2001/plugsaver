import time

def simulate_energy_consumption(device_type):
    """
    Simulates the electricity consumption of a device until it is turned off.
    
    :param device_type: Type of device (string)
    """
    device_consumption_rates = {
        "fan": 2,
        "heater": 10,
        "light": 1,
        "computer": 5
    }
    
    if device_type not in device_consumption_rates:
        print("Unknown device type. Please provide a valid device.")
        return
    
    power_per_second = device_consumption_rates[device_type]
    total_energy = 0  # Total energy consumed (in joules or watt-seconds)
    
    print(f"{device_type} is now ON. Type 'off' to turn it off.")
    while True:
        time.sleep(1)  # Simulate real-time consumption
        total_energy += power_per_second
        print(f"Device: {device_type}, Total Energy Consumed: {total_energy} Joules")
        
        user_input = input("Type 'off' to turn off the device: ")
        if user_input.lower() == 'off':
            print(f"{device_type} turned OFF. Total energy consumed: {total_energy} Joules")
            break

# Example usage
if __name__ == "__main__":
    device_type = input("Enter device type: ")
    simulate_energy_consumption(device_type)
