ALTER TABLE loan
    RENAME COLUMN returned_at TO return_date;

ALTER TABLE loan
    ADD COLUMN reminder_sent_at TIMESTAMP;

ALTER TABLE loan
    ADD COLUMN overdue_notice_sent_at TIMESTAMP;