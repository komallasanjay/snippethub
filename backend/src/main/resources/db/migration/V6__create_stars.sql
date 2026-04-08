CREATE TABLE snippet_stars (
    user_id BIGINT NOT NULL,
    snippet_id BIGINT NOT NULL,
    starred_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, snippet_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (snippet_id) REFERENCES snippets(id) ON DELETE CASCADE
);
