import jwt
from flask_httpauth import HTTPTokenAuth
from flask import g
from backend import db
from backend.config import CONFIG
from backend.db import DbErrorNotExist

auth = HTTPTokenAuth('Bearer')


@auth.verify_token
def verify_token(token):
    try:
        data = jwt.decode(token, CONFIG.secret, algorithms=['HS256'], options={"verify_exp": False})
        username = data['username']
        password = data['password']
        admin = db.get_admin(username)
    except (DbErrorNotExist, KeyError):
        return False
    g.current_user = admin
    return admin.verify_password(password)