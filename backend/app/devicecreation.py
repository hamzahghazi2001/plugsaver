from supabase import create_client
import app.config as config
from datetime import datetime
from fastapi import APIRouter
import json

supabase = create_client(config.SUPABASE_URL, config.SUPABASE_KEY)

router = APIRouter()

DEFAULT_CATEGORIES = [
    {"category_name": "Lighting", "description": "Lighting devices"},
    {"category_name": "Entertainment", "description": "Entertainment devices"},
    {"category_name": "Kitchen Appliance", "description": "Kitchen appliances"},
    {"category_name": "Office Equipment", "description": "Office equipment"},
    {"category_name": "Climate Control", "description": "Climate control devices"},
    {"category_name": "Other", "description": "Other devices"},
]


def insert_default_categories():
    """Insert default categories if they do not exist."""
    existing_categories = supabase.table("devicecategories").select("category_name").execute()

    if existing_categories.data:
        existing_category_names = {cat["category_name"] for cat in existing_categories.data}
    else:
        existing_category_names = set()

    missing_categories = [cat for cat in DEFAULT_CATEGORIES if cat["category_name"] not in existing_category_names]

    if missing_categories:
        response = supabase.table("devicecategories").insert(missing_categories).execute()
        if response.data:
            print("Default categories inserted successfully.")
        else:
            print("Failed to insert default categories.")
    else:
        print("Default categories already exist.")



@router.get("/device-categories")
def get_device_categories():
    response = supabase.table("devicecategories").select("*").execute()
    
    if not response.data:
        return {"success": False, "message": "Failed to fetch categories"}

    return {"success": True, "categories": response.data}


def add_room(household_code: str,room_name: str):
    # Insert the new room
    room_data = {
        "household_code": household_code,
        "room_name": room_name
    }
    room_response = supabase.table("rooms").insert(room_data).execute()

    if not room_response.data:
        return {"success": False, "message": "Failed to insert room"}

    return {"success": True, "message": "Room added successfully"}



def add_device(user_id, room_id, device_name, device_category, household_code, active_days, active_time_start, active_time_end, icon, power, isOn, consumptionLimit, schedule):
    print("Adding device to database with the following data:")
    print(f"User ID: {user_id}")  # Log user_id
    print(f"Room ID: {room_id}")
    print(f"Device Name: {device_name}")
    print(f"Device Category: {device_category}")
    print(f"Household Code: {household_code}")  # Log household_code
    print(f"Active Days: {active_days}")
    print(f"Active Time Start: {active_time_start}")
    print(f"Active Time End: {active_time_end}")
    print(f"Icon: {icon}")
    print(f"Power: {power}")
    print(f"Is On: {isOn}")
    print(f"Consumption Limit: {consumptionLimit}")
    print(f"Schedule: {schedule}")

    try:
        # Example: Insert into Supabase
        response = supabase.table("devices").insert({
            "user_id": user_id,  # Include user_id
            "room_id": room_id,
            "device_name": device_name,
            "device_category": device_category,
            "household_code": household_code,  # Include household_code
            "active_days": active_days,
            "active_time_start": active_time_start,
            "active_time_end": active_time_end,
            "icon": icon,
            "power": power,
            "isOn": isOn,
            "consumptionLimit": consumptionLimit,
            "schedule": schedule,
        }).execute()

        print("Supabase response:", response)  # Log the Supabase response

        if response.data:
            return {"success": True, "message": "Device added successfully."}
        else:
            return {"success": False, "message": "Failed to add device to the database."}

    except Exception as e:
        print("Error adding device to database:", str(e))  # Log the error
        return {"success": False, "message": str(e)}
    
def give_permission(manager_id: int, user_id: int, household_code: str, room_id: int = None, device_id: int = None, can_control: bool = False, can_configure: bool = False):

    # Check if the user is a manager
    manager_check = supabase.table("users").select("role").eq("user_id", manager_id).execute()
    if not manager_check.data or manager_check.data[0]["role"] != "manager":
        return {"success": False, "message": "Only managers can assign permissions."}

    # Ensure user exists in the same household
    user_check = supabase.table("users").select("household_code").eq("user_id", user_id).execute()
    if not user_check.data or user_check.data[0]["household_code"] != household_code:
        return {"success": False, "message": "User does not belong to this household."}

    # Check if permission already exists for this user, room, and device
    existing_permission = supabase.table("householdpermissions").select("permission_id").eq("user_id", user_id).eq("household_code", household_code)
    
    if room_id:
        existing_permission = existing_permission.eq("room_id", room_id)
    if device_id:
        existing_permission = existing_permission.eq("device_id", device_id)

    existing_permission = existing_permission.execute()

    if existing_permission.data and user_id!=manager_id:
        # Update existing permission
        permission_id = existing_permission.data[0]["permission_id"]
        update_response = supabase.table("householdpermissions").update({
            "can_control": can_control,
            "can_configure": can_configure
        }).eq("permission_id", permission_id).execute()

        if update_response.data:
            return {"success": True, "message": "Permission updated successfully."}
        else:
            return {"success": False, "message": "Failed to update permission."}
    else:
        # Insert new permission
        permission_data = {
            "household_code": household_code,
            "user_id": user_id,
            "room_id": room_id,  # Can be None if only giving device access
            "device_id": device_id,  # Can be None if only giving room access
            "can_control": can_control,
            "can_configure": can_configure
        }
        if user_id != manager_id:
            insert_response = supabase.table("householdpermissions").insert(permission_data).execute()

        if insert_response.data:
            return {"success": True, "message": "Permission granted successfully."}
        else:
            return {"success": False, "message": "Failed to grant permission."}
        

# def delete_device(household_code: str, user_id: int, device_id: int):
#     # Check if household exists
#     household = supabase.table("households").select("household_code", "manager_id").eq("household_code", household_code).execute()
#     if not household.data:
#         return {"success": False, "message": "Invalid household code"}
    
#     # Check if the user has permission to configure the device
#     device_permission = supabase.table("householdpermissions").select("can_configure").eq("household_code", household_code).eq("device_id", device_id).eq("user_id", user_id).execute()
#     if not device_permission.data or not device_permission.data[0]["can_configure"]:
#         return {"success": False, "message": "User does not have permission to configure this device"}
    
#     # Delete the device's permissions from the householdpermissions table first
#     permission_response = supabase.table("householdpermissions").delete().eq("device_id", device_id).eq("household_code", household_code).execute()
#     if not permission_response.data:
#         return {"success": False, "message": "Failed to delete device permissions."}

#     # Now delete the device from the devices table
#     device_response = supabase.table("devices").delete().eq("device_id", device_id).execute()
#     if not device_response.data:
#         return {"success": False, "message": "Failed to delete device. The device might not exist."}

#     return {"success": True, "message": "Device and permissions successfully deleted."}

def delete_device(household_code: str, user_id: int, device_id: int):
    try:
        # Check if the device exists
        device = supabase.table("devices").select("*").eq("device_id", device_id).eq("household_code", household_code).execute()
        print("Device check response:", device)  # Log the response

        if not device.data:
            return {"success": False, "message": "Device not found."}

        # Delete the device
        response = supabase.table("devices").delete().eq("device_id", device_id).execute()
        print("Delete response:", response)  # Log the response

        if not response.data:
            return {"success": False, "message": "Failed to delete device."}

        return {"success": True, "message": "Device deleted successfully."}
    except Exception as e:
        print("Error deleting device:", str(e))  # Log the error
        return {"success": False, "message": str(e)}
           
# def delete_room(household_code: str, user_id: int, room_id: int):
#     # Check if household exists
#     household = supabase.table("households").select("household_code", "manager_id").eq("household_code", household_code).execute()
#     if not household.data:
#         return {"success": False, "message": "Invalid household code"}
    
#     # Check if the user is the manager of the household
#     if household.data[0]["manager_id"] != user_id:
#         return {"success": False, "message": "Only the manager can delete a room"}
    

#     # Delete household permissions for devices in the room before deleting the devices
#     permission_response = supabase.table("householdpermissions").delete().eq("room_id", room_id).eq("household_code", household_code).execute()
#     if not permission_response.data:
#         return {"success": False, "message": "Failed to delete room permissions."}

#     # Delete all devices associated with the room in the devices table
#     device_response = supabase.table("devices").delete().eq("room_id", room_id).execute()
#     if not device_response.data:
#         return {"success": False, "message": "Failed to delete devices in the room. Devices might not exist."}

#     # Now delete the room from the rooms table
#     room_response = supabase.table("rooms").delete().eq("room_id", room_id).execute()
#     if not room_response.data:
#         return {"success": False, "message": "Failed to delete room. The room might not exist."}

#     return {"success": True, "message": "Room, devices, and permissions successfully deleted"}

def delete_room(household_code: str, user_id: int, room_id: int):
    # Check if household exists
    household = supabase.table("households").select("household_code").eq("household_code", household_code).execute()
    if not household.data:
        return {"success": False, "message": "Invalid household code"}

    # Delete all devices associated with the room in the devices table
    device_response = supabase.table("devices").delete().eq("room_id", room_id).execute()


    # Now delete the room from the rooms table
    room_response = supabase.table("rooms").delete().eq("room_id", room_id).execute()
    if not room_response.data:
        return {"success": False, "message": "Failed to delete room. The room might not exist."}

    return {"success": True, "message": "Room, devices, and permissions successfully deleted"}


def update_device(device_id: str, updated_device_data: dict):

    try:
        # Fetch the existing device to ensure it exists
        existing_device = supabase.table("devices").select("*").eq("device_id", device_id).execute()

        if not existing_device.data:
            return {"success": False, "message": "Device not found."}

        # Update the device in the database
        response = supabase.table("devices").update(updated_device_data).eq("device_id", device_id).execute()

        if response.data:
            return {"success": True, "device": response.data[0]}
        else:
            return {"success": False, "message": "Failed to update device."}
    except Exception as e:
        print(f"Error updating device: {e}")
        return {"success": False, "message": "An error occurred while updating the device."}