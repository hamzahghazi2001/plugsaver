# main.py
from app.auth import signup,login
from app.email import verify
from fastapi import FastAPI, HTTPException
from app.household import create_household, join_household

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


#test_email()
#test_signup()
#create_household_endpoint("testuser@example.com")
join_household_endpoint("test@example.com", "388488")

#test_login()