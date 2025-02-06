# main.py
from app.auth import signup,login
from app.email import verify

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

test_email()
#test_signup()
#test_login()