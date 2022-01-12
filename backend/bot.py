#!/usr/bin/env python

import logging
import requests

from backend import config
from telegram import Update, ParseMode
from telegram.ext import Updater, CommandHandler, PollAnswerHandler, CallbackContext

# Enable logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO
)

logger = logging.getLogger(__name__)


def register(update: Update, _) -> None:

    response = requests.post(
        f"http://localhost:5000/users",
        params={"chat_id": update.effective_chat.id}
    )
    update.message.reply_text(response.text)


def remove(update: Update, _) -> None:

    response = requests.delete(
        f"http://localhost:5000/users/{update.effective_chat.id}"
    )
    update.message.reply_text(response.text)


def receive_poll_answer(update: Update, context: CallbackContext) -> None:

    chat_id = update.poll_answer.user.id
    telegram_id = update.poll_answer.poll_id
    answer_index = update.poll_answer.option_ids[0]

    response = requests.post(
        f"http://localhost:5000/user/responses",
        params={"chat_id": chat_id, "telegram_id": telegram_id, "answer_index": answer_index}
    )
    resp_msg = "Something unexpected happened 😵" if response.status_code != 200 else "Thanks for voting!"
    context.bot.send_message(chat_id, resp_msg, parse_mode=ParseMode.HTML)


def bot() -> None:

    # Init updater with telegram bot token
    updater = Updater(config.bot_key)
    dispatcher = updater.dispatcher

    # Add command handlers
    dispatcher.add_handler(CommandHandler("register", register, run_async=True))
    dispatcher.add_handler(CommandHandler("remove", remove, run_async=True))
    dispatcher.add_handler(PollAnswerHandler(receive_poll_answer, run_async=True))

    # Start the Bot
    updater.start_polling()

    # Run the bot until Ctrl-C is pressed or the process receives SIGINT, SIGTERM or SIGABRT.
    updater.idle()


if __name__ == '__main__':
    bot()
