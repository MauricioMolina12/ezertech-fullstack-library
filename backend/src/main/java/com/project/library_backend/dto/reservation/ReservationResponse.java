package com.project.library_backend.dto.reservation;

import com.project.library_backend.enums.ReservationStatus;

import java.time.LocalDateTime;

public class ReservationResponse {

    private Long id;

    private Long userId;

    private Long bookId;

    private LocalDateTime reservedAt;

    private ReservationStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;


    public Long getId() {
        return id;
    }


    public void setId(Long id) {
        this.id = id;
    }


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


    public LocalDateTime getReservedAt() {
        return reservedAt;
    }


    public void setReservedAt(LocalDateTime reservedAt) {
        this.reservedAt = reservedAt;
    }


    public ReservationStatus getStatus() {
        return status;
    }


    public void setStatus(ReservationStatus status) {
        this.status = status;
    }


    public LocalDateTime getCreatedAt() {
        return createdAt;
    }


    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }


    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }


    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}