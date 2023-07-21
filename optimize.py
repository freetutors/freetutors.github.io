
import json

def get_keys(path):
    with open(path) as f:
        return json.load(f)
    

keys = get_keys("/.secret/optimize.json")
API_Key = keys['apiUrlCreate']
print(API_Key)