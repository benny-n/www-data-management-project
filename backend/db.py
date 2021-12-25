from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


def init(app):
    db.init_app(app)


class DbError(Exception):
    def __init__(self):
        self.message = ''


class DbErrorDelete(DbError):
    pass


class DbErrorDeleteBeforeRegister(DbErrorDelete):
    def __init__(self):
        self.message = "Please register first! 🙄"


class DbErrorDeleteWrongUsername(DbErrorDelete):
    def __init__(self):
        self.message = "Are you sure you're registered with this username? 🤔"


class User(db.Model):
    chat_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)


def add_user(chat_id: int, username: str):
    try:
        db.session.add(User(chat_id=chat_id, username=username))
        db.session.commit()
    except Exception:
        raise


def delete_user(chat_id: int, username: str):
    try:
        user_to_delete: User = User.query.filter_by(chat_id=chat_id).first()
        if not user_to_delete:
            raise DbErrorDeleteBeforeRegister()

        if user_to_delete.username != username:
            raise DbErrorDeleteWrongUsername()

        db.session.delete(user_to_delete)
        db.session.commit()
    except Exception:
        raise
