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


def add_room(user_id: str, household_code: str, room_name: str):
    try:
        # Step 1: Check if the user has 'can_configure' permission from the configure_permission table
        configure_permission_response = supabase.table("configure_permission") \
            .select("can_configure") \
            .eq("user_id", user_id) \
            .execute()

        if not configure_permission_response.data or not configure_permission_response.data[0].get("can_configure"):
            print("Permission denied: User does not have 'can_configure' permission")  # Debug log
            return {"success": False, "message": "Permission denied: You do not have permission to configure rooms."}

        # Step 2: Insert the new room
        room_data = {
            "household_code": household_code,
            "room_name": room_name
        }
        room_response = supabase.table("rooms").insert(room_data).execute()
        room_id = room_response.data[0]["room_id"]

        if not room_response.data:
            return {"success": False, "message": "Failed to insert room"}

        print("Room added successfully. Room ID:", room_id)  # Debug log
        return {"success": True, "message": "Room added successfully", "room_id": room_id}

    except Exception as e:
        print("Error adding room:", str(e))  # Log the error
        return {"success": False, "message": str(e)}


def add_device(user_id, room_id, device_name, device_category, household_code, active_days, active_time_start, active_time_end, icon, power, isOn, consumptionLimit, schedule):
    try:
        # Step 1: Check if the user has 'can_configure' permission from the configure_permission table
        configure_permission_response = supabase.table("configure_permission") \
            .select("can_configure") \
            .eq("user_id", user_id) \
            .execute()

        if not configure_permission_response.data or not configure_permission_response.data[0].get("can_configure"):
            print("Permission denied: User does not have 'can_configure' permission")  # Debug log
            return {"success": False, "message": "Permission denied: You do not have permission to add devices."}

        # Step 2: Insert the device into the devices table
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

        device_id = response.data[0]["device_id"]  # Get the device_id from the response
        print("Device ID:", device_id)  # Log the device_id

        print("Supabase response for device insertion:", response)  # Log the Supabase response
        manager_id = supabase.table("households").select("manager_id").eq("household_code", household_code).execute().data[0]["manager_id"]
        print("Manager ID:", manager_id)  # Log the manager_id

        # Step 3: Fetch all users in the household
        users_response = supabase.table("users").select("user_id").eq("household_code", household_code).execute()
        users = users_response.data
        print("Users in household:", users)  # Log the users in the household

        # Step 4: Add permissions for each user in the household
        for user in users:
            permission_response = supabase.table("householdpermissions").insert({
                "user_id": user["user_id"],
                "household_code": household_code,
                "room_id": room_id,
                "device_id": device_id,
                "can_control": True,  # Grant control permission
                "manager_id": manager_id
            }).execute()

            print(f"Added permissions for user {user['user_id']}:", permission_response)  # Log the permission response

        if response.data:
            return {"success": True, "message": "Device added successfully.", "device_id": device_id}
        else:
            return {"success": False, "message": "Failed to add device to the database.", "device_id": device_id}

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
        # Step 1: Check if the user has 'can_configure' permission from the configure_permission table
        configure_permission_response = supabase.table("configure_permission") \
            .select("can_configure") \
            .eq("user_id", user_id) \
            .execute()

        if not configure_permission_response.data or not configure_permission_response.data[0].get("can_configure"):
            print("Permission denied: User does not have 'can_configure' permission")  # Debug log
            return {"success": False, "message": "Permission denied: You do not have permission to delete devices."}

        # Step 2: Check if the device exists
        device = supabase.table("devices").select("*").eq("device_id", device_id).eq("household_code", household_code).execute()
        print("Device check response:", device)  # Log the response

        if not device.data:
            return {"success": False, "message": "Device not found."}

        # Step 3: Delete all permissions associated with the device in the householdpermissions table
        delete_permissions_response = supabase.table("householdpermissions") \
            .delete() \
            .eq("device_id", device_id) \
            .execute()
        print("Deleted permissions for device:", delete_permissions_response)  # Log the response

        # Step 4: Delete dependent records in the analytics table
        delete_analytics_response = supabase.table("analytics") \
            .delete() \
            .eq("device_id", device_id) \
            .execute()
        print("Deleted analytics records for device:", delete_analytics_response)  # Log the response

        # Step 5: Delete the device
        delete_device_response = supabase.table("devices").delete().eq("device_id", device_id).execute()
        print("Delete device response:", delete_device_response)  # Log the response

        if not delete_device_response.data:
            return {"success": False, "message": "Failed to delete device."}

        return {"success": True, "message": "Device, associated permissions, and analytics records deleted successfully."}

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
    try:
        # Step 1: Check if the user has 'can_configure' permission from the configure_permission table
        configure_permission_response = supabase.table("configure_permission") \
            .select("can_configure") \
            .eq("user_id", user_id) \
            .execute()

        if not configure_permission_response.data or not configure_permission_response.data[0].get("can_configure"):
            print("Permission denied: User does not have 'can_configure' permission")  # Debug log
            return {"success": False, "message": "Permission denied: You do not have permission to delete rooms."}

        # Step 2: Check if household exists
        household = supabase.table("households").select("household_code").eq("household_code", household_code).execute()
        if not household.data:
            return {"success": False, "message": "Invalid household code"}

        # Step 3: Fetch all devices in the room
        devices_in_room = supabase.table("devices").select("device_id").eq("room_id", room_id).execute()
        print("Devices in room:", devices_in_room.data)  # Log the devices

        # Step 4: Delete dependent records for each device in the room
        for device in devices_in_room.data:
            device_id = device["device_id"]

            # Delete analytics records for the device
            supabase.table("analytics").delete().eq("device_id", device_id).execute()
            print(f"Deleted analytics records for device {device_id}")

            # Delete permissions for the device
            supabase.table("householdpermissions").delete().eq("device_id", device_id).execute()
            print(f"Deleted permissions for device {device_id}")

        # Step 5: Delete all devices in the room
        device_response = supabase.table("devices").delete().eq("room_id", room_id).execute()
        print("Deleted devices in room:", device_response)

        # Step 6: Delete permissions associated with the room (if any)
        delete_permissions_response = supabase.table("householdpermissions") \
            .delete() \
            .eq("room_id", room_id) \
            .execute()
        print("Deleted permissions for room:", delete_permissions_response)

        # Step 7: Delete the room from the rooms table
        room_response = supabase.table("rooms").delete().eq("room_id", room_id).execute()
        if not room_response.data:
            return {"success": False, "message": "Failed to delete room. The room might not exist."}

        return {"success": True, "message": "Room, devices, and associated records deleted successfully."}

    except Exception as e:
        print("Error deleting room:", str(e))  # Log the error
        return {"success": False, "message": str(e)}