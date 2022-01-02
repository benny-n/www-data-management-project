from flask_httpauth import HTTPBasicAuth
from flask import g
from backend import db
from backend.db import DbErrorNotExist

auth = HTTPBasicAuth()


@auth.verify_password
def verify_password(username, password):
    if not username:
        return False
    try:
        admin = db.get_admin(username)
    except DbErrorNotExist:
        return False
    g.current_user = admin
    return admin.verify_password(password)
