ALTER TABLE snippets ADD COLUMN public_id VARCHAR(36);
UPDATE snippets SET public_id = UUID() WHERE public_id IS NULL;
ALTER TABLE snippets MODIFY public_id VARCHAR(36) NOT NULL UNIQUE;
