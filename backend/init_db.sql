CREATE TABLE poll(
    uid VARCHAR(36) PRIMARY KEY,
    question VARCHAR(300)
);
CREATE TABLE poll_answer(
    uid VARCHAR(36),
    index INTEGER,
    answer VARCHAR(100),
    PRIMARY KEY(uid, index)
);
CREATE TABLE poll_receiver(
    telegram_id BIGINT PRIMARY KEY,
    uid VARCHAR(36)
);
CREATE TABLE "user"(
    chat_id BIGINT PRIMARY KEY
);
CREATE TABLE user_response(
    chat_id BIGINT PRIMARY KEY,
    poll_uid VARCHAR(36) PRIMARY KEY,
    index INTEGER PRIMARY KEY,
    FOREIGN KEY(poll_uid, index) REFERENCES poll_answer(uid, index) ON DELETE CASCADE,
    FOREIGN KEY(chat_id) REFERENCES "user"(chat_id)
);
