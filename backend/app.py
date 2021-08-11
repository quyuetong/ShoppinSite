import json
from flask import Flask, request
from gtbay.user import User
from gtbay.item import Item
from gtbay.rating import Rating
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


# A sample implementation of flask api.
@app.route('/login', methods=['POST'])
def login():
    data = json.loads(request.get_data().decode())
    obj = User()
    res = obj.login(data['username'], data['password'])
    obj.cnx.teardown()
    return json.dumps(res)


@app.route('/register', methods=['POST'])
def register():
    data = json.loads(request.get_data().decode())
    obj = User()
    res = obj.register(data['username'], data['password'], data['firstname'], data['lastname'])
    obj.cnx.teardown()
    return json.dumps(res)


@app.route('/search_item', methods=['POST'])
def search_item():
    data = json.loads(request.get_data().decode())
    obj = Item()
    res = obj.search(**data)
    obj.cnx.teardown()
    return json.dumps(res)


@app.route('/get_category', methods=['GET'])
def get_category():
    obj = Item()
    res = obj.get_category()
    obj.cnx.teardown()
    return json.dumps(res)


@app.route('/list_item', methods=['POST'])
def list_item():
    data = json.loads(request.get_data().decode())
    obj = Item()
    res = obj.list_item(**data)
    obj.cnx.teardown()
    return json.dumps(res)


@app.route('/get_item', methods=['POST'])
def get_item():
    data = json.loads(request.get_data().decode())
    obj = Item()
    res = obj.get_item(**data)
    obj.cnx.teardown()
    return json.dumps(res)


@app.route('/bid_item', methods=['POST'])
def bid_item():
    data = json.loads(request.get_data().decode())
    obj = Item()
    res = obj.bid_item(**data)
    obj.cnx.teardown()
    return json.dumps(res)


@app.route('/change_description', methods=['POST'])
def change_description():
    data = json.loads(request.get_data().decode())
    obj = Item()
    res = obj.change_description(**data)
    obj.cnx.teardown()
    return json.dumps(res)


@app.route('/auction_result', methods=['GET'])
def auction_result():
    obj = Item()
    res = obj.auction_result()
    obj.cnx.teardown()
    return json.dumps(res)


@app.route('/category_report', methods=['GET'])
def category_report():
    obj = Item()
    res = obj.category_report()
    obj.cnx.teardown()
    return json.dumps(res)


@app.route('/user_report', methods=['GET'])
def user_report():
    obj = User()
    res = obj.user_report()
    obj.cnx.teardown()
    return json.dumps(res)


@app.route('/get_rating', methods=['POST'])
def get_rating():
    data = json.loads(request.get_data().decode())
    obj = Rating()
    res = obj.get_ratings(**data)
    obj.cnx.teardown()
    return json.dumps(res)


@app.route('/rate_item', methods=['POST'])
def rate_item():
    data = json.loads(request.get_data().decode())
    obj = Rating()
    res = obj.rate_item(**data)
    obj.cnx.teardown()
    return json.dumps(res)


@app.route('/delete_rating', methods=['POST'])
def delete_rating():
    data = json.loads(request.get_data().decode())
    obj = Rating()
    res = obj.delete_rating(**data)
    obj.cnx.teardown()
    return json.dumps(res)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80, debug=True, use_reloader=False, threaded=True)
