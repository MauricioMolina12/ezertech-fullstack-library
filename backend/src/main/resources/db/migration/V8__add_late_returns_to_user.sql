ALTER TABLE app_user
    ADD COLUMN late_returns INTEGER NOT NULL DEFAULT 0;

ALTER TABLE app_user
    ADD COLUMN late_returns_reset_at TIMESTAMP;