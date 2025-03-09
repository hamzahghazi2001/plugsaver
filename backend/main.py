# main.py
from app.auth import create_account, registration_verify, email_code_gen,login,login_verify
from fastapi import FastAPI, HTTPException, Depends
from app.household import create_household, join_household
from app.devicecreation import add_device,get_device_categories,insert_default_categories,add_room,give_permission,delete_device,delete_room
from app.rewards import Points_and_badges, get_global, get_local, get_household
from app.feedback import put_feedback, get_feedback, change_feedback_status
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from supabase import create_client
import app.config as config

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
    systemverifycode = verification_codes.get(request.email)
    if systemverifycode is None:
        raise HTTPException(status_code=400, detail="No verification code found for this email.")
    
    result = login_verify(request.userverifycode, systemverifycode)
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["message"])
    
    # Remove the verification code after successful verification
    del verification_codes[request.email]
    
    return {"success": True, "message": "Login successful."}

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