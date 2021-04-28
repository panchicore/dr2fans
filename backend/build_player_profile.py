import json
import requests
from pprint import pprint

INDEX_URL = "http://localhost:9200/dr2"

def get_user_records(username):
    payload = {
        "sort": [
            {
                "challenge.id": {
                    "order": "desc"
                },
                "x": {
                    "order": "asc"
                },
                "y": {
                    "order": "asc"
                }
            }
        ],
        "_source": {
            "includes": ["entry", "challenge.id", "event.id", "stage.id", "x", "y", "key"]
        },
        "size": 1000,
        "query": {
            "bool": {
                "filter": [
                    {"term": {"entry.name.keyword": username}}
                ]
            }
        }
    }

    res = requests.post(f'{INDEX_URL}/_search', json=payload).json()
    records = {
        'entries': []
    }
    for hit in res['hits']['hits']:
        source = hit['_source']
        record = {}
        source['entry'].pop('isFounder')
        source['entry'].pop('isPlayer')
        source['entry'].pop('isVIP')
        nationality = source['entry'].pop('nationality')
        name = source['entry'].pop('name')
        record.update(source['entry'])
        record["challenge_id"] = source['challenge']['id']
        record["event_id"] = source['event']['id']
        record["stage_id"] = source['stage']['id']
        record["x"] = source['x']
        record["y"] = source['y']
        record["key"] = source['key']
        records['entries'].append(record)
        records['name'] = name
        records['nationality'] = nationality

    return records

if False:
    USERNAME = "panchicore"
    recs = get_user_records(USERNAME)
    file = open(f"{USERNAME}.json", "w")
    file.write(json.dumps(recs, indent=2))

