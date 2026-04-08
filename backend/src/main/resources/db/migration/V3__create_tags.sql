CREATE TABLE tags (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE snippet_tags (
    snippet_id BIGINT NOT NULL,
    tag_id BIGINT NOT NULL,
    PRIMARY KEY (snippet_id, tag_id),
    FOREIGN KEY (snippet_id) REFERENCES snippets(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);
