# app/auth.py
from supabase import create_client
import bcrypt
import random
import secure_smtplib
import smtplib
from email.mime.text import MIMEText

# Supabase credentials
url = "https://xgcfvxwrcunwsrvwwjjx.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhnY2Z2eHdyY3Vud3Nydnd3amp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc5OTIzNzIsImV4cCI6MjA1MzU2ODM3Mn0.fgT2LL7dlx7VR185WABZCtK8ZdF4rpdOIy-crGpp6tU"
supabase = create_client(url, key)


def verify(recipient_email):
    verificationcode = random.randint(100000, 999999)
    msg = MIMEText(f"This is the Verification code for the PlugSaver App : {verificationcode}")
    msg['Subject'] = "Verification Code"
    msg['From'] = "plugsaver7@gmail.com"
    msg['To'] = recipient_email
    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()
    server.login('plugsaver7@gmail.com', 'jjrhjrfdkdceeonc')
    server.send_message(msg)
    server.quit()

    

def signup(email, password, name):
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    verify(email)
    # Add a default value for 'role'
    response = supabase.table('users').insert({
        'email': email,
        'password': hashed_password.decode('utf-8'),
        'name': name,
        'is_verified': False 
    }).execute()

    print("Supabase Response:", response)

    if response.status_code == 201:
        print("Signup successful!")
        return response.data
    else:
        print("Error:", response.message)
        return None
def login(email, password):
    # Your login logic here
    pass 