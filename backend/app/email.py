import secure_smtplib
import smtplib
from email.mime.text import MIMEText
import random
from supabase import create_client
import app.config as config

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