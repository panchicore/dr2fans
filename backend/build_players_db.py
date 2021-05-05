import json
import requests
from build_player_profile import get_user_records
import pathlib
here = pathlib.Path(__file__).parent.absolute()

INDEX_URL = "http://localhost:9200/dr2"


def get_usernames():

    print("> getting usernames...")

    players_db = []
    after_key = ""

    while after_key is not None:

        payload = {
            "_source": False,
            "query": {
                "match_all": {}
            },
            "aggs": {
                "players": {
                    "composite": {
                        "size": 1000,
                        "sources": [
                            {
                                "username": {
                                    "terms": {
                                        "field": "entry.name.keyword"
                                    }
                                }
                            }
                        ],
                        "after": {
                            "username": after_key
                        }
                    }
                }
            }
        }

        res = requests.post(f'{INDEX_URL}/_search', json=payload).json()
        players = res['aggregations']['players']
        for bucket in players['buckets']:
            players_db.append({
                "u": bucket['key']['username']
            })

        after_key = players.get('after_key', None)
        if after_key:
            after_key = after_key['username']

    return players_db


players = get_usernames()
players_db = []
player_records = {}
page = 1

print("> getting", len(players), "players...")
for i, p in enumerate(players):

    u = get_user_records(p['u'])
    player_records[p['u']] = u

    p.update({"p": page})
    players_db.append(p)

    if len(player_records.keys()) > 50:
        # print("> saving players page", page)
        file = open(f"{here}/jsondb/players_data/players-{page}.json", "w")
        file.write(json.dumps(player_records))
        file.close()
        page = page + 1
        player_records = {}


file = open(f"{here}/jsondb/players_db.json", "w")
file.write(json.dumps(players_db))
file.close()

print("> done")
