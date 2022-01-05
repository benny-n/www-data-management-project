import requests
from flask import Flask, request, Response, jsonify, session
from flask_cors import CORS, cross_origin
from sqlalchemy.exc import IntegrityError
from werkzeug.exceptions import InternalServerError
from uuid import uuid4 as generate_uid
from backend import db
from backend.config import CONFIG
from backend.auth import auth
from backend.db import DbErrorDelete, DbErrorNotExist

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = CONFIG.uri()
app.secret_key = CONFIG.secret
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
        session['credentials'] = f"{username}:{password}"
        return Response()
    except DbErrorNotExist:
        return Response(status=401)


@app.route('/logout', methods=['GET'])
@cross_origin()
def logout():
    session.pop('credentials', None)
    return Response()


# TODO add @cross_origin to anything with @login_required
# TODO also change request.args.get to request.json

@app.route('/admins', methods=['POST'])
@auth.login_required
def register_admin():
    try:
        username = request.args.get("username")
        password = request.args.get("password")
        db.add_admin(username=username, password=password)
        return Response()
    except IntegrityError:
        return Response(status=409)


def send_poll(uid, question, answers, filters=None):
    chat_ids = db.get_all_chat_ids() if filters is None else db.get_chat_ids(filters)

    for chat_id in chat_ids:
        resp = requests.post(
            url=f"https://api.telegram.org/bot{CONFIG.token}/sendPoll",
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
def send_new_poll():
    try:
        question = request.args.get("question")
        answers = request.args.get("answers")
        filters = request.args.get("filters")
        uid = generate_uid()

        db.add_poll(poll_uid=uid, question=question)

        for index, answer in enumerate(answers):
            db.add_poll_answer(poll_uid=uid, index=index, answer=answer)

        send_poll(uid, question, answers, filters)

        return Response()

    except IntegrityError:
        return Response(status=409)


@app.route('/polls/<poll_uid>', methods=['PUT'])
@auth.login_required
def send_existing_poll(poll_uid):
    try:
        filters = request.args.get("filters")
        props = db.get_poll_props(poll_uid)
        answers = db.get_answers(poll_uid)

        send_poll(props.poll_uid, props.question, answers, filters)

        return Response()

    except IntegrityError:
        return Response(status=409)

    except DbErrorNotExist:
        raise InternalServerError


@app.route('/polls/<poll_uid>/stats', methods=['GET'])
@auth.login_required
def get_poll_statistics(poll_uid):
    try:
        vote_count = {answer: votes for _, answer, votes, in db.get_poll_stats(poll_uid)}
        return jsonify(vote_count)
    except Exception:
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


@app.route('/test_with', methods=['GET'])
@auth.login_required()
@cross_origin()
def test_with():
    print(session["username"])
    return Response()


@app.route('/test_without', methods=['GET'])
@cross_origin(supports_credentials=True)
def test_without():
    try:
        print(session["username"])
    except KeyError:
        print('omg it works')
    return Response()


if __name__ == '__main__':
    app.run()
