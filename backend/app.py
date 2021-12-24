from flask import Flask, request, Response
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.exc import IntegrityError
from backend import db_services
from backend.config import CONFIG
from backend.db_services import DbErrorDelete

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = CONFIG.uri()
db = SQLAlchemy(app)


@app.route('/register', methods=['POST'])
def register_user():
    try:
        chat_id = int(request.args.get("chat_id"))
        username = request.args.get("username")
        db_services.add_user(chat_id, username)
        return Response("Welcome to the student polls management service!")
    except IntegrityError:
        return Response("You are already registered!", status=409)


@app.route('/remove', methods=['DELETE'])
def remove_user():
    try:
        chat_id = int(request.args.get("chat_id"))
        username = request.args.get("username")
        db_services.delete_user(chat_id, username)
        return Response("Goodbye! 👋")
    except DbErrorDelete as err:
        return Response(err.message, status=404)


if __name__ == '__main__':
    app.run()
