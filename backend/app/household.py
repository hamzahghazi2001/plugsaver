import random
from supabase import create_client
import app.config as config
supabase = create_client(config.SUPABASE_URL,config.SUPABASE_KEY)

def generate_household_code():

    return str(random.randint(100000, 999999))

def create_household(user_email):
    # Get user_id from the users table
    user = supabase.table("users").select("user_id").eq("email", user_email).execute()

    if not user.data:
        return {"success": False, "message": "User not found!"}

    user_id = user.data[0]["user_id"]

    # Check if the household already exists for the user
    existing = supabase.table("households").select("*").eq("manager_id", user_id).execute()

    if existing.data:
        return {"success": False, "message": "Household already exists!"}

    # Generate a household code
    household_code = generate_household_code()

    # Insert the new household
    supabase.table("households").insert({"manager_id": user_id, "household_code": household_code}).execute()

    # Add the user as a member of the household
    supabase.table("householdmembers").insert({"user_id": user_id, "household_code": household_code}).execute()

    supabase.table("users").update({
        "role": "manager",
        "household_code": household_code
    }).eq("email", user_email).execute()

    return {"success": True, "household_code": household_code}


def join_household(user_email, household_code):
    # Get user_id using the email from the users table
    user = supabase.table("users").select("user_id").eq("email", user_email).execute()

    if not user.data:
        return {"success": False, "message": "User not found!"}

    user_id = user.data[0]["user_id"]

    # Check if the household exists with the provided household_code
    household = supabase.table("households").select("*").eq("household_code", household_code).execute()

    if not household.data:
        return {"success": False, "message": "Invalid household code!"}

    # Add the user to the household_members table with user_id and household_code
    supabase.table("householdmembers").insert({"user_id": user_id, "household_code": household_code}).execute()
    supabase.table("users").update({
        "role": "member",
        "household_code": household_code
    }).eq("email", user_email).execute()

    return {"success": True, "message": "Joined household successfully!"}
