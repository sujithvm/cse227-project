from flask import request
from flask import Flask
from flask import jsonify
import json

from perceptive_memcheck import PerceptiveMemoryChecker
from procedural_memcheck import ProceduralMemoryChecker

app = Flask(__name__)
pmc = PerceptiveMemoryChecker()
poc = ProceduralMemoryChecker()

@app.route('/perceptive/signup')
def perc_signup():
    user = request.args.get('user')
    success = pmc.register_user(user)
    return jsonify(pmc.get_train_set_for_user(user))

@app.route('/perceptive/test')
def perc_test():
    user = request.args.get('user')
    return jsonify(pmc.get_test_set_for_user(user))

@app.route('/perceptive/auth', methods=['POST'])
def perc_store_stats():
    user = request.form.get('user')
    stats = json.loads(request.form.get('stats'))
    pmc.store_stats_for_user(user, stats)
    return json.dumps({'success':True}), 200, {'ContentType':'application/json'}

@app.route('/poc/signup')
def poc_signup():
    user = request.args.get('user')
    success = poc.register_user(user)
    return jsonify(poc.get_train_set_for_user(user))

@app.route('/poc/train', methods=['POST'])
def poc_train():
    user = request.form.get('user')
    choices = eval(request.form.get('choices'))
    poc.store_user_choices(user, choices)
    return json.dumps({'success':True}), 200, {'ContentType':'application/json'}

@app.route('/poc/test')
def poc_test():
    user = request.args.get('user')
    return jsonify(poc.get_test_set_for_user(user))

@app.route('/poc/auth', methods=['POST'])
def poc_store_stats():
    user = request.form.get('user')
    choices = eval(request.form.get('choices'))
    poc.send_user_choices(user, choices)
    return json.dumps({'success':True}), 200, {'ContentType':'application/json'}
