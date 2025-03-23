# main.py
import random
from app.auth import create_account, registration_verify, email_code_gen, login, login_verify
from fastapi import FastAPI, HTTPException, Depends, Query, Path, UploadFile, File, Form
from app.household import create_household, join_household
from app.devicecreation import add_device, get_device_categories, insert_default_categories, add_room, give_permission, delete_device, delete_room
from app.rewards import Points_and_badges, update_badges, get_rewards, send_results, get_global, get_local, get_household
from app.feedback import put_feedback, get_feedback, change_feedback_status
from app.algo import calculate_live_consumption
from app.dashboardparsevalues import json_energy_consumption, roomjson, devicecatjson, statsjson
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from supabase import create_client
import app.config as config
from typing import List,Optional, Dict, Any
from fastapi.responses import JSONResponse, RedirectResponse, StreamingResponse
import asyncio

supabase = create_client(config.SUPABASE_URL, config.SUPABASE_KEY)

app = FastAPI()
security = HTTPBearer()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods
    allow_headers=["*"],  # Allows all headers
)

verification_codes = {}

class RegisterRequest(BaseModel):
    email: str
    password: str
    confirmpass: str
    name: str

class VerifyRequest(BaseModel):
    email: str
    name: str
    password: str
    userverifycode: int

@app.post("/create_account")
async def create_account_endpoint(request: RegisterRequest):
    result = create_account(request.email, request.password, request.confirmpass)
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["message"])
    verification_codes[request.email] = result["verification_code"]
    return {"success": True, "message": "Verification code sent."}



@app.post("/verify_registration")
async def verify_registration_endpoint(request: VerifyRequest):
    systemverifycode = verification_codes.get(request.email)
    if systemverifycode is None:
        raise HTTPException(status_code=400, detail="No verification code found for this email.")
    result = registration_verify(
        email=request.email,
        name=request.name,
        password=request.password,
        userverifycode=request.userverifycode,
        systemverifycode=systemverifycode
    )

    user_id=supabase.from_("users").select("user_id").eq("email", request.email).execute().data[0]["user_id"]
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["message"])
    del verification_codes[request.email]
    return {"success": True, "message": "Account verified and created.", "user_id": user_id}

class ResendCodeRequest(BaseModel):
    email: str

@app.post("/resend-code")
async def resend_code(request: ResendCodeRequest):
    verification_code = email_code_gen(request.email)
    verification_codes[request.email] = verification_code
    return {"success": True, "message": "Verification code resent."}

class LoginRequest(BaseModel):
    email: str
    password: str

class VerifyLoginRequest(BaseModel):
    email: str
    userverifycode: int

@app.post("/login")
async def login_endpoint(request: LoginRequest):
    result = login(request.email, request.password)
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["message"])
    verification_codes[request.email] = result["verification_code"]
    return {"success": True, "message": "Verification code sent."}

@app.post("/verify_login")
async def verify_login_endpoint(request: VerifyLoginRequest):
    systemverifycode = verification_codes.get(request.email)
    if systemverifycode is None:
        raise HTTPException(status_code=400, detail="No verification code found for this email.")
    if request.userverifycode != systemverifycode:
        raise HTTPException(status_code=400, detail="Invalid verification code.")
    del verification_codes[request.email]
    try:
        result = supabase.from_("users").select("user_id").eq("email", request.email).execute()
        if not result.data:
            raise HTTPException(status_code=404, detail="User not found.")
        user_id = result.data[0]["user_id"]
        return {"success": True, "message": "Login successful.", "user_id": user_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

class CreateHouseholdRequest(BaseModel):
    email: str
    household_code: str

class JoinHouseholdRequest(BaseModel):
    email: str
    household_code: str

@app.post("/create_household")
async def create_household_endpoint(request: CreateHouseholdRequest):
    result = create_household(request.email, request.household_code)
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["message"])
    asyncio.create_task(calculate_live_consumption(request.household_code))
    return {"success": True, "household_code": result["household_code"]}


@app.post("/join_household")
async def join_household_endpoint(request: JoinHouseholdRequest):
    result = join_household(request.email, request.household_code)
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["message"])
    asyncio.create_task(calculate_live_consumption(request.household_code))
    return {"success": True, "message": result["message"]}

@app.get("/user_email")
async def get_user_email(token: str = Depends(security)):
    try:
        user = supabase.auth.get_user(token.credentials)
        if not user:
            raise HTTPException(status_code=401, detail="Invalid token")
        return {"success": True, "email": user.email}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

insert_default_categories()

class AddDeviceRequest(BaseModel):
    user_id: int
    room_id: int
    device_name: str
    device_category: str
    household_code: str
    active_days: List[str]
    active_time_start: str
    active_time_end: str
    icon: Dict[str, str]
    power: str
    isOn: bool
    consumptionLimit: int
    schedule: Dict[str, Any]

class DeleteDeviceRequest(BaseModel):
    household_code: str
    user_id: int
    device_id: int

class DeleteRoomRequest(BaseModel):
    household_code: str
    user_id: int
    room_id: int

@app.post("/add-device")
async def add_device_endpoint(request: AddDeviceRequest):
    result = add_device(
        request.user_id,
        request.room_id,
        request.device_name,
        request.device_category,
        request.household_code,
        request.active_days,
        request.active_time_start,
        request.active_time_end,
        request.icon,
        request.power,
        request.isOn,
        request.consumptionLimit,
        request.schedule
    )
    print("Result from add_device function:", result)
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["message"])
    return {"success": True, "message": "Device added successfully.", "device_id": result["device_id"]}

@app.delete("/api/auth/devices")
async def delete_device_endpoint(request: DeleteDeviceRequest):
    print(f"Deleting device: device_id={request.device_id}, household_code={request.household_code}, user_id={request.user_id}")
    result = delete_device(request.household_code, request.user_id, request.device_id)
    if not result["success"]:
        error_message = result.get("message", "Failed to delete device")
        return JSONResponse(status_code=400, content={"success": False, "message": error_message})
    return {"success": True, "message": "Device deleted successfully."}

@app.delete("/api/auth/rooms")
async def delete_room_endpoint(request: DeleteRoomRequest):
    print(f"Deleting room: room_id={request.room_id}, household_code={request.household_code}, user_id={request.user_id}")
    result = delete_room(request.household_code, request.user_id, request.room_id)
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["message"])
    return {"success": True, "message": "Room deleted successfully."}



class AddRoomRequest(BaseModel):
    userId: int
    household_code: str
    room_name: str

@app.post("/add-room")
async def add_room_endpoint(request: AddRoomRequest):
    print("Received payload:", request.dict())
    try:
        result = add_room(request.userId,request.household_code, request.room_name)
        print("Result from add_room function:", result)
        if not result["success"]:
            raise HTTPException(status_code=400, detail=result["message"])
        return {"success": True, "message": "Room added successfully.", "room_id": result["room_id"]}
    except Exception as e:
        print("Error adding room:", str(e))
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/auth/rooms")
async def get_rooms(household_code: str = Query(...)):
    try:
        if household_code:
            result = supabase.table("rooms").select("*").eq("household_code", household_code).execute()
        else:
            result = supabase.table("rooms").select("*").execute()
        if result.data:
            return {"success": True, "rooms": result.data}
        else:
            return {"success": False, "message": "No rooms found."}
    except Exception as e:
        return {"success": False, "message": str(e)}

@app.get("/api/auth/devices")
async def get_devices(household_code: str = Query(...)):
    try:
        if household_code:
            result = supabase.table("devices").select("*").eq("household_code", household_code).execute()
        else:
            result = supabase.table("devices").select("*").execute()
        if result.data:
            return {"success": True, "devices": result.data}
        else:
            return {"success": False, "message": "No devices found."}
    except Exception as e:
        return {"success": False, "message": str(e)}

@app.get("/get-householdcode")
async def get_household_code(email: str = Query(...)):
    try:
        result = supabase.from_("users").select("household_code").eq("email", email).execute()
        if result.data:
            asyncio.create_task(calculate_live_consumption(result.data[0]["household_code"]))
            return {"success": True, "household_code": result.data[0]["household_code"], "message": "success."}
        else:
            return {"success": False, "message": "User not found."}
    except Exception as e:
        return {"success": False, "message": str(e)}

# New endpoint to fetch room details by room_id
@app.get("/api/auth/getroomname")
async def get_room_by_id(room_id: str = Query(...)):
    try:
        result = supabase.from_("rooms").select("room_name").eq("room_id", room_id).execute()
        if not result.data:
            return JSONResponse(
                status_code=404,
                content={"success": False, "message": "Room not found"}
            )
        room_name = result.data[0]["room_name"]
        return {"success": True, "room_name": room_name}
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"success": False, "message": f"An error occurred: {str(e)}"}
        )


class AssignRoomRequest(BaseModel):
    room_id: int

@app.put("/api/auth/devices/{device_id}")
async def assign_device_to_room(device_id: int, request: AssignRoomRequest):
    try:
        device_result = supabase.from_("devices").select("*").eq("device_id", device_id).execute()
        if not device_result.data:
            raise HTTPException(status_code=404, detail="Device not found")
        device = device_result.data[0]

        room_result = supabase.from_("rooms").select("*").eq("room_id", request.room_id).execute()
        if not room_result.data:
            raise HTTPException(status_code=404, detail="Room not found")
        room = room_result.data[0]

        update_result = supabase.from_("devices").update({"room_id": request.room_id}).eq("device_id", device_id).execute()
        if not update_result.data:
            raise HTTPException(status_code=500, detail="Failed to update device room")
        return {"success": True, "message": "Device assigned to room successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

# Define the request model
class ToggleDeviceRequest(BaseModel):
    deviceId: int
    isOn: bool
    power: str  # The current power value (e.g., "144W" or "0W")
    householdCode : str
    userId : int

@app.post("/toggle-device")
async def toggle_device_endpoint(request: ToggleDeviceRequest):
    try:
        print(f"Received request: deviceId={request.deviceId}, isOn={request.isOn}, power={request.power}, householdCode={request.householdCode}")  # Debug log

        # Fetch the user's permissions from the database
        permission_result = supabase.from_("householdpermissions").select("*").eq("household_code", request.householdCode).eq("user_id", request.userId).execute()
        
        # Check if the user has the 'can_control' permission
        if not permission_result.data or not permission_result.data[0].get("can_control"):
            print("Permission denied: User does not have 'can_control' permission")  # Debug log
            return {"success": False, "message":"Permission denied: You do not have permission to control devices."}

        # Fetch the device from the database
        device_result = supabase.from_("devices").select("*").eq("device_id", request.deviceId).execute()
        
        # Check if the device exists
        if not device_result.data:
            print("Device not found")  # Debug log
            raise HTTPException(status_code=404, detail="Device not found")
        
        device = device_result.data[0]
        print(f"Fetched device: {device}")  # Debug log

        # Prepare the update data
        update_data = {"isOn": request.isOn, "power": request.power}
        print(f"Update data: {update_data}")  # Debug log

        # Update the device in the database
        update_result = supabase.from_("devices").update(update_data).eq("device_id", request.deviceId).execute()
        
        # Check if the update was successful
        if not update_result.data:
            print("Failed to update device state")  # Debug log
            raise HTTPException(status_code=500, detail="Failed to update device state")

        print("Device state toggled successfully")  # Debug log
        return {"success": True, "message": "Device state toggled successfully", "isOn": request.isOn, "power": request.power}
    except HTTPException as http_err:
        # Re-raise HTTP exceptions (e.g., 403, 404, 500)
        raise http_err
    except Exception as e:
        # Log the full error for debugging
        print(f"Error toggling device: {str(e)}")  # Debug log
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

class EditDeviceRequest(BaseModel):
    householdCode : str
    userId: int
    device_id: int
    consumptionLimit: int
    schedule: Dict[str, Any]
    active_days: List[str]
    active_time_start: str
    active_time_end: str

# PUT endpoint to update device settings
@app.put("/edit-device")
async def edit_device_endpoint(request: EditDeviceRequest):
    try:
        print("Received request to update device:", request.dict())

        # Step 1: Check if the user has 'can_configure' permission from the configure_permission table
        configure_permission_response = supabase.table("configure_permission") \
            .select("can_configure") \
            .eq("user_id", request.userId) \
            .execute()

        if not configure_permission_response.data or not configure_permission_response.data[0].get("can_configure"):
            print("Permission denied: User does not have 'can_configure' permission")  # Debug log
            raise HTTPException(status_code=403, detail="Permission denied: You do not have permission to edit devices.")

        # Step 2: Validate device_id
        if not request.device_id:
            raise HTTPException(status_code=400, detail="Device ID is required.")

        # Step 3: Prepare the update data
        update_data = {}
        if request.consumptionLimit is not None:
            update_data["consumptionLimit"] = request.consumptionLimit
        if request.active_time_start is not None:
            update_data["active_time_start"] = request.active_time_start
        if request.active_time_end is not None:
            update_data["active_time_end"] = request.active_time_end
        if request.active_days is not None:
            update_data["active_days"] = request.active_days
        if request.schedule is not None:
            update_data["schedule"] = request.schedule

        # Step 4: Update the device in Supabase
        response = (
            supabase.table("devices")
            .update(update_data)
            .eq("device_id", request.device_id)
            .execute()
        )

        if not response.data:
            raise HTTPException(status_code=404, detail="Device not found.")

        print("Device updated successfully:", response.data)
        return {"success": True, "message": "Device updated successfully."}

    except HTTPException as http_err:
        # Re-raise HTTP exceptions (e.g., 403, 404, 500)
        raise http_err
    except Exception as e:
        print("Error updating device:", str(e))
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/")
async def read_root():
    return {"message": "Welcome to the backend!"}

@app.post("/upload-profile-picture")
async def upload_profile_picture(user_id: str = Form(...), file: UploadFile = File(...)):
    try:
        # Validate user_id
        if not user_id:
            return JSONResponse(
                status_code=400,
                content={"success": False, "message": "User ID is required."}
            )

        # Print the file name to verify it's correct
        print("Received file name:", file.filename)

        # Use the original file name for the upload
        file_name = file.filename
        file_path = f"profile-pictures/{file_name}"

        # Debug: Log the file path
        print("File path for upload:", file_path)

        # Upload the file to Supabase Storage
        upload_result = supabase.storage.from_("profile-pictures").upload(
            file_path,
            await file.read(),
            {
                "cacheControl": "3600",  # Ensure this is a string
                "upsert": "true"  # Ensure this is a string
            }
        )

        # Check if the upload was successful
        if not upload_result.path:
            print("Supabase Storage Upload Error:", upload_result)
            return JSONResponse(
                status_code=400,
                content={"success": False, "message": "Failed to upload file to Supabase Storage."}
            )

        # Get the public URL of the uploaded file
        public_url = supabase.storage.from_("profile-pictures").get_public_url(file_path)
        print("Public URL:", public_url)

        # Update the user's profile picture URL in the database
        update_result = supabase.from_("users").update({"avatar": public_url}).eq("user_id", user_id).execute()

        if not update_result.data:
            print("Database Update Error:", update_result)
            return JSONResponse(
                status_code=500,
                content={"success": False, "message": "Failed to update user profile picture in the database."}
            )

        return JSONResponse(
            status_code=200,
            content={"success": True, "message": "Profile picture updated successfully", "avatar_url": public_url}
        )
    except Exception as e:
        print("Error in upload_profile_picture:", str(e))
        return JSONResponse(
            status_code=500,
            content={"success": False, "message": str(e)}
        )

@app.get("/profile-picture")
async def get_profile_picture(user_id: str = Query(...)):
    try:
        # Fetch the user's profile picture URL from the database
        user_data = supabase.from_("users").select("avatar").eq("user_id", user_id).execute()

        # Check if the user exists and has a profile picture
        if not user_data.data or not user_data.data[0].get("avatar"):
            raise HTTPException(status_code=404, detail="User not found or profile picture not set.")

        # Get the profile picture URL
        avatar_url = user_data.data[0]["avatar"]

        # Debug: Log the avatar URL from the database
        print("Avatar URL from database:", avatar_url)

        # Return the avatar URL directly
        return JSONResponse(
            status_code=200,
            content={"success": True, "avatar_url": avatar_url}
        )
    except Exception as e:
        print("Error in get_profile_picture:", str(e))
        raise HTTPException(status_code=500, detail=str(e))
    
class ProfileSetupRequest(BaseModel):
    user_id: str
    username: str
    date_of_birth: str
    country: str

@app.post("/setup_profile")
async def setup_profile_endpoint(request: ProfileSetupRequest):
    try:
        # Update the user's profile with the new information
        update_result = supabase.from_("users").update({
            "name": request.username,
            "dob": request.date_of_birth,
            "country": request.country
        }).eq("user_id", request.user_id).execute()

        if not update_result.data:
            raise HTTPException(status_code=500, detail="Failed to update user profile.")

        # Store the profile information in local storage (if needed)
        # This is typically done on the client side, but you can return the data here
        return {"success": True, "message": "Profile setup successful.", "username": request.username, "date_of_birth": request.date_of_birth, "country": request.country}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/get_user_details")
async def get_user_details(user_id: str):
    try:
        # Fetch user details from the database
        result = supabase.from_("users").select("*").eq("user_id", user_id).execute()

        if not result.data:
            raise HTTPException(status_code=404, detail="User not found")

        user_details = result.data[0]  # Get the first (and only) user
        return {"success": True, "user": user_details}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/get_household_users")
async def get_household_users(household_code: str = Query(...)):
    try:
        # Fetch all users in the household
        result = supabase.from_("users").select("*").eq("household_code", household_code).execute()

        if not result.data:
            return JSONResponse(
                status_code=404,
                content={"success": False, "message": "No users found in this household."}
            )

        # Return the list of users
        return {"success": True, "users": result.data}
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"success": False, "message": f"An error occurred: {str(e)}"}
        )
    
class UpdatePermissionsRequest(BaseModel):
    memberId: int
    managerId: int
    householdCode: str
    canControl: bool
    canConfigure: bool

@app.post("/update_permissions")
async def update_permissions(request: UpdatePermissionsRequest):
    try:
        # Fetch all devices in the household
        devices_response = supabase.table("devices").select("device_id").eq("household_code", request.householdCode).execute()
        devices = devices_response.data

        if not devices:
            raise HTTPException(status_code=404, detail="No devices found for the given household code.")

        # Update permissions for each device
        for device in devices:
            device_id = device["device_id"]
            
            # Check if the permission already exists in householdpermissions
            permission_response = supabase.table("householdpermissions").select("*").eq("household_code", request.householdCode).eq("device_id", device_id).eq("manager_id", request.managerId).eq("user_id", request.memberId).execute()
            
            room_id = supabase.from_("devices").select("room_id").eq("device_id", device_id).execute().data[0]["room_id"]
            
            if permission_response.data:
                # Update existing permission in householdpermissions (only can_control)
                update_response = supabase.table("householdpermissions").update({
                    "can_control": request.canControl
                }).eq("permission_id", permission_response.data[0]["permission_id"]).execute()

                if not update_response.data:
                    print(f"Failed to update permission for device {device_id}. Response: {update_response}")
                    raise HTTPException(status_code=500, detail=f"Failed to update permission for device {device_id}.")
            else:
                # Insert new permission in householdpermissions (only can_control)
                insert_response = supabase.table("householdpermissions").insert({
                    "household_code": request.householdCode,
                    "device_id": device_id,
                    "room_id": room_id,
                    "can_control": request.canControl,
                    "manager_id": request.managerId,
                    "user_id": request.memberId
                }).execute()

                if not insert_response.data:
                    print(f"Failed to insert permission for device {device_id}. Response: {insert_response}")
                    raise HTTPException(status_code=500, detail=f"Failed to insert permission for device {device_id}.")

            # Handle configure_permission table
            configure_permission_response = supabase.table("configure_permission").select("*").eq("user_id", request.memberId).execute()
            
            if configure_permission_response.data:
                # Update existing configure permission
                update_configure_response = supabase.table("configure_permission").update({
                    "can_configure": request.canConfigure
                }).eq("user_id", request.memberId).execute()

                if not update_configure_response.data:
                    print(f"Failed to update configure permission for user {request.memberId}. Response: {update_configure_response}")
                    raise HTTPException(status_code=500, detail=f"Failed to update configure permission for user {request.memberId}.")
            else:
                # Insert new configure permission
                insert_configure_response = supabase.table("configure_permission").insert({
                    "user_id": request.memberId,
                    "can_configure": request.canConfigure
                }).execute()

                if not insert_configure_response.data:
                    print(f"Failed to insert configure permission for user {request.memberId}. Response: {insert_configure_response}")
                    raise HTTPException(status_code=500, detail=f"Failed to insert configure permission for user {request.memberId}.")

        return {"success": True, "message": "Permissions updated successfully."}

    except HTTPException as http_err:
        # Re-raise HTTP exceptions (e.g., 403, 404, 500)
        print(f"HTTPException occurred: {http_err.detail}")
        raise http_err
    except Exception as e:
        # Print the full error traceback for debugging
        import traceback
        print(f"Unexpected error occurred: {str(e)}")
        print(traceback.format_exc())  # Print the full traceback
        raise HTTPException(status_code=500, detail=str(e))

        return {"success": True, "message": "Permissions updated successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/json-energy-consumption")
async def get_energy_consumption(household_code: str = Query(...)):
    result = await json_energy_consumption(household_code)  # Await the coroutine to get the result
    print(result)  # Print the result to the console for debugging
    return JSONResponse(content={"success": True, "data": result})

@app.get("/room_consumption")
async def get_room_consumption(household_code: str = Query(...)):
    result = await roomjson(household_code)  # Await the coroutine to get the result
    print(result)  # Print the result to the console for debugging
    return JSONResponse(content={"success": True, "data": result})

@app.get("/device_category")
async def get_device_category(household_code: str = Query(...)):
    result = await devicecatjson(household_code)  # Await the coroutine to get the result
    print(result)  # Print the result to the console for debugging
    return JSONResponse(content={"success": True, "data": result})

# New endpoint for efficiency score and other metrics
@app.get("/efficiency_metrics")
async def get_efficiency_metrics(household_code: str = Query(...)):
    result = await statsjson(household_code)
    print(result)  # Print the result to the console for debugging
    return JSONResponse(content={"success": True, "data": result})

@app.get("/top-active-rooms")
async def get_top_active_rooms(household_code: str = Query(...)):
    try:
        # Fetch all rooms for the household
        rooms_result = supabase.table("rooms").select("room_id, room_name").eq("household_code", household_code).execute()
        if not rooms_result.data:
            return {"success": False, "message": "No rooms found for this household."}

        # Fetch all devices for the household
        devices_result = supabase.table("devices").select("room_id, power").eq("household_code", household_code).execute()
        if not devices_result.data:
            return {"success": False, "message": "No devices found for this household."}

        # Calculate total power for each room
        room_power = {}
        for device in devices_result.data:
            room_id = device["room_id"]
            power_str = device["power"]  # e.g., "44W"
            power = int(power_str[:-1]) if power_str and power_str[-1] == "W" else 0  # Remove "W" and convert to int

            if room_id in room_power:
                room_power[room_id] += power
            else:
                room_power[room_id] = power

        # Prepare the result with room names and total power
        top_rooms = []
        for room in rooms_result.data:
            room_id = room["room_id"]
            room_name = room["room_name"]
            total_power = room_power.get(room_id, 0)
            top_rooms.append({
                "room_id": room_id,
                "room_name": room_name,
                "total_power": total_power,
                "icon": "Sofa"  # Example: Add a default icon
            })

        # Sort rooms by total power in descending order and get the top 4
        top_rooms_sorted = sorted(top_rooms, key=lambda x: x["total_power"], reverse=True)[:4]

        # Print the top rooms for debugging
        print("Top Active Rooms:", top_rooms_sorted)

        return {"success": True, "top_rooms": top_rooms_sorted}
    except Exception as e:
        print(f"Error fetching top active rooms: {e}")
        return {"success": False, "message": f"An error occurred: {str(e)}"}
        
@app.get("/top-active-devices")
async def get_top_active_devices(household_code: str = Query(...)):
    try:
        # Fetch all devices for the household
        devices_result = supabase.table("devices").select("device_id, device_name, power, icon").eq("household_code", household_code).execute()
        if not devices_result.data:
            return {"success": False, "message": "No devices found for this household."}

        # Extract power values and convert to integers
        devices_with_power = []
        for device in devices_result.data:
            power_str = device["power"]  # e.g., "44W"
            power = int(power_str[:-1]) if power_str and power_str[-1] == "W" else 0  # Remove "W" and convert to int
            icon_name = device["icon"].get("name", "plug")  # Extract the "name" field from the JSONB icon object
            devices_with_power.append({
                "device_id": device["device_id"],
                "device_name": device["device_name"],
                "power": power,
                "icon": icon_name  # Send only the icon name
            })

        # Sort devices by power in descending order and get the top 4
        top_devices_sorted = sorted(devices_with_power, key=lambda x: x["power"], reverse=True)[:4]

        # Print the top devices for debugging
        print("Top Active Devices:", top_devices_sorted)

        return {"success": True, "top_devices": top_devices_sorted}
    except Exception as e:
        print(f"Error fetching top active devices: {e}")
        return {"success": False, "message": str(e)} 

'''@app.get("/start-live-consumption")
async def start_live_consumption(household_code: str = Query(...)):
    if not household_code:
        raise HTTPException(status_code=400, detail="Household code is required")
    # Start the live consumption calculation
    asyncio.create_task(calculate_live_consumption(household_code))
    return {"message": "Live consumption calculation started"}'''

class RewardsInfo(BaseModel):
    rewards_id: int

@app.post("/points_and_badges")
async def points_and_badges_endpoint(request : RewardsInfo):
    result = Points_and_badges(request.rewards_id)
    print("Result from points_and_badges function:", result)
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["message"])
    return {"success": True, "message": "points and badges added successfully."}

@app.get("/api/auth/get_rewards")
async def get_rewards_endpoint(rewards_id: str = Query(...)):
    try:
        id = int(rewards_id)
        result = get_rewards(id)
        '''if not result.success:
            return JSONResponse(
                status_code=404,
                content={"success": False, "message": "no record"}
            )'''
        return result
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"success": False, "message": f"An error occurred: {str(e)}"}
        )


                 
# def test_signup():
#     email = "e@example.com"
#     password = "securePassword123"
#     name = "Ts"
    
   
#     user = signup(email, password, name)
    
#     if user:
#         print("User signed up successfully:", user)
#     else:
#         print("Signup failed.")

# def test_login():
#     print("Welcome to the PlugSaver App!")

    
#    # email = input("Enter your email: ")
#     #password = input("Enter your password: ")

#     print("\nAttempting to log in...")
    

#     result = login("e@example.com", "securePassword123")


#     if result:
#         print("Login successful!")
#     else:
#         print("Login failed.")

# def test_email():
#     verify("joseph.kariampally@gmail.com")
#     print("TEST COMPLETE")

# @app.post("/create-household")
# def create_household_endpoint(email: str):
#     result = create_household(email)
#     if not result["success"]:
#         raise HTTPException(status_code=400, detail=result["message"])
#     return {"household_code": result["household_code"]}

# @app.post("/join-household")
# def join_household_endpoint(email: str, household_code: str):
#     result = join_household(email, household_code)
#     if not result["success"]:
#         raise HTTPException(status_code=400, detail=result["message"])
#     return result

# def get_device_categories_endpoint():
#     return get_device_categories()

# @app.post("/add-device-category")
# def add_device_category_endpoint(category_name: str):
#     return add_device_category(category_name)

# @app.post("/add-device")
# def add_device_endpoint(household_code: str, user_id: int, room_id: int, device_name: str, device_category: str,active_days: list, active_time_start: str, active_time_end: str):
#     return add_device(household_code, user_id, room_id, device_name, device_category,active_days, active_time_start, active_time_end)

# def give_permission_endpoint(manager_id: int, user_id: int, household_code: str, room_id: int = None, device_id: int = None, can_control: bool = False, can_configure: bool = False):
#     result = give_permission(manager_id, user_id, household_code, room_id, device_id, can_control, can_configure)
    
#     if not result["success"]:
#         raise HTTPException(status_code=400, detail=result["message"])
    
#     return result

# @app.post("/points_and_badges")
# def points_and_badges_endpoint(rewards_id: int):
#     return Points_and_badges(rewards_id)

# def get_global_endpoint():
#     return get_global()

# def get_local_endpoint(rewards_id: int):
#     return get_local(rewards_id)

# def get_household_endpoint(rewards_id: int):
#     return get_household(rewards_id)

# @app.post("/feedback")
# def put_feedback_endpoint(user_id: int, message: str):
#     return put_feedback(user_id, message)

# def get_feedback_endpoint(feedback_id: int):
#     return get_feedback(feedback_id)

# def change_feedback_status_endpoint(feedback_id: int):
#     return change_feedback_status(feedback_id)

# #test_email()
# #test_signup()
# #create_household_endpoint("testuser@example.com")
# #join_household_endpoint("test@example.com", "388488")

# #join_household_endpoint("te@example.com", "388488")

# #get_device_categories_endpoint()
# #add_device_category_endpoint("pc")
# #add_room("388488","masterbedroom")
# #add_device_endpoint("388488",3,1,"asma's pc","pc",["monday","tuesday"],"9:00","16:00")
# #add_device_endpoint("388488",8,1,"someone's pc","pc",["monday","tuesday"],"9:00","16:00")

# #add_device_endpoint("388488",8,1,"someone's pc","pc",["monday","tuesday"],"9:00","16:00")


# #test_login()

# #code=create_account('joseph.kariampally@gmail.com','plugsaver01','plugsaver01')
# #print(code)
# #registration_verify('joseph.kariampally@gmail.com','Joseph','plugsaver01', code, code)

# # Run the function to insert default categories
# #insert_default_categories()


# #create_household_endpoint("joseph.kariampally@gmail.com")
# #join_household_endpoint("testser@example.com", "255990")
# #add_room("255990","kids room")
# #add_device_endpoint("255990",5,3,"someone's tv","tv",["monday","tuesday"],"9:00","16:00")
# #give_permission_endpoint(10,5,"255990",3,32,False,False)
# #delete_device("388488",6,23)
# #delete_room("388488",3,1)

# #points_and_badges_endpoint(101)
# #get_global()
# #get_local(101)
# #get_household(101)

# #IMPORTANT: to test this part, follow the instruction on feedback.py line 18 before running, else will fail
# #put_feedback_endpoint(8, "message 1")
# #put_feedback_endpoint(9, "message 2")
# #get_feedback_endpoint(8)
# #change_feedback_status_endpoint(9)