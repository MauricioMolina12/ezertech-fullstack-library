package com.project.library_backend.dto.loan;

import com.project.library_backend.enums.LoanStatus;

import java.time.LocalDateTime;

public class LoanResponse {

    private Long id;

    private Long userId;
    private Long bookId;

    private LocalDateTime loanDate;
    private LocalDateTime dueDate;
    private LocalDateTime returnDate;

    private LocalDateTime reminderSentAt;
    private LocalDateTime overdueNoticeSentAt;

    private LoanStatus status;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public LoanResponse() {
    }

    public LoanResponse(
            Long id,
            Long userId,
            Long bookId,
            LocalDateTime loanDate,
            LocalDateTime dueDate,
            LocalDateTime returnDate,
            LocalDateTime reminderSentAt,
            LocalDateTime overdueNoticeSentAt,
            LoanStatus status,
            LocalDateTime createdAt,
            LocalDateTime updatedAt
    ) {
        this.id = id;
        this.userId = userId;
        this.bookId = bookId;
        this.loanDate = loanDate;
        this.dueDate = dueDate;
        this.returnDate = returnDate;
        this.reminderSentAt = reminderSentAt;
        this.overdueNoticeSentAt = overdueNoticeSentAt;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

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

    public LocalDateTime getLoanDate() {
        return loanDate;
    }

    public void setLoanDate(LocalDateTime loanDate) {
        this.loanDate = loanDate;
    }

    public LocalDateTime getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDateTime dueDate) {
        this.dueDate = dueDate;
    }

    public LocalDateTime getReturnDate() {
        return returnDate;
    }

    public void setReturnDate(LocalDateTime returnDate) {
        this.returnDate = returnDate;
    }

    public LocalDateTime getReminderSentAt() {
        return reminderSentAt;
    }

    public void setReminderSentAt(LocalDateTime reminderSentAt) {
        this.reminderSentAt = reminderSentAt;
    }

    public LocalDateTime getOverdueNoticeSentAt() {
        return overdueNoticeSentAt;
    }

    public void setOverdueNoticeSentAt(LocalDateTime overdueNoticeSentAt) {
        this.overdueNoticeSentAt = overdueNoticeSentAt;
    }

    public LoanStatus getStatus() {
        return status;
    }

    public void setStatus(LoanStatus status) {
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