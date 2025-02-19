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
def add_device_category(category_name: str):
    # Check if the category already exists
    existing_categories = supabase.table("devicecategories").select("category_name").execute()

    if not existing_categories.data:
        return {"success": False, "message": "Failed to fetch existing categories"}

    existing_category_names = [cat["category_name"] for cat in existing_categories.data]

    if category_name.lower() in existing_category_names:
        return {"success": False, "message": "Category already exists"}

    # Insert new category
    category_data = {"category_name": category_name.lower(), "created_at": datetime.utcnow().isoformat()}
    response = supabase.table("devicecategories").insert(category_data).execute()

    if not response.data:
        return {"success": False, "message": "Failed to add category"}

    return {"success": True, "message": f"Category '{category_name}' added successfully"}

def add_device(
    household_code: str, user_id: int, room_id: int, 
    device_name: str, device_category: str, active_days:list,
     active_time_start: str, active_time_end: str):
    # Check if the household exists
    household = supabase.table("households").select("household_code").eq("household_code", household_code).execute()

    if not household.data:
        return {"success": False, "message": "Invalid household code"}

    # Insert device into 'devices' table
    device_data = {
        "household_code": household_code,
        "room_id": room_id,
        "user_id":user_id,
        "device_name": device_name,
        "device_category": device_category,
        "active_days":active_days,
        "active_time_start": active_time_start, 
        "active_time_end": active_time_end
        #"created_at": datetime.utcnow().isoformat()
    }
    response = supabase.table("devices").insert(device_data).execute()

    if not response.data:
        return {"success": False, "message": "Failed to insert room"}

    return {"success": True, "message": "Room added successfully"}

