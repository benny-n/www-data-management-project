#!/usr/bin/env python

import logging
import requests
from backend.config import CONFIG
from telegram import Update
from telegram.ext import Updater, CommandHandler

# Enable logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO
)

logger = logging.getLogger(__name__)


def register(update: Update, _) -> None:

    response = requests.post(
        f"http://localhost:5000/register",
        params={"chat_id": update.effective_chat.id}
    )
    update.message.reply_text(response.text)


def remove(update: Update, _) -> None:

    response = requests.delete(
        "http://localhost:5000/remove",
        params={"chat_id": update.effective_chat.id}
    )
    update.message.reply_text(response.text)


def bot() -> None:

    # Init updater with telegram bot token
    updater = Updater(CONFIG.token)
    dispatcher = updater.dispatcher

    # Add command handlers
    dispatcher.add_handler(CommandHandler("register", register))
    dispatcher.add_handler(CommandHandler("remove", remove))

    # Start the Bot
    updater.start_polling()

    # Run the bot until Ctrl-C is pressed or the process receives SIGINT, SIGTERM or SIGABRT.
    updater.idle()


if __name__ == '__main__':
    bot()
