from flask import request
from flask import Flask
from flask import jsonify
import json

from perceptive_memcheck import PerceptiveMemoryChecker

app = Flask(__name__)
pmc = PerceptiveMemoryChecker()

@app.route('/signup')
def signup():
    user = request.args.get('user')
    success = pmc.register_user(user)
    return jsonify(pmc.get_train_set_for_user(user))

@app.route('/test')
def test():
    user = request.args.get('user')
    return jsonify(pmc.get_test_set_for_user(user))

@app.route('/auth', methods=['POST'])
def store_stats():
    user = request.form.get('user')
    stats = request.form.get('stats')
    pmc.store_stats_for_user(user, stats)
    return json.dumps({'success':True}), 200, {'ContentType':'application/json'}

