CREATE TABLE collections (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    owner_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE snippet_collections (
    snippet_id BIGINT NOT NULL,
    collection_id BIGINT NOT NULL,
    PRIMARY KEY (snippet_id, collection_id),
    FOREIGN KEY (snippet_id) REFERENCES snippets(id) ON DELETE CASCADE,
    FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE CASCADE
);
