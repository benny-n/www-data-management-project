from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class DbError(Exception):
    def __init__(self):
        self.message = ''


class DbErrorDelete(DbError):
    pass


class DbErrorDeleteBeforeRegister(DbErrorDelete):
    def __init__(self):
        self.message = "Please register first! 🙄"


class User(db.Model):
    chat_id = db.Column(db.Integer, primary_key=True)


def init(app):
    with app.app_context():
        db.init_app(app)
        db.create_all()


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

