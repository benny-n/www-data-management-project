import os
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

TELEGRAM_BOT_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN")
DB_USER = os.environ.get("DB_USER")
DB_PASSWORD = os.environ.get("DB_PASSWORD")
DB_NAME = os.environ.get("DB_NAME")
PORT = os.environ.get("PORT")
HOST = os.environ.get("HOST")
SECRET = os.environ.get("SECRET")


class Config:
    def __init__(self):
        self.token = TELEGRAM_BOT_TOKEN
        self.user = DB_USER
        self.pw = DB_PASSWORD
        self.db = DB_NAME
        self.host = HOST
        self.port = PORT
        self.secret = SECRET

    def uri(self) -> str:
        return f'postgresql://{self.user}:{self.pw}@{self.host}:{self.port}/{self.db}'


CONFIG = Config()
