from flask_httpauth import HTTPTokenAuth
from flask import g, session
from backend import db
from backend.db import DbErrorNotExist

auth = HTTPTokenAuth(scheme='Bearer')


def verify_password(username, password):
    if not username:
        return False
    try:
        admin = db.get_admin(username)
    except DbErrorNotExist:
        return False
    g.current_user = admin
    return admin.verify_password(password)


@auth.verify_token
def verify_token(_):
    try:
        username, password = session['credentials'].split(":")
    except KeyError:
        return False
    return verify_password(username, password)
