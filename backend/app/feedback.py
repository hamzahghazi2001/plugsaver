from supabase import create_client
import app.config as config
import random

supabase = create_client(config.SUPABASE_URL,config.SUPABASE_KEY)

#function to put feedback into table
def put_feedback(user_id, message):
    try:
        #find and check a random feedback id
        generated_id = random.randint(0, 99999)
        check_id = supabase.table('feedback').select('*').eq('feedback_id', generated_id).execute()
        while(check_id.data):
            generated_id = random.randint(0, 99999)
            check_id = supabase.table('feedback').select('*').eq('feedback_id', generated_id).execute()
        #add feedback to table with found id
        supabase.table('feeback').insert({'feedback_id': generated_id, 'user_id': user_id, 'feedback_message': message}).execute()
        #the commented line below is used solely for testing, uncomment it and comment the line above when testing in main.py
        #supabase.table('feedback').insert({'feedback_id': user_id, 'user_id': user_id, 'feedback_message': message}).execute()
    except Exception as e:
        print("Error:", e)  
        return 0

#function to get feedback from feedback_id
def get_feedback(feedback_id):
    try:
        #get and return feedback
        x = supabase.table('feedback').select('*').eq('feedback_id', feedback_id).execute()
        return x
    except Exception as e:
        print("Error:", e)  
        return 0
    
#function to change the feedback status to resolved
def change_feedback_status(feedback_id):
    try:
        #update feedback status to resolved
        supabase.table('feedback').update({'status': 'resolved'}).eq('feedback_id', feedback_id).execute()
    except Exception as e:
        print("Error:", e)  
        return 0