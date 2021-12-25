CREATE TABLE poll(
    uid BIGINT PRIMARY KEY,
    telegram_id BIGINT
);
CREATE TABLE poll_props(
    poll_uid BIGINT,
    question VARCHAR(1023),
    -- TODO add properties (is_anonymous, quiz or regular)
    FOREIGN KEY(poll_uid) REFERENCES poll(uid) ON DELETE CASCADE
);
CREATE TABLE poll_answer(
    poll_uid BIGINT,
    answer VARCHAR(255),
    PRIMARY KEY(poll_uid, answer)
);
CREATE TABLE "user"(
    chat_id BIGINT PRIMARY KEY,
    username VARCHAR(255)
);
CREATE TABLE user_response(
    chat_id BIGINT,
    poll_uid BIGINT,
    answer VARCHAR(255),
    FOREIGN KEY(poll_uid, answer) REFERENCES poll_answer(poll_uid, answer) ON DELETE CASCADE,
    FOREIGN KEY(chat_id) REFERENCES "user"(chat_id) ON DELETE CASCADE
);
