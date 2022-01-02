import requests
from flask import Flask, request, Response
from sqlalchemy.exc import IntegrityError
from werkzeug.exceptions import InternalServerError
from uuid import uuid4 as generate_uid
from backend import db
from backend.config import CONFIG
from backend.auth import auth
from backend.db import DbErrorDelete, DbErrorNotExist

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = CONFIG.uri()
db.init(app)


@app.route('/user/register', methods=['POST'])
def register_user():
    try:
        chat_id = int(request.args.get("chat_id"))
        db.add_user(chat_id=chat_id)
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


@app.route('/admin/login', methods=['POST'])
def login():
    try:
        username = request.args.get("username")
        password = request.args.get("password")
        admin = db.get_admin(username)
        if not admin.verify_password(password):
            return Response(status=401)
        return Response()
    except DbErrorNotExist:
        return Response(status=401)


@app.route('/admin/register', methods=['POST'])
@auth.login_required
def register_admin():
    try:
        username = request.args.get("username")
        password = request.args.get("password")
        db.add_admin(username=username, password=password)
        return Response()
    except IntegrityError:
        return Response(status=409)


def send_poll(uid, filters, question, answers, is_new=False):
    chat_ids = db.get_chat_ids(filters)

    for chat_id in chat_ids:
        resp = requests.post(
            url=f"https://api.telegram.org/bot{CONFIG.token}/sendPoll",
            data={
                'chat_id': chat_id,
                'question': question,
                'options': answers
            }).json()
        if not resp["ok"]:
            raise InternalServerError
        if is_new:
            telegram_poll_id = resp["result"]["poll"]["id"]
            db.add_poll(telegram_poll_id, uid)


@app.route('/admin/send/new-poll', methods=['POST'])
@auth.login_required
def send_new_poll():
    try:
        question = request.args.get("question")
        answers = request.args.get("answers")
        filters = request.args.get("filters")
        uid = generate_uid()

        db.add_poll_props(poll_uid=uid, question=question)

        for answer in answers:
            db.add_poll_answer(poll_uid=uid, answer=answer)

        send_poll(uid, filters, question, answers, is_new=True)

        return Response()

    except IntegrityError:
        return Response(status=409)


@app.route('/admin/send/poll', methods=['POST'])
@auth.login_required
def send_existing_poll():
    try:
        poll_uid = request.args.get("poll_uid")
        filters = request.args.get("filters")
        props = db.get_poll_props(poll_uid)
        answers = db.get_answers(poll_uid)

        send_poll(props.poll_uid, filters, props.question, answers, is_new=True)

        return Response()

    except IntegrityError:
        return Response(status=409)

    except DbErrorNotExist:
        raise InternalServerError


if __name__ == '__main__':
    app.run()
