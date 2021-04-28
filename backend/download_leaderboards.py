import requests
from pprint import pprint
import json
from datetime import datetime
import time
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

start = time.time()

HEADERS = {
    "accept": "application/json, text/plain, */*",
    "accept-language": "en-GB,en;q=0.9,it-IT;q=0.8,it;q=0.7,en-US;q=0.6,es;q=0.5",
    "cache-control": "no-cache",
    "pragma": "no-cache",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "referer": "https://dirtrally2.dirtgame.com/community-events"
}


def get_initial_state():
    url = "https://dirtrally2.dirtgame.com/api/ClientStore/GetInitialState"
    res = requests.get(url, headers=HEADERS, verify=False)
    HEADERS['racenet.xsrfh'] = res.json().get('identity').get('token')
    HEADERS['cookie'] = res.headers['Set-Cookie']


def get_community_challenges():
    url = "https://dirtrally2.dirtgame.com/api/Challenge/Community"
    res = requests.get(url, headers=HEADERS, verify=False).json()
    daily = res[0]
    weekly = res[1]
    monthly = res[2]
    return daily, weekly, monthly


def get_monthly_challenges():
    _, _, monthly = get_community_challenges()
    groups = monthly['challengeGroups']

    for index, group in enumerate(groups):
        print(index, ":", group['name'])
    selected_index = int(input("Select month: ") or 0)

    last_group = groups[selected_index]

    filters = []
    for challenge in last_group['challenges']:
        challenge['groupName'] = last_group['name']
        events = challenge.pop("events")
        for x, event in enumerate(events):
            stages = event.pop("stages")
            for y, stage in enumerate(stages):
                key = f'{challenge["id"]}-{event["id"]}-{stage["id"]}'
                filters.append({
                    "key": key,
                    "x": x,
                    "y": y,
                    "challenge": challenge,
                    "event": event,
                    "stage": stage
                })
    return filters


def get_leaderboard(challenge, event, stage, page, page_size=100):
    url = "https://dirtrally2.dirtgame.com/api/Leaderboard"
    payload = {
        "challengeId": challenge["id"],
        "eventId": event["id"],
        "stageId": stage["id"],
        "page": page,
        "selectedEventId": 0,
        "pageSize": page_size,
        "orderByTotalTime": True,
        "platformFilter": "None",
        "playerFilter": "Everyone",
        "filterByAssists": "Unspecified",
        "filterByWheel": "Unspecified",
        "nationalityFilter": "None",
    }
    res = requests.post(url, json=payload, headers=HEADERS, verify=False)
    print("challenge", challenge["id"], "event", event["id"], "stage", stage["id"], "page", page)
    return res.json()


def index(data):
    payload = []
    for d in data:
        payload.append(json.dumps(
            {"index": {"_index": "dr2", "_id": d["key"]}}
        ))
        payload.append(json.dumps(
            d
        ))
    payload_string = "\n".join(payload) + "\n"
    headers = {
        "Content-Type": "application/x-ndjson"
    }
    res = requests.post("http://localhost:9200/_bulk", data=payload_string, headers=headers)
    print("indexing...", res)



def get_leaderboards():
    filters = get_monthly_challenges()
    leaders = []
    for f in filters:
        res = get_leaderboard(f["challenge"], f["event"], f["stage"], page=1)
        page_count = res['pageCount']
        for page in range(1, page_count + 1):
            res = get_leaderboard(f["challenge"], f["event"], f["stage"], page)

            leaderboard_items = []

            for entry in res['entries']:
                item = {
                    'key': f["key"] + "-" + entry["name"],
                    'x': f["x"],
                    'y': f["y"],
                    'challenge': f["challenge"],
                    'event': f["event"],
                    'stage': f["stage"],
                    'entry': entry,
                    'ingested': datetime.now().isoformat()
                }
                leaderboard_items.append(item)

            index(leaderboard_items)
            print((time.time() - start)/60, "mins..")


get_initial_state()
get_leaderboards()

end = time.time()
print(end-start, "seconds")


