package com.project.library_backend.service;

import com.project.library_backend.dto.user.UserStatsResponse;
import com.project.library_backend.enums.LoanStatus;
import com.project.library_backend.repository.LoanRepository;
import org.springframework.stereotype.Service;

@Service
public class UserStatsService {

    private final LoanRepository loanRepository;

    public UserStatsService(
            LoanRepository loanRepository
    ) {
        this.loanRepository = loanRepository;
    }


    public UserStatsResponse getStats(Long userId) {


        long totalLoans =
                loanRepository.countByUserId(userId);


        long activeLoans =
                loanRepository.countByUserIdAndStatus(
                        userId,
                        LoanStatus.ACTIVE
                );


        long returnedLoans =
                loanRepository.countByUserIdAndStatus(
                        userId,
                        LoanStatus.RETURNED
                );


        long overdueLoans =
                loanRepository.countByUserIdAndStatus(
                        userId,
                        LoanStatus.OVERDUE
                );


        return new UserStatsResponse(
                totalLoans,
                activeLoans,
                returnedLoans,
                overdueLoans
        );
    }
}