from flask import Flask, render_template
import json
app = Flask(__keys__)
import os

# print(os.getcwd())
@app.route('/')
def index():
    keys = get_keys("./.secret/optimize.json")
    return render_template('index.html', keys=keys)
def get_keys(path):
    with open(path) as f:
        return json.load(f)

# if __keys__ == '__main__':
#     app.run(debug=True)

# - echo "window._env_ = {\"apiUrlcreate\":\"$apiUrlcreate\",\"apiUrlget\":\"$apiUrlget\",\"health\":\"$health\",\"apiUrlupdate\":\"$apiUrlupdate\",\"apiUrlanswer\":\"$apiUrlanswer\",\"apiUrlanswerUpdate\":\"$apiUrlanswerUpdate\",\"apiUrlgetUser\":\"$apiUrlgetUser\",\"poolId\":\"$poolId\",\"clientId\":\"$clientId\",\"region\":\"$region\",\"accessKey\":\"$accessKey\",\"secretKey\":\"$secretKey\",\"apiUrlCreateUser\":\"$apiUrlCreateUser\"};" >> ./config.js
