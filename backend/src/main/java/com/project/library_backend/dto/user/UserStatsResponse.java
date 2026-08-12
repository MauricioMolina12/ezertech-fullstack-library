package com.project.library_backend.dto.user;

public record UserStatsResponse(
        long totalLoans,
        long activeLoans,
        long returnedLoans,
        long overdueLoans
) {
}