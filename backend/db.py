from flask_login import UserMixin
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()


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


class User(db.Model):
    chat_id = db.Column(db.Integer, primary_key=True)


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


def add_user(chat_id: int):
    try:
        db.session.add(User(chat_id=chat_id))
        db.session.commit()

    except Exception:
        db.session.rollback()
        raise


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


def add_admin(username, password):
    try:
        db.session.add(Admin(username=username, password_hash=generate_password_hash(password)))
        db.session.commit()

    except Exception:
        db.session.rollback()
        raise


def get_admin(username):
    admin = Admin.query.filter_by(username=username).first()
    if admin is None:
        raise DbErrorNotExist
    return admin
