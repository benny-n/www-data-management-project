from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import ForeignKeyConstraint, func
from sqlalchemy.exc import IntegrityError
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

POLL_UID_LENGTH = 36
ANSWER_LENGTH = 100
QUESTION_LENGTH = 300


class DbError(Exception):
    def __init__(self):
        self.message = ''


class DbErrorNotExist(DbError):
    pass


class DbErrorDelete(DbError):
    pass


class DbErrorDeleteBeforeRegister(DbErrorDelete):
    def __init__(self):
        self.message = "Please register first! 🙄"


class Poll(db.Model):
    uid = db.Column(db.String(POLL_UID_LENGTH), primary_key=True)
    question = db.Column(db.String(QUESTION_LENGTH))


class PollAnswer(db.Model):
    uid = db.Column(db.String(POLL_UID_LENGTH), primary_key=True)
    index = db.Column(db.Integer, primary_key=True)
    answer = db.Column(db.String(ANSWER_LENGTH))
    __table_args__ = (
        ForeignKeyConstraint(
            (uid,),
            [Poll.uid],
            ondelete="CASCADE"
        ),
    )


class PollReceiver(db.Model):
    telegram_id = db.Column(db.BigInteger, primary_key=True)
    uid = db.Column(db.String(POLL_UID_LENGTH))


class User(db.Model):
    chat_id = db.Column(db.BigInteger, primary_key=True)


class UserResponse(db.Model):
    chat_id = db.Column(db.BigInteger, primary_key=True)
    poll_uid = db.Column(db.String(POLL_UID_LENGTH), primary_key=True)
    index = db.Column(db.Integer, primary_key=True)
    __table_args__ = (
        ForeignKeyConstraint(
            (poll_uid, index),
            [PollAnswer.uid, PollAnswer.index],
            ondelete="CASCADE"
        ),
    )


class Admin(db.Model):
    username = db.Column(db.String(64), primary_key=True)
    password_hash = db.Column(db.String(128))

    def verify_password(self, password) -> bool:
        return check_password_hash(self.password_hash, password)


def add_default_admin():
    try:
        add_admin(username="admin", password="236369")
    except IntegrityError:  # if default admin already exists, do nothing
        return


def init(app):
    with app.app_context():
        db.init_app(app)
        db.create_all()
        db.session.commit()
        add_default_admin()


def add_db_model(create_db_model_func):
    # db_model = create_db_model_func()

    def inner(**kwargs):
        try:
            db.session.add(create_db_model_func(**kwargs))
            db.session.commit()

        except Exception:
            db.session.rollback()
            raise

    return inner


@add_db_model
def add_user(chat_id: int):
    return User(chat_id=chat_id)


def delete_user(chat_id: int):
    try:
        user_to_delete: User = User.query.filter_by(chat_id=chat_id).first()
        if not user_to_delete:
            raise DbErrorDeleteBeforeRegister()

        db.session.delete(user_to_delete)
        db.session.commit()

    except Exception:
        db.session.rollback()
        raise


@add_db_model
def add_user_response(poll_uid, chat_id, index):
    return UserResponse(poll_uid=poll_uid, chat_id=chat_id, index=index)


def get_chat_ids(filters):
    filtered_chat_ids = set(get_all_chat_ids())
    for poll_filter in filters:
        poll_uid = poll_filter["pollUid"]
        answer_index = poll_filter["answerIndex"]
        filtered_chat_ids &= set(
            [user_response.chat_id for user_response in
             UserResponse.query.filter_by(
                 poll_uid=poll_uid,
                 index=answer_index)
             ]
        )
    return filtered_chat_ids


def get_all_chat_ids():
    return [user.chat_id for user in User.query.all()]


@add_db_model
def add_admin(username, password):
    return Admin(username=username, password_hash=generate_password_hash(password))


def get_admin(username):
    admin = Admin.query.filter_by(username=username).first()
    if admin is None:
        raise DbErrorNotExist
    return admin


@add_db_model
def add_poll(poll_uid, question):
    return Poll(uid=poll_uid, question=question)


@add_db_model
def add_poll_answer(poll_uid, index, answer):
    return PollAnswer(uid=poll_uid, index=index, answer=answer)


@add_db_model
def add_poll_receiver(telegram_id, uid):
    return PollReceiver(telegram_id=telegram_id, uid=uid)


def delete_poll(uid):
    try:
        poll_to_delete: Poll = Poll.query.filter_by(uid=uid).first()
        db.session.delete(poll_to_delete)
        db.session.commit()

    except Exception:
        db.session.rollback()
        raise


def delete_poll_receiver(telegram_id):
    try:
        poll_to_delete: PollReceiver = PollReceiver.query.filter_by(telegram_id=telegram_id).first()
        db.session.delete(poll_to_delete)
        db.session.commit()

    except Exception:
        db.session.rollback()
        raise


def get_poll(poll_uid):
    poll = Poll.query.filter_by(uid=poll_uid).first()
    if poll is None:
        raise DbErrorNotExist
    return poll


def get_answers(poll_uid):
    answers = PollAnswer.query.filter_by(poll_uid=poll_uid).all()
    if answers is None:
        raise DbErrorNotExist
    return answers


def get_poll_stats(poll_uid):
    return db.session.query(UserResponse.poll_uid, PollAnswer.answer, func.count(UserResponse.chat_id)) \
        .join(PollAnswer, (UserResponse.poll_uid == PollAnswer.uid) & (UserResponse.index == PollAnswer.index)) \
        .filter(UserResponse.poll_uid == poll_uid) \
        .group_by(UserResponse.poll_uid, PollAnswer.answer) \
        .all()


def get_all_questions():
    return [poll.question for poll in Poll.query.all()]


def get_all_polls():
    query_result = db.session.query(Poll.uid, Poll.question, PollAnswer.answer, PollAnswer.index) \
        .join(PollAnswer, (Poll.uid == PollAnswer.uid)) \
        .all()
    polls_dict = {}
    for uid, question, _, _ in query_result:
        polls_dict[uid] = {"question": question, "answers": []}
    for uid, _, answer, index in query_result:
        polls_dict[uid]["answers"].append((index, answer))

    polls_list = []
    for uid, poll in polls_dict.items():
        polls_list.append({
            "uid": uid,
            "question": poll["question"],
            "answers": [answer for _, answer in sorted(poll["answers"], key=lambda x: x[0])]
        })

    return {"polls": polls_list}


def get_all_admins():
    admins = [admin.username for admin in Admin.query.all()]
    return {"admins": admins}
