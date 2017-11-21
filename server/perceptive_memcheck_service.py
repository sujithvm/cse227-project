from flask import request
from flask import Flask
from flask import jsonify

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

#@app.route('/auth')
#POST Request?

if __name__ == '__main__':
    app.run()
