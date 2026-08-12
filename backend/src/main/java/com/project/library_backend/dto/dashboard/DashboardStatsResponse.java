package com.project.library_backend.dto.dashboard;

public record DashboardStatsResponse(
        long totalBooks,
        long availableBooks,
        long loanedBooks,
        long reservedBooks,
        long totalUsers,
        long activeLoans,
        long overdueLoans
) {
}