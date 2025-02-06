# app/auth.py
from supabase import create_client
import bcrypt
import config

# Supabase credentials
supabase = create_client(config.SUPABASE_URL,config.SUPABASE_KEY)

# def signup(email, password, name):
#     hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
#     verify(email)
#     # Add a default value for 'role'
#     response = supabase.table('users').insert({
#         'email': email,
#         'password': hashed_password.decode('utf-8'),
#         'name': name,
#         'is_verified': False 
#     }).execute()

#     print("Supabase Response:", response)

#     if response.status_code == 201:
#         print("Signup successful!")
#         return response.data
#     else:
#         print("Error:", response.message)
#         return None
# def login(email, password):
#     # Your login logic here
#     pass 

def signup(email, password, name):
    try:
        print("Checking if email already exists...")  
        existing_user = supabase.table('users').select('email').eq('email', email).execute()
        
        if existing_user.data:
            print(f"Error: The email {email} is already in use.")
            return None
        
        print("Email is available. Proceeding with password hashing...")  
        
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        
        print("Password hashed. Proceeding to insert into Supabase...")  
        
        response = supabase.table('users').insert({
            'email': email,
            'password': hashed_password.decode('utf-8'),
            'name': name,
            'is_verified': False 
        }).execute()

        print("Supabase Response:", response)  

        
        if response.data:
            print("Signup successful!")
            
            verify(email)
            return response.data
        else:
            print(f"Error during signup: No data returned. Response: {response}")
            return None
        
    except Exception as e:
        print("Error during signup:", e)  
        return None
    


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

            
            if bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
                return user
            else:
                print("Error: Incorrect password.")
                return None
        else:
            print(f"Error: No user found with email {email}.")
            return None

    except Exception as e:
        print("Error during login:", e)
        return None
