from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import ForeignKeyConstraint
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
    telegram_id = db.Column(db.BigInteger, primary_key=True)
    uid = db.Column(db.String(POLL_UID_LENGTH))


class PollProps(db.Model):
    poll_uid = db.Column(db.String(POLL_UID_LENGTH), primary_key=True)
    question = db.Column(db.String(QUESTION_LENGTH))
    # TODO do we need these??
    # is_anonymous = db.Boolean
    # is_quiz = db.Boolean


class PollAnswer(db.Model):
    poll_uid = db.Column(db.String(POLL_UID_LENGTH), primary_key=True)
    answer = db.Column(db.String(ANSWER_LENGTH), primary_key=True)


class User(db.Model):
    chat_id = db.Column(db.BigInteger, primary_key=True)


class UserResponse(db.Model):
    chat_id = db.Column(db.BigInteger, primary_key=True)
    poll_uid = db.Column(db.String(POLL_UID_LENGTH), primary_key=True)
    answer = db.Column(db.String(ANSWER_LENGTH), primary_key=True)
    __table_args__ = (
        ForeignKeyConstraint(
            (poll_uid, answer),
            [PollAnswer.poll_uid, PollAnswer.answer],
            ondelete="CASCADE"
        ),
        ForeignKeyConstraint(
            (chat_id,),
            [User.chat_id]
        )
    )


class Admin(db.Model):
    username = db.Column(db.String(64), primary_key=True)
    password_hash = db.Column(db.String(128))

    def verify_password(self, password) -> bool:
        return check_password_hash(self.password_hash, password)


def init(app):
    with app.app_context():
        db.init_app(app)
        db.create_all()
        db.session.commit()


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


def get_chat_ids(filters):
    filtered_chat_ids = get_all_chat_ids()
    for poll_uid, answer in filters:
        filtered_chat_ids = set(filtered_chat_ids) & set([user_response.chat_id for user_response in
                                                          UserResponse.query.filter_by(poll_uid=poll_uid,
                                                                                       answer=answer)])
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


def add_poll(telegram_id, uid):
    try:
        db.session.add(Poll(telegram_id=telegram_id, uid=uid))
        db.session.commit()

    except Exception:
        db.session.rollback()
        raise


@add_db_model
def add_poll_props(poll_uid, question):
    return PollProps(poll_uid=poll_uid, question=question)


@add_db_model
def add_poll_answer(poll_uid, answer):
    return PollAnswer(poll_uid=poll_uid, answer=answer)


def get_poll_props(poll_uid):
    poll_props = PollProps.query.filter_by(poll_uid=poll_uid).first()
    if poll_props is None:
        raise DbErrorNotExist
    return poll_props


def get_answers(poll_uid):
    answers = PollAnswer.query.filter_by(poll_uid=poll_uid).all()
    if answers is None:
        raise DbErrorNotExist
    return answers
