CREATE TABLE app_user
(
    id         BIGSERIAL PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    email      VARCHAR(150) NOT NULL,
    password   VARCHAR(255) NOT NULL,
    role       VARCHAR(30)  NOT NULL,
    created_at TIMESTAMP    NOT NULL,
    updated_at TIMESTAMP    NOT NULL,

    CONSTRAINT uk_app_user_email UNIQUE (email)
);

CREATE TABLE book
(
    id         BIGSERIAL PRIMARY KEY,
    title      VARCHAR(200) NOT NULL,
    author     VARCHAR(150) NOT NULL,
    isbn       VARCHAR(20)  NOT NULL,
    genre      VARCHAR(100) NOT NULL,
    status     VARCHAR(30)  NOT NULL,
    created_at TIMESTAMP    NOT NULL,
    updated_at TIMESTAMP    NOT NULL,

    CONSTRAINT uk_book_isbn UNIQUE (isbn)
);
