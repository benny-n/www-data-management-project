CREATE TABLE "user"(
    chat_id INTEGER PRIMARY KEY,
    username VARCHAR(255)
);
CREATE TABLE poll(
    poll_id INTEGER PRIMARY KEY,
    question VARCHAR(1023)
);
CREATE TABLE response(
    chat_id INTEGER,
    poll_id INTEGER,
    answer VARCHAR(255),
    FOREIGN KEY(chat_id) REFERENCES "user"(chat_id) ON DELETE CASCADE,
    FOREIGN KEY(poll_id) REFERENCES poll(poll_id) ON DELETE CASCADE
);
