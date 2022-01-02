from flask import Flask, request, Response
from sqlalchemy.exc import IntegrityError
from backend import db
from backend.config import CONFIG
from backend.auth import auth
from backend.db import DbErrorDelete

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = CONFIG.uri()
db.init(app)


@app.route('/user/register', methods=['POST'])
def register_user():
    try:
        chat_id = int(request.args.get("chat_id"))
        db.add_user(chat_id)
        return Response("Welcome to the student polls management service!")
    except IntegrityError:
        return Response("You are already registered!", status=409)


@app.route('/user/remove', methods=['DELETE'])
def remove_user():
    try:
        chat_id = int(request.args.get("chat_id"))
        db.delete_user(chat_id)
        return Response("Goodbye! 👋")
    except DbErrorDelete as err:
        return Response(err.message, status=404)


@app.route('/admin/register', methods=['POST'])
@auth.login_required
def register_admin():
    try:
        username = request.args.get("username")
        password = request.args.get("password")
        db.add_admin(username, password)
        return Response()
    except IntegrityError:
        return Response(status=409)


@app.route('/test', methods=['GET'])
@auth.login_required
def test():
    return Response("SUCCESS")


if __name__ == '__main__':
    app.run()
