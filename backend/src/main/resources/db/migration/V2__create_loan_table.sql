CREATE TABLE loan
(
    id          BIGSERIAL PRIMARY KEY,

    user_id     BIGINT      NOT NULL,
    book_id     BIGINT      NOT NULL,

    loan_date   TIMESTAMP   NOT NULL,
    due_date    TIMESTAMP   NOT NULL,
    returned_at TIMESTAMP,

    status      VARCHAR(30) NOT NULL,

    created_at  TIMESTAMP   NOT NULL,
    updated_at  TIMESTAMP   NOT NULL,

    CONSTRAINT fk_loan_user
        FOREIGN KEY (user_id)
            REFERENCES app_user (id),

    CONSTRAINT fk_loan_book
        FOREIGN KEY (book_id)
            REFERENCES book (id)
);