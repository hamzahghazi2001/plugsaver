from supabase import create_client
import app.config as config
from operator import itemgetter
import json
import random

supabase = create_client(config.SUPABASE_URL,config.SUPABASE_KEY)

#function to insert or update points and set badge booleans
def Points_and_badges(rewards_id):
    try:
        points = 0
        existing_record = supabase.table('rewards').select('points').eq('rewards_id', rewards_id).execute()
        if existing_record.data:
            points = existing_record.data[0].get('points')
        total_consumption = 0
        consumption = supabase.table('analytics').select('energy_consumed').eq('user_id', rewards_id).execute()
        for x in consumption.data:
            total_consumption += x.get('energy_consumed')
        #calculate points
        points += int(1000 / (total_consumption + 10))
        #updates points if record already exists, adds otherwise
        if existing_record.data:
            supabase.table('rewards').update({'points': points}).eq('rewards_id', rewards_id).execute()
        else:
            supabase.table('rewards').insert({'rewards_id': rewards_id, 'points': 0}).execute()
        #updates badge booleans
        update_badges(rewards_id, points)
        return {"success": True, "message": "Points and badges updated successfully."}
    except Exception as e:
        print("Error:", e)  
        return {"success": False, "message": str(e)}
    
#function to update badge booleans, called automatically by main function
def update_badges(rewards_id, points):
    try:
        #find status of saver badges
        bronze_saver = True if points >= 100 else False
        silver_saver = True if points >= 1000 else False
        gold_saver = True if points >= 5000 else False
        #find status of points badges
        beginner_points = True if points >= 100 else False
        competent_points = True if points >= 1000 else False
        professional_points = True if points >= 5000 else False
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
    
def get_rewards(rewards_id):
    try:
        # Fetch points for the given rewards_id
        pointsfetched = supabase.table('rewards').select('points').eq('rewards_id', rewards_id).execute()
        
        # Check if the query returned any data
        if not pointsfetched.data:
            return {"success": False, "message": "No rewards found for the given ID."}
        
        # Fetch leaderboard data
        global_leaderboard = get_global()
        #print(global_leaderboard)
        local_leaderboard = get_local(rewards_id)
        #print(local_leaderboard)
        household_leaderboard = get_household(rewards_id)
        #print(household_leaderboard)

        # Get the points from the fetched data
        points = pointsfetched.data[0].get('points')  # Default to 0 if points are not found
        
        return {
            "success": True,
            "points": points,
            "global": global_leaderboard,
            "local": local_leaderboard,
            "household": household_leaderboard
        }
    except Exception as e:
        print(f"Error in get_rewards: {e}")
        return {"success": False, "message": str(e)}
    
def send_results(sent_list):
    sorted_list = []
    for x in sent_list:
        nameandpfp = supabase.table('users').select('name, avatar').eq('user_id', x.get('rewards_id')).execute()
        avatar = nameandpfp.data[0].get('avatar')
        if avatar == "NULL":
            avatar = "/placeholder.svg"
        record = {"avatar": nameandpfp.data[0].get('avatar'), "name": nameandpfp.data[0].get('name'), "points": x.get('points')}
        sorted_list.append(record)
    
    # Ensure the list has at least 4 entries, filling with empty data if necessary
    while len(sorted_list) < 4:
        rand = random.randint(1, 100)
        record = {"avatar": "https://i.pravatar.cc/150?img="+ str(rand) , "name": "No more people", "points": 0}
        sorted_list.insert(0, record)
    
    return [sorted_list[-1], sorted_list[-2], sorted_list[-3], sorted_list[-4]]

#leaderboard function for global leaderboard
def get_global():
    all_global = supabase.table('rewards').select('rewards_id, points').execute()
    sorted_global = sorted(all_global.data, key=itemgetter('points'))
    return send_results(sorted_global)

#leaderboard function for local leaderboard
def get_local(rewards_id):
    country = supabase.table('users').select('country').eq('user_id', rewards_id).execute()
    country_members = supabase.table('users').select('user_id').eq('country', country.data[0].get("country")).execute()
    all_local = []
    for x in country_members.data:
        member = supabase.table('rewards').select('rewards_id, points').eq('rewards_id', x.get("user_id")).execute()
        if member.data:
            all_local.append(member.data[0])
    if len(all_local) == 0:
        return [{"name": "No more people", "points": 0}, {"name": "No more people", "points": 0}, {"name": "No more people", "points": 0}, {"name": "No more people", "points": 0}]
    sorted_local = sorted(all_local, key=itemgetter('points'))
    return send_results(sorted_local)

#leaderboard function for household leaderboard
def get_household(rewards_id):
    household_code = supabase.table('users').select('household_code').eq('user_id', rewards_id).execute()
    household_members = supabase.table('users').select('user_id').eq('household_code', household_code.data[0].get("household_code")).execute()
    all_household = []
    for x in household_members.data:
        member = supabase.table('rewards').select('rewards_id, points').eq('rewards_id', x.get("user_id")).execute()
        if member.data:
            all_household.append(member.data[0])
    if len(all_household) == 0:
        return [{"name": "No more people", "points": 0}, {"name": "No more people", "points": 0}, {"name": "No more people", "points": 0}, {"name": "No more people", "points": 0}]
    sorted_household = sorted(all_household, key=itemgetter('points'))
    return send_results(sorted_household)