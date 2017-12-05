from flask import request
from flask import Flask
from flask import jsonify

from procedural_memcheck import ProceduralMemoryChecker

app = Flask(__name__)
pmc = ProceduralMemoryChecker()

@app.route('/signup')
def signup():
    user = request.args.get('user')
    success = pmc.register_user(user)
    return jsonify(pmc.get_train_set_for_user(user))

@app.route('/train', methods=['POST'])
def train():
    user = request.form.get('user')
    choices = eval(request.form.get('choices'))
    pmc.store_user_choices(user, choices)
    return "DONE"

@app.route('/test')
def test():
    user = request.args.get('user')
    return jsonify(pmc.get_test_set_for_user(user))

@app.route('/auth', methods=['POST'])
def store_stats():
    user = request.form.get('user')
    choices = eval(request.form.get('choices'))
    pmc.send_user_choices(user, choices)
    return "DONE"

if __name__ == '__main__':
    app.run()
