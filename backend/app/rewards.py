from supabase import create_client
import app.config as config

supabase = create_client(config.SUPABASE_URL,config.SUPABASE_KEY)

#function to insert or update points and set badge booleans
def Points_and_badges(rewards_id):
    try:
        cost_saved = supabase.table('analytics').select('sum(cost_saved)').eq('user_id', rewards_id).execute()
        energy_saved = supabase.table('analytics').select('sum(energy_saved)').eq('user_id', rewards_id).execute()
        points = (0.5 * cost_saved["data"][0]["cost_saved"]) + (0.5 * energy_saved["data"][0]["energy_saved"])
        existing_record = supabase.table('rewards').select('*').eq('rewards_id', rewards_id).execute()
        #updates points if record already exists, adds otherwise
        if existing_record.data:
            supabase.table('rewards').update({'points': points}).eq('rewards_id', rewards_id).execute()
        else:
            supabase.table('rewards').insert({'rewards_id': rewards_id, 'points': points}).execute()
        #updates badge booleans
        update_badges(rewards_id, points, energy_saved["data"][0]["energy_saved"])
    except Exception as e:
        print("Error:", e)  
        return 0
    
#function to update badge booleans, called automatically by main function
def update_badges(rewards_id, points, energy_saved):
    try:
        #find status of saver badges
        bronze_saver = True if energy_saved >= 100 else False
        silver_saver = True if energy_saved >= 1000 else False
        gold_saver = True if energy_saved >= 10000 else False
        #find status of points badges
        beginner_points = True if points >= 25 else False
        competent_points = True if points >= 100 else False
        professional_points = True if points >= 500 else False
        #initialize champion badges to false
        household_champion, local_champion, global_champion = False
        #find if household champion or not
        household_code = supabase.table('users').select('household_code').eq('user_id', rewards_id).execute()
        household_members = supabase.table('users').select('user_id').eq('household_code', household_code["data"][0]["household_code"]).execute()
        for x in household_members["data"]:
            member = supabase.table('rewards').select('points').eq('rewards_id', x["user_id"]).execute()
            household_champion = True if points > member else False
        #find if local champion or not
        country = supabase.table('users').select('country').eq('user_id', rewards_id).execute()
        country_members = supabase.table('users').select('user_id').eq('country', country["data"][0]["country"]).execute()
        for x in country_members["data"]:
            member = supabase.table('rewards').select('points').eq('rewards_id', x["user_id"]).execute()
            local_champion = True if points > member else False
        #find if global champion or not
        max_global = supabase.table('rewards').select('max(points)').execute()
        global_champion = True if points > max_global else False
        #update badges with found results
        supabase.table('rewards').update(
        {'bronze_saver_badge': bronze_saver, 
         'silver_saver_badge': silver_saver, 
         'gold_saver_badge': gold_saver, 
         'beginner_points_badge': beginner_points, 
         'competent_points_badge': competent_points, 
         'professional_points_badge': professional_points, 
         'household_champion_badge': household_champion, 
         'local_champion_badge': local_champion, 
         'global_champion_badge': global_champion}).eq('rewards_id', rewards_id).execute()
    except Exception as e:
        print("Error:", e)  
        return 0

Points_and_badges(101)