from supabase import create_client
import app.config as config
from datetime import datetime
from fastapi import APIRouter
import json

supabase = create_client(config.SUPABASE_URL, config.SUPABASE_KEY)

router = APIRouter()

DEFAULT_CATEGORIES = [
    {"category_name": "light", "description": "Lighting devices"},
    {"category_name": "pc", "description": "Personal computers"},
    {"category_name": "tv", "description": "Televisions"},
    {"category_name": "router", "description": "Network routers"},
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



@router.post("/add-device-category")
def add_device(
    household_code: str, user_id: int, room_id: int, 
    device_name: str, device_category: str, active_days: list,
    active_time_start: str, active_time_end: str):

    # Check if household exists
    household = supabase.table("households").select("household_code","manager_id").eq("household_code", household_code).execute()
    if not household.data:
        return {"success": False, "message": "Invalid household code"}

    # Insert new device
    response = supabase.table("devices").insert({
        "household_code": household_code,
        "room_id": room_id,
        "user_id": user_id,  # Owner of device
        "device_name": device_name,
        "device_category": device_category,
        "active_days": active_days,
        "active_time_start": active_time_start, 
        "active_time_end": active_time_end
    }).execute()

    if not response.data:
        return {"success": False, "message": "Failed to insert device"}

    device_id = response.data[0]["device_id"]
    manager_id = household.data[0]["manager_id"]

    # Get all household members
    household_members = supabase.table("householdmembers").select("user_id").eq("household_code", household_code).execute()

    # Grant device access to all members
    for member in household_members.data:
        supabase.table("householdpermissions").insert({
            "manager_id" : manager_id,
            "user_id": member["user_id"],
            "household_code": household_code,
            "room_id": room_id,
            "device_id": device_id,
            "can_control": True,
            "can_configure": True  # Change to False if needed
        }).execute()

    return {"success": True, "message": "Device added successfully with permissions granted to all household members!"}


def give_permission(manager_id: int, user_id: int, household_code: str, room_id: int = None, device_id: int = None, can_control: bool = False, can_configure: bool = False):
    """
    Grants or updates a member's access to a room or device in the household.
    - Only the manager can assign permissions.
    - If a permission exists, update it instead of inserting a new row.
    """

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
