import requests
import jwt
from flask import Flask, request, Response, jsonify
from flask_cors import cross_origin
from sqlalchemy.exc import IntegrityError
from werkzeug.exceptions import InternalServerError
from uuid import uuid4 as generate_uid
from backend import db, config
from backend.auth import auth
from backend.db import DbErrorDelete, DbErrorNotExist


def uri():
    return f'postgresql://{config.db_user}:{config.db_password}@{config.host}:{config.port}/{config.db_name}'


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = uri()
db.init(app)


@app.route('/users', methods=['POST'])
def register_user():
    try:
        chat_id = int(request.args.get("chat_id"))
        db.add_user(chat_id=chat_id)
        return Response("Welcome to the student polls management service!")
    except IntegrityError:
        return Response("You are already registered!", status=409)


@app.route('/users/<chat_id>', methods=['DELETE'])
def remove_user(chat_id):
    try:
        db.delete_user(chat_id)
        return Response("Goodbye! 👋")
    except DbErrorDelete as err:
        return Response(err.message, status=404)


@app.route('/login', methods=['POST'])
@cross_origin()
def login():
    try:
        username = request.json["username"]
        password = request.json["password"]
        admin = db.get_admin(username)
        if not admin.verify_password(password):
            return Response(status=401)
        return Response(jwt.encode(
            {"username": username,
             "password": password
             },
            config.secret,
            algorithm='HS256'
        ))
    except DbErrorNotExist:
        return Response(status=401)


@app.route('/admins', methods=['POST'])
@auth.login_required
@cross_origin()
def register_admin():
    try:
        username = request.json["username"]
        password = request.json["password"]
        db.add_admin(username=username, password=password)
        return Response()
    except IntegrityError:
        return Response(status=409)


@app.route('/admins', methods=['GET'])
@auth.login_required
@cross_origin()
def get_all_admins():
    try:
        return jsonify(db.get_all_admins())
    except Exception as e:
        print(e)
        raise InternalServerError


def send_poll(uid, question, answers, filters=None):
    chat_ids = db.get_all_chat_ids() if filters is None else db.get_chat_ids(filters)

    for chat_id in chat_ids:
        resp = requests.post(
            url=f"https://api.telegram.org/bot{config.bot_key}/sendPoll",
            json={
                'chat_id': chat_id,
                'question': question,
                'options': answers,
                'is_anonymous': False,
            }).json()
        if not resp["ok"]:
            raise InternalServerError
        telegram_poll_id = resp["result"]["poll"]["id"]
        db.add_poll_receiver(telegram_id=telegram_poll_id, uid=uid)


@app.route('/polls', methods=['POST'])
@auth.login_required
@cross_origin()
def create_poll():
    try:
        question = request.json["question"]
        answers = request.json["answers"]
        filters = request.json["filters"]  # TODO if doesn't exist, exception, or None?
        uid = generate_uid()

        if question in db.get_all_questions():
            return Response(status=409)
        db.add_poll(poll_uid=uid, question=question)

        for index, answer in enumerate(answers):
            db.add_poll_answer(poll_uid=uid, index=index, answer=answer)

        send_poll(uid, question, answers, filters)

        return Response()

    except Exception as e:
        print(e)
        raise InternalServerError


@app.route('/polls/<uid>', methods=['DELETE'])
@auth.login_required
@cross_origin()
def delete_poll(uid):
    try:
        db.delete_poll(uid)
        return Response()
    except Exception as e:
        print(e)
        raise InternalServerError


@app.route('/polls/stats', methods=['GET'])
@auth.login_required
@cross_origin()
def get_poll_statistics():
    try:
        poll_stats = {"stats": []}
        for poll in db.get_all_polls()["polls"]:
            uid = poll["uid"]
            question = db.get_poll(uid).question
            query = db.get_poll_stats(uid)
            poll_stats["stats"].append({
                "uid": uid,
                "question": question,
                "answers": [answer for _, answer, _, in query],
                "votes": [votes for _, _, votes, in query],
            })
        return jsonify(poll_stats)
    except Exception as e:
        print(e)
        raise InternalServerError


@app.route('/polls', methods=['GET'])
@auth.login_required
@cross_origin()
def get_all_polls():
    try:
        return jsonify(db.get_all_polls())
    except Exception as e:
        print(e)
        raise InternalServerError


@app.route('/user/responses', methods=['POST'])
def receive_user_response():
    try:
        telegram_id = request.args.get("telegram_id")
        poll_receiver = db.PollReceiver.query.filter_by(telegram_id=telegram_id).first()
        poll_uid = poll_receiver.uid
        chat_id = request.args.get("chat_id")
        answer_index = request.args.get("answer_index")

        db.add_user_response(poll_uid=poll_uid, chat_id=chat_id, index=answer_index)
        db.delete_poll_receiver(telegram_id=telegram_id)
        return Response('Thanks for voting!')
    except Exception as e:
        print(e)
        raise InternalServerError


if __name__ == '__main__':
    app.run()
