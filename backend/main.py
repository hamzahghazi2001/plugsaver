# main.py
from app.auth import create_account, registration_verify, email_code_gen,login,login_verify
from fastapi import FastAPI, HTTPException, Depends, Query
from app.household import create_household, join_household
from app.devicecreation import add_device,get_device_categories,insert_default_categories,add_room,give_permission,delete_device,delete_room,update_device
from app.rewards import Points_and_badges, get_global, get_local, get_household
from app.feedback import put_feedback, get_feedback, change_feedback_status
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from supabase import create_client
import app.config as config
from typing import List, Dict, Any
from fastapi.responses import JSONResponse

supabase = create_client(config.SUPABASE_URL, config.SUPABASE_KEY)

app = FastAPI()
security = HTTPBearer()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allows all origins
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
    # Call create_account to check if the user exists and passwords match
    result = create_account(request.email, request.password, request.confirmpass)
    
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["message"])
    
    # Store the verification code in the dictionary
    verification_codes[request.email] = result["verification_code"]
    
    return {"success": True, "message": "Verification code sent."}


@app.post("/verify_registration")
async def verify_registration_endpoint(request: VerifyRequest):
    # Retrieve the system-generated verification code from the dictionary
    systemverifycode = verification_codes.get(request.email)
    
    if systemverifycode is None:
        raise HTTPException(status_code=400, detail="No verification code found for this email.")
    
    # Validate the request payload
    if not all([request.email, request.name, request.password, request.userverifycode]):
        raise HTTPException(status_code=422, detail="Missing required fields.")
    
    # Call the registration_verify function
    result = registration_verify(
        email=request.email,
        name=request.name,
        password=request.password,
        userverifycode=request.userverifycode,
        systemverifycode=systemverifycode
    )
    
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["message"])
    
    # Remove the verification code from the dictionary after successful verification
    del verification_codes[request.email]
    
    return {"success": True, "message": "Account verified and created."}

class ResendCodeRequest(BaseModel):
    email: str

@app.post("/resend-code")
async def resend_code(request: ResendCodeRequest):
    # Generate a new verification code
    verification_code = email_code_gen(request.email)
    
    # Store the new verification code in the dictionary
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
    
    # Store the verification code in the dictionary
    verification_codes[request.email] = result["verification_code"]
    
    return {"success": True, "message": "Verification code sent."}

@app.post("/verify_login")
async def verify_login_endpoint(request: VerifyLoginRequest):
    # Fetch the verification code for the email
    systemverifycode = verification_codes.get(request.email)
    if systemverifycode is None:
        raise HTTPException(status_code=400, detail="No verification code found for this email.")
    
    # Verify the user's code against the system's code
    if request.userverifycode != systemverifycode:
        raise HTTPException(status_code=400, detail="Invalid verification code.")
    
    # Remove the verification code after successful verification
    del verification_codes[request.email]
    
    # Fetch the user_id from the database using the email
    try:
        # Query the database to get the user_id for the given email
        result = supabase.from_("users").select("user_id").eq("email", request.email).execute()
        
        # Check if the query returned any data
        if not result.data:
            raise HTTPException(status_code=404, detail="User not found.")
        
        # Extract the user_id from the query result
        user_id = result.data[0]["user_id"]
        
        # Return the success response with the user_id
        return {"success": True, "message": "Login successful.", "user_id": user_id}
    
    except Exception as e:
        # Handle any errors that occur during the database query
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
    return {"success": True, "household_code": result["household_code"]}

@app.post("/join_household")
async def join_household_endpoint(request: JoinHouseholdRequest):
    result = join_household(request.email, request.household_code)
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["message"])
    return {"success": True, "message": result["message"]}

@app.get("/user_email")
async def get_user_email(token: str = Depends(security)):
    try:
        # Verify the token using Supabase's built-in auth
        user = supabase.auth.get_user(token.credentials)
        if not user:
            raise HTTPException(status_code=401, detail="Invalid token")

        return {"success": True, "email": user.email}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
insert_default_categories()

class AddDeviceRequest(BaseModel):
    user_id: int  # Add user_id
    room_id: int
    device_name: str
    device_category: str
    household_code: str  # Add household_code
    active_days: List[str]  # Expects a list, not a string
    active_time_start: str
    active_time_end: str
    icon: Dict[str, str]  # Expects a dictionary, not a string
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
        request.user_id,  # Pass user_id
        request.room_id,
        request.device_name,
        request.device_category,
        request.household_code,  # Pass household_code
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
    return {"success": True, "message": "Device added successfully."}

@app.delete("/api/auth/devices")
async def delete_device_endpoint(request: DeleteDeviceRequest):
    print(f"Deleting device: device_id={request.device_id}, household_code={request.household_code}, user_id={request.user_id}")
    result = delete_device(request.household_code, request.user_id, request.device_id)
    
    if not result["success"]:
        # Ensure the result contains a message
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


@app.put("/update-device/{device_id}")
async def update_device_endpoint(device_id: str, device: dict):
    result = update_device(device_id, device)
    return {"success": result["success"], "device": result.get("device"), "message": result.get("message")}

class AddRoomRequest(BaseModel):
    household_code: str
    room_name: str

@app.post("/add-room")
async def add_room_endpoint(request: AddRoomRequest):
    print("Received payload:", request.dict())  # Log the incoming payload

    try:
        # Call the add_room function
        result = add_room(request.household_code, request.room_name)
        print("Result from add_room function:", result)  # Log the result

        if not result["success"]:
            raise HTTPException(status_code=400, detail=result["message"])
        return {"success": True, "message": "Room added successfully."}

    except Exception as e:
        print("Error adding room:", str(e))  # Log the error
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/auth/rooms")
async def get_rooms(household_code: str = Query(...)):
    try:
        if household_code:
            # Fetch rooms for the specified household
            result = supabase.table("rooms").select("*").eq("household_code", household_code).execute()
        else:
            # Fetch all rooms if no household_code is provided
            result = supabase.table("rooms").select("*").execute()

        if result.data:
            return {"success": True, "rooms": result.data}
        else:
            return {"success": False, "message": "No rooms found."}
    except Exception as e:
        return {"success": False, "message": str(e)}
    
# Fetch devices for a specific household
@app.get("/api/auth/devices")
async def get_devices(household_code: str = Query(...)):  # Make household_code required
    try:
        if household_code:
            # Fetch rooms for the specified household
            result = supabase.table("devices").select("*").eq("household_code", household_code).execute()
        else:
            # Fetch all rooms if no household_code is provided
            result = supabase.table("devices").select("*").execute()

        if result.data:
            return {"success": True, "devices": result.data}
        else:
            return {"success": False, "message": "No devices found."}
    except Exception as e:
        return {"success": False, "message": str(e)}

@app.get("/get_household_code")
async def get_household_code(email: str = Query(...)):
    try:
        # Fetch the household_code for the given email
        result = supabase.from_("users").select("household_code").eq("email", email).execute()
        
        if result.data:
            return {"success": True, "household_code": result.data[0]["household_code"]}
        else:
            return {"success": False, "message": "User not found."}
    except Exception as e:
        return {"success": False, "message": str(e)}

class AssignRoomRequest(BaseModel):
    room_id: int

@app.put("/api/auth/devices/{device_id}")
async def assign_device_to_room(device_id: int, request: AssignRoomRequest):
    try:
        # Fetch the device from the database
        device_result = supabase.from_("devices").select("*").eq("device_id", device_id).execute()
        if not device_result.data:
            raise HTTPException(status_code=404, detail="Device not found")
        device = device_result.data[0]

        # Fetch the room from the database
        room_result = supabase.from_("rooms").select("*").eq("room_id", request.room_id).execute()
        if not room_result.data:
            raise HTTPException(status_code=404, detail="Room not found")
        room = room_result.data[0]

        # Update the device's room_id in the database
        update_result = supabase.from_("devices").update({"room_id": request.room_id}).eq("device_id", device_id).execute()
        
        if not update_result.data:
            raise HTTPException(status_code=500, detail="Failed to update device room")

        return {"success": True, "message": "Device assigned to room successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
    

# main.py
from app.auth import create_account, registration_verify, email_code_gen, login, login_verify
from fastapi import FastAPI, HTTPException, Depends, Query, Path
from app.household import create_household, join_household
from app.devicecreation import add_device, get_device_categories, insert_default_categories, add_room, give_permission, delete_device, delete_room, update_device
from app.rewards import Points_and_badges, get_global, get_local, get_household
from app.feedback import put_feedback, get_feedback, change_feedback_status
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from supabase import create_client
import app.config as config
from typing import List, Dict, Any
from fastapi.responses import JSONResponse

supabase = create_client(config.SUPABASE_URL, config.SUPABASE_KEY)

app = FastAPI()
security = HTTPBearer()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allows all origins
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
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["message"])
    del verification_codes[request.email]
    return {"success": True, "message": "Account verified and created."}

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
    return {"success": True, "household_code": result["household_code"]}

@app.post("/join_household")
async def join_household_endpoint(request: JoinHouseholdRequest):
    result = join_household(request.email, request.household_code)
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["message"])
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
    return {"success": True, "message": "Device added successfully."}

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

@app.put("/update-device/{device_id}")
async def update_device_endpoint(device_id: str, device: dict):
    result = update_device(device_id, device)
    return {"success": result["success"], "device": result.get("device"), "message": result.get("message")}

class AddRoomRequest(BaseModel):
    household_code: str
    room_name: str

@app.post("/add-room")
async def add_room_endpoint(request: AddRoomRequest):
    print("Received payload:", request.dict())
    try:
        result = add_room(request.household_code, request.room_name)
        print("Result from add_room function:", result)
        if not result["success"]:
            raise HTTPException(status_code=400, detail=result["message"])
        return {"success": True, "message": "Room added successfully."}
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

@app.get("/get_household_code")
async def get_household_code(email: str = Query(...)):
    try:
        result = supabase.from_("users").select("household_code").eq("email", email).execute()
        if result.data:
            return {"success": True, "household_code": result.data[0]["household_code"]}
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


@app.get("/")
async def read_root():
    return {"message": "Welcome to the backend!"}


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