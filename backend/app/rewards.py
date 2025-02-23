from supabase import create_client
import app.config as config

supabase = create_client(config.SUPABASE_URL,config.SUPABASE_KEY)

#function to insert or update points and set badge booleans
def Points_and_badges(rewards_id):
    try:
        cost_saved = supabase.table('analytics').select('cost_saved').eq('analytics_id', rewards_id).execute()
        energy_saved = supabase.table('analytics').select('energy_saved').eq('analytics_id', rewards_id).execute()
        points = (0.5 * cost_saved) + (0.5 * energy_saved)
        existing_record = supabase.table('rewards').select('*').eq('rewards_id', rewards_id).execute()
        #updates points if record already exists, adds otherwise
        if existing_record.data:
            supabase.table('rewards').update({'points': points}).eq('rewards_id', rewards_id).execute()
        else:
            supabase.table('rewards').insert({'rewards_id': rewards_id, 'points': points}).execute()
        #updates badge booleans after each change
        update_badges(rewards_id, points, energy_saved)
    except Exception as e:
        print("Error:", e)  
        return 0
    
#function to update badge booleans
def update_badges(rewards_id, points, energy_saved):
    try:
        #find status of each badge, champion badges kept to false till logic found
        bronze_saver = True if energy_saved >= 100 else False
        silver_saver = True if energy_saved >= 1000 else False
        gold_saver = True if energy_saved >= 10000 else False
        beginner_points = True if points >= 100 else False
        competent_points = True if points >= 1000 else False
        professional_points = True if points >= 10000 else False
        household_champion, local_champion, global_champion = False
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
