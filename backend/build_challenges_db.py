import json
import requests
from pprint import pprint
import pathlib
here = pathlib.Path(__file__).parent.absolute()

INDEX_URL = "http://localhost:9200/dr2"


def get_challenges():
    payload = {
        "size": 0,
        "query": {
            "match_all": {}
        },
        "aggs": {
            "groups": {
                "terms": {
                    "field": "challenge.groupName.keyword",
                    "size": 1000
                },
                "aggs": {
                    "challenges": {
                        "terms": {
                            "field": "challenge.id",
                            "size": 1000
                        }
                    }
                }
            }
        }
    }
    res = requests.post(f'{INDEX_URL}/_search', json=payload).json()
    challenges_db = {}

    # collect the challenges
    for bucket in res['aggregations']['groups']['buckets']:
        groupName = bucket['key']
        for c in bucket['challenges']['buckets']:
            challenges_db[c["key"]] = {
                "id": c["key"],
                "groupName": groupName,
                "events": {},
                "doc_count": bucket["doc_count"]
            }

    # collect the challenges events
    for challenge_id in challenges_db.keys():
        payload = {
          "size": 1,
          "query": {
            "bool": {
              "filter": [
                {"term": {
                  "challenge.id": challenge_id
                }}
              ]
            }
          },
          "aggs": {
            "events": {
              "terms": {
                "field": "event.id",
                "size": 100
              },
              "aggs": {
                "stages": {
                  "terms": {
                    "field": "stage.id",
                    "size": 100
                  }
                }
              }
            }
          }
        }
        res = requests.post(f'{INDEX_URL}/_search', json=payload).json()
        for bucket in res['aggregations']['events']['buckets']:
            event_id = bucket["key"]
            challenges_db[challenge_id]["events"][event_id] = {
                "id": event_id,
                "doc_count": bucket["doc_count"],
                "stages": {}
            }

            for stage_bucket in bucket['stages']['buckets']:
                stage_id = stage_bucket["key"]
                challenges_db[challenge_id]["events"][event_id]["stages"][stage_id] = {
                    "id": stage_bucket["key"],
                    "doc_count": stage_bucket["doc_count"],
                }

    # enritch events
    for challenge_id in challenges_db:
        for event_id in challenges_db[challenge_id]["events"]:
            payload = {
                "size": 1,
                "query": {
                    "bool": {
                        "filter": [
                            {"term": {"challenge.id": challenge_id}},
                            {"term": {"event.id": event_id}}
                        ]
                    }
                }
            }

            res = requests.post(f'{INDEX_URL}/_search', json=payload).json()
            event = res['hits']['hits'][0]['_source']['event']
            challenges_db[challenge_id]["events"][event_id].update(event)
            challenges_db[challenge_id]["events"][event_id].update(
                {"order": res['hits']['hits'][0]['_source']["x"]}
            )
            challenges_db[challenge_id].update(res['hits']['hits'][0]['_source']['challenge'])

            # enritch stages
            for stage_id in challenges_db[challenge_id]['events'][event_id]['stages'].keys():
                payload = {
                    "size": 1,
                    "query": {
                        "bool": {
                            "filter": [
                                {"term": {"challenge.id": challenge_id}},
                                {"term": {"event.id": event_id}},
                                {"term": {"stage.id": stage_id}}
                            ]
                        }
                    }
                }

                res = requests.post(f'{INDEX_URL}/_search', json=payload).json()
                stage = res['hits']['hits'][0]['_source']['stage']
                challenges_db[challenge_id]['events'][event_id]["stages"][stage_id].update(stage)
                challenges_db[challenge_id]['events'][event_id]["stages"][stage_id].update(
                    {"order": res['hits']['hits'][0]['_source']['y']}
                )

    return challenges_db

challenges = get_challenges()
print("> building", len(challenges.keys()), "challengues... challenges_db.json")
f = open(f"{here}/jsondb/challenges_db.json", "w")
f.write(json.dumps(challenges))
f.close()

