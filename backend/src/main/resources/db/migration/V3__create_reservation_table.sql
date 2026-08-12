CREATE TABLE reservation
(
    id          BIGSERIAL PRIMARY KEY,

    user_id     BIGINT      NOT NULL,
    book_id     BIGINT      NOT NULL,

    reserved_at TIMESTAMP   NOT NULL,

    status      VARCHAR(30) NOT NULL,

    created_at  TIMESTAMP   NOT NULL,
    updated_at  TIMESTAMP   NOT NULL,

    CONSTRAINT fk_reservation_user
        FOREIGN KEY (user_id)
            REFERENCES app_user (id),

    CONSTRAINT fk_reservation_book
        FOREIGN KEY (book_id)
            REFERENCES book (id)
);