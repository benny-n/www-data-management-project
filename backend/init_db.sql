CREATE TABLE poll(
    telegram_id BIGINT PRIMARY KEY,
    uid VARCHAR(36)
);
CREATE TABLE poll_props(
    poll_uid VARCHAR(36) PRIMARY KEY,
    question VARCHAR(300)
    -- TODO add properties (is_anonymous, quiz or regular)
);
CREATE TABLE poll_answer(
    poll_uid VARCHAR(36),
    answer VARCHAR(100),
    PRIMARY KEY(poll_uid, answer)
);
CREATE TABLE "user"(
    chat_id BIGINT PRIMARY KEY
);
CREATE TABLE user_response(
    chat_id BIGINT PRIMARY KEY,
    poll_uid VARCHAR(36) PRIMARY KEY,
    answer VARCHAR(100) PRIMARY KEY,
    FOREIGN KEY(poll_uid, answer) REFERENCES poll_answer(poll_uid, answer) ON DELETE CASCADE,
    FOREIGN KEY(chat_id) REFERENCES "user"(chat_id)
);
