from supabase import create_client
import app.config as config
from operator import itemgetter

supabase = create_client(config.SUPABASE_URL,config.SUPABASE_KEY)

#function to insert or update points and set badge booleans
def Points_and_badges(rewards_id):
    try:
        #find cost saved
        all_cost = supabase.table('analytics').select('cost_saved').eq('user_id', rewards_id).execute()
        cost_saved = 0.0
        for x in all_cost.data:
            cost_saved = cost_saved + x.get("cost_saved")
        #find energy saved
        all_energy = supabase.table('analytics').select('energy_saved').eq('user_id', rewards_id).execute()
        energy_saved = 0.0
        for x in all_energy.data:
            energy_saved = energy_saved + x.get("energy_saved")
        #calculate points
        points = int((0.5 * cost_saved) + (0.5 * energy_saved))
        #updates points if record already exists, adds otherwise
        existing_record = supabase.table('rewards').select('*').eq('rewards_id', rewards_id).execute()
        if existing_record.data:
            supabase.table('rewards').update({'points': points}).eq('rewards_id', rewards_id).execute()
        else:
            supabase.table('rewards').insert({'rewards_id': rewards_id, 'points': points}).execute()
        #updates badge booleans
        update_badges(rewards_id, points, energy_saved)
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
        household_champion = local_champion = global_champion = False
        #find if household champion or not
        household_code = supabase.table('users').select('household_code').eq('user_id', rewards_id).execute()
        household_members = supabase.table('users').select('user_id').eq('household_code', household_code.data[0].get("household_code")).execute()
        for x in household_members.data:
            member = supabase.table('rewards').select('points').eq('rewards_id', x.get("user_id")).execute()
            household_champion = True if points >= member.data[0].get('points') else False
        #find if local champion or not
        country = supabase.table('users').select('country').eq('user_id', rewards_id).execute()
        country_members = supabase.table('users').select('user_id').eq('country', country.data[0].get("country")).execute()
        for x in country_members.data:
            member = supabase.table('rewards').select('points').eq('rewards_id', x.get("user_id")).execute()
            local_champion = True if points >= member.data[0].get('points') else False
        #find if global champion or not
        all_points = supabase.table('rewards').select('points').execute()
        max_global = 0
        for x in all_points.data:
            if x.get("points") >= max_global: max_global = x.get("points")
        global_champion = True if points >= max_global else False
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
    
#returns top 4 from passed list, called by each leaderboard function
def send_results(sorted_list,list_size):
    if list_size < 5:
        print (sorted_list)
        return sorted_list
    else:
        print([sorted_list[-4],sorted_list[-3],sorted_list[-2],sorted_list[-1]])
        return [sorted_list[-4],sorted_list[-3],sorted_list[-2],sorted_list[-1]]

#leaderboard function for global leaderboard
def get_global():
    all_global = supabase.table('rewards').select('rewards_id, points').execute().data
    sorted_global = sorted(all_global, key=itemgetter('points'))
    send_results(sorted_global, len(sorted_global))

#leaderboard function for local leaderboard
def get_local(rewards_id):
    country = supabase.table('users').select('country').eq('user_id', rewards_id).execute()
    country_members = supabase.table('users').select('user_id').eq('country', country.data[0].get("country")).execute()
    all_local = []
    for x in country_members.data:
        member = supabase.table('rewards').select('rewards_id, points').eq('rewards_id', x.get("user_id")).execute().data[0]
        all_local.append(member)
    sorted_local = sorted(all_local, key=itemgetter('points'))
    send_results(sorted_local, len(sorted_local))

#leaderboard function for global leaderboard
def get_household(rewards_id):
    household_code = supabase.table('users').select('household_code').eq('user_id', rewards_id).execute()
    household_members = supabase.table('users').select('user_id').eq('household_code', household_code.data[0].get("household_code")).execute()
    all_household = []
    for x in household_members.data:
        member = supabase.table('rewards').select('rewards_id, points').eq('rewards_id', x.get("user_id")).execute().data[0]
        all_household.append(member)
    sorted_household = sorted(all_household, key=itemgetter('points'))
    send_results(sorted_household, len(sorted_household))