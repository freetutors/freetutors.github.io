from flask import Flask, render_template
import json
app = Flask(__keys__)
import os

print(os.getcwd())
@app.route('/')
def get_keys(path):
    with open(path) as f:
        return json.load(f)
    

keys = get_keys("./.secret/optimize.json")
print(keys)
        # - echo "window._env_ = {\"apiUrlcreate\":\"$apiUrlcreate\",\"apiUrlget\":\"$apiUrlget\",\"health\":\"$health\",\"apiUrlupdate\":\"$apiUrlupdate\",\"apiUrlanswer\":\"$apiUrlanswer\",\"apiUrlanswerUpdate\":\"$apiUrlanswerUpdate\",\"apiUrlgetUser\":\"$apiUrlgetUser\",\"poolId\":\"$poolId\",\"clientId\":\"$clientId\",\"region\":\"$region\",\"accessKey\":\"$accessKey\",\"secretKey\":\"$secretKey\",\"apiUrlCreateUser\":\"$apiUrlCreateUser\"};" >> ./config.js
