# app/auth.py
from supabase import create_client
import bcrypt
import app.config as config
from app.email import email_code_gen

# Supabase credentials
supabase = create_client(config.SUPABASE_URL,config.SUPABASE_KEY)

def make_hash(input):
    salt=bcrypt.gensalt()
    return(bcrypt.hashpw(input.encode(),salt))

def create_account(email, password, confirmpass):
    try:
        #Checking if email already exists
        existing_user = supabase.table('users').select('email').eq('email', email).execute()
        if existing_user.data:
            print(f"Error: The email {email} is already in use.")
            return 0
        #Checking if passwords match
        if str(password)!=str(confirmpass):
            print(f"Error: The passwords do not match.")
            return 0            
        return email_code_gen(email)
    except Exception as e:
        print("Error during signup:", e)  
        return 0
    
def registration_verify(email, name, password, userverifycode, systemverifycode):
    if userverifycode!=systemverifycode:
        print(f"Error: Incorrect verification code.")
        return 0  
    #Hashing Password 
    hashed_password = make_hash(password)
    #Inputing data into Database
    response = supabase.table('users').insert({'email': email,'password': hashed_password.decode(),'name': name,'is_verified': True }).execute()
    print("Supabase Response:", response)  
    if response.data:
        print("Signup successful!")
        return 1
    else:
        return 0

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