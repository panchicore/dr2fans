python backend/download_leaderboards.py

read -p "Download finished, hit enter to generate files and deploy. Control+C to cancel. " -n 1 -r
echo

python backend/build_challenges_db.py
python backend/build_players_db.py
cp -Rv backend/jsondb frontend/public
yarn --cwd frontend build
yarn --cwd frontend deployFirebaseHosting
