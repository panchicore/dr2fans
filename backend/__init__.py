print("python download_leaderboards.py")
print("-")
print("python build_challengues_db.py")
print("python build_players_db.py")
print("-")
print("cp -Rv jsondb ../frontend/public; cd ../frontend; yarn build; yarn deployFirebaseHosting")

import download_leaderboards
import build_challenges_db
import build_players_db
print("~")
print("cp -Rv jsondb ../frontend/public; cd ../frontend; yarn build; yarn deployFirebaseHosting")
