package com.project.library_backend.dto.reservation;

import jakarta.validation.constraints.NotNull;

public class CreateReservationRequest {

    @NotNull(message = "User id is required")
    private Long userId;


    @NotNull(message = "Book id is required")
    private Long bookId;


    public Long getUserId() {
        return userId;
    }


    public void setUserId(Long userId) {
        this.userId = userId;
    }


    public Long getBookId() {
        return bookId;
    }


    public void setBookId(Long bookId) {
        this.bookId = bookId;
    }
}