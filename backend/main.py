# main.py
from app.auth import create_account, registration_verify
from fastapi import FastAPI, HTTPException
from app.household import create_household, join_household
from app.devicecreation import add_device,add_device_category,get_device_categories,insert_default_categories,add_room

app=FastAPI()

def test_signup():
    email = "e@example.com"
    password = "securePassword123"
    name = "Ts"
    
   
    user = signup(email, password, name)
    
    if user:
        print("User signed up successfully:", user)
    else:
        print("Signup failed.")

def test_login():
    print("Welcome to the PlugSaver App!")

    
   # email = input("Enter your email: ")
    #password = input("Enter your password: ")

    print("\nAttempting to log in...")
    

    result = login("e@example.com", "securePassword123")


    if result:
        print("Login successful!")
    else:
        print("Login failed.")

def test_email():
    verify("joseph.kariampally@gmail.com")
    print("TEST COMPLETE")

@app.post("/create-household")
def create_household_endpoint(email: str):
    result = create_household(email)
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["message"])
    return {"household_code": result["household_code"]}

@app.post("/join-household")
def join_household_endpoint(email: str, household_code: str):
    result = join_household(email, household_code)
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["message"])
    return result

def get_device_categories_endpoint():
    return get_device_categories()

@app.post("/add-device-category")
def add_device_category_endpoint(category_name: str):
    return add_device_category(category_name)

@app.post("/add-device")
def add_device_endpoint(household_code: str, user_id: int, room_id: int, device_name: str, device_category: str,active_days: list, active_time_start: str, active_time_end: str):
    return add_device(household_code, user_id, room_id, device_name, device_category,active_days, active_time_start, active_time_end)



#test_email()
#test_signup()
#create_household_endpoint("testuser@example.com")
#join_household_endpoint("test@example.com", "388488")

#get_device_categories_endpoint()
#add_device_category_endpoint("pc")
#add_room("388488","masterbedroom")
add_device_endpoint("388488",3,1,"asma's pc","pc",["monday","tuesday"],"9:00","16:00")



#test_login()

#code=create_account('joseph.kariampally@gmail.com','plugsaver01','plugsaver01')
#print(code)
#registration_verify('joseph.kariampally@gmail.com','Joseph','plugsaver01', code, code)

# Run the function to insert default categories
#insert_default_categories()
