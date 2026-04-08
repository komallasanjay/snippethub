CREATE TABLE share_links (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    token VARCHAR(36) NOT NULL UNIQUE,
    snippet_id BIGINT NOT NULL,
    expires_at TIMESTAMP NULL,
    max_views INT NULL,
    view_count INT DEFAULT 0,
    created_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (snippet_id) REFERENCES snippets(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);
