# app/auth.py
from supabase import create_client
import bcrypt
import app.config as config

import smtplib
import random
from email.mime.text import MIMEText


# Supabase credentials
supabase = create_client(config.SUPABASE_URL,config.SUPABASE_KEY)

def email_code_gen(recipient_email):
    generatedcode = random.randint(100000, 999999)
    msg = MIMEText(f"This is the Verification code for the PlugSaver App : {generatedcode}")
    msg['Subject'] = "Verification Code"
    msg['From'] = "plugsaver7@gmail.com"
    msg['To'] = recipient_email
    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()
    server.login('plugsaver7@gmail.com', 'jjrhjrfdkdceeonc')
    server.send_message(msg)
    server.quit()
    return generatedcode

#def forgot_pass_change()


def forgot_pass_email(recipient_email):
    query = f"SELECT COUNT(*) FROM users WHERE email = {recipient_email}"
    response = supabase.rpc("sql", {"query": query}).execute()
    if response==1:
        verificationcode = random.randint(100000, 999999)
        msg = MIMEText(f"Password change has been requested for the PlugSaver App: {verificationcode}")
        msg['Subject'] = "Verification Code"
        msg['From'] = "plugsaver7@gmail.com"
        msg['To'] = recipient_email
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login('plugsaver7@gmail.com', 'jjrhjrfdkdceeonc')
        server.send_message(msg)
        server.quit()
    else:
        return(0)
    
def make_hash(input):
    salt=bcrypt.gensalt()
    return(bcrypt.hashpw(input.encode(),salt))

def create_account(email, password, confirmpass):
    try:
        # Check if the email already exists
        existing_user = supabase.table('users').select('email').eq('email', email).execute()
        if existing_user.data:
            print(f"Error: The email {email} is already in use.")
            return {"success": False, "message": "Email already in use."}  # Return a dictionary
        
        # Check if passwords match
        if password != confirmpass:
            print(f"Error: The passwords do not match.")
            return {"success": False, "message": "Passwords do not match."}  # Return a dictionary
        
        # Generate and send verification code
        verification_code = email_code_gen(email)
        return {"success": True, "message": "Verification code sent.", "verification_code": verification_code}  # Return a dictionary
    
    except Exception as e:
        print("Error during signup:", e)
        return {"success": False, "message": "An error occurred during signup."}  # Return a dictionary   
    
    
def registration_verify(email, name, password, userverifycode, systemverifycode):
    if userverifycode != systemverifycode:
        print(f"Error: Incorrect verification code.")
        return {"success": False, "message": "Incorrect verification code."}
    
    # Hash the password
    hashed_password = make_hash(password)
    
    # Insert data into the database
    response = supabase.table('users').insert({
        'email': email,
        'password': hashed_password.decode(),
        'name': name,
        'is_verified': True
    }).execute()
    
    print("Supabase Response:", response)
    if response.data:
        print("Signup successful!")
        return {"success": True, "message": "Account verified and created."}
    else:
        return {"success": False, "message": "Failed to create account."}
def login(email, password):
    try:
        response = supabase.table('users').select('email', 'password', 'is_verified').eq('email', email).execute()
        print("Supabase Response:", response)
        if response.data:
            user = response.data[0]
            # Check if the email is verified
            # if not user['is_verified']:
            #print("Error: Your email is not verified.")
            #return None
            if bcrypt.checkpw(password, user['password']):
                return 1
            else:
                print("Error: Incorrect password.")
                return 0
        else:
            print(f"Error: No user found with email {email}.")
            return 0
    except Exception as e:
        print("Error during login:", e)
        return 0

def login_verify(userverifycode, systemverifycode):
    if userverifycode!=systemverifycode:
        print(f"Error: Incorrect verification code.")
        return 0  
    else:
        return 1
    
