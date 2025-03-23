from supabase import create_client
import app.config as config

supabase = create_client(config.SUPABASE_URL, config.SUPABASE_KEY)

def create_household(user_email, household_code):
    # Get user_id from the users table
    user = supabase.table("users").select("user_id").eq("email", user_email).execute()

    if not user.data:
        return {"success": False, "message": "User not found!"}

    user_id = user.data[0]["user_id"]

    # Check if the household already exists for the user
    existing = supabase.table("households").select("*").eq("manager_id", user_id).execute()

    if existing.data:
        return {"success": False, "message": "Household already exists!"}

    # Insert the new household with the provided household code
    supabase.table("households").insert({"manager_id": user_id, "household_code": household_code}).execute()

    # Add the user as a member of the household
    supabase.table("householdmembers").insert({"user_id": user_id, "household_code": household_code}).execute()

    supabase.table("users").update({
        "role": "manager",
        "household_code": household_code
    }).eq("email", user_email).execute()

        # Insert into configure_permission table
    configure_permission_response = supabase.table("configure_permission").select("*").eq("user_id", user_id).execute()
    
    if not configure_permission_response.data:  # Avoid duplicate entries
        supabase.table("configure_permission").insert({
            "user_id": user_id,
            "can_configure": True  # Set can_configure to True
        }).execute()

    return {"success": True, "household_code": household_code}

def join_household(user_email, household_code):
    # Get user_id of the joining user
    user = supabase.table("users").select("user_id, household_code").eq("email", user_email).execute()

    if not user.data:
        return {"success": False, "message": "User not found!"}

    user_id = user.data[0]["user_id"]
    existing_household = user.data[0].get("household_code")

    # If the user is already part of the household, no need to add again
    if existing_household == household_code:
        return {"success": False, "message": "User is already part of this household!"}

    # Check if household exists
    household = supabase.table("households").select("manager_id").eq("household_code", household_code).execute()
    if not household.data:
        return {"success": False, "message": "Invalid household code!"}

    manager_id = household.data[0]["manager_id"]  # Get household manager

    # Add user to household members if not already added
    household_member = supabase.table("householdmembers").select("user_id").eq("user_id", user_id).eq("household_code", household_code).execute()
    
    if not household_member.data:  # Prevent duplicate entry
        supabase.table("householdmembers").insert({
            "user_id": user_id,
            "household_code": household_code
        }).execute()

    # Get all devices in the household
    devices = supabase.table("devices").select("device_id, room_id").eq("household_code", household_code).execute()

    # Grant access to all existing devices only if the user doesn't already have permissions
    for device in devices.data:
        existing_permission = supabase.table("householdpermissions").select("permission_id").eq("user_id", user_id).eq("device_id", device["device_id"]).execute()
        
        if not existing_permission.data:  # Avoid inserting duplicate permissions
            supabase.table("householdpermissions").insert({
                "manager_id": manager_id,
                "user_id": user_id,
                "household_code": household_code,
                "room_id": device["room_id"],
                "device_id": device["device_id"],
                "can_control": True,  # Change to False if only the manager should configure
            }).execute()

    # Update user role
    supabase.table("users").update({
        "role": "member",
        "household_code": household_code
    }).eq("email", user_email).execute()

    # Insert into configure_permission table
    configure_permission_response = supabase.table("configure_permission").select("*").eq("user_id", user_id).execute()
    
    if not configure_permission_response.data:  # Avoid duplicate entries
        supabase.table("configure_permission").insert({
            "user_id": user_id,
            "can_configure": True  # Set can_configure to True
        }).execute()

    return {"success": True, "message": "Joined household successfully with full access to all devices!"}