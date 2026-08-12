package com.project.library_backend.service;

import com.project.library_backend.dto.dashboard.DashboardStatsResponse;
import com.project.library_backend.enums.BookStatus;
import com.project.library_backend.enums.LoanStatus;
import com.project.library_backend.repository.AppUserRepository;
import com.project.library_backend.repository.BookRepository;
import com.project.library_backend.repository.LoanRepository;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    private final BookRepository bookRepository;
    private final AppUserRepository userRepository;
    private final LoanRepository loanRepository;


    public DashboardService(
            BookRepository bookRepository,
            AppUserRepository userRepository,
            LoanRepository loanRepository
    ) {
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
        this.loanRepository = loanRepository;
    }


    public DashboardStatsResponse getStats() {


        long totalBooks = bookRepository.count();

        long availableBooks =
                bookRepository.countByStatus(BookStatus.AVAILABLE);

        long loanedBooks =
                bookRepository.countByStatus(BookStatus.LOANED);

        long reservedBooks =
                bookRepository.countByStatus(BookStatus.RESERVED);


        long totalUsers =
                userRepository.count();


        long activeLoans =
                loanRepository.countByStatus(LoanStatus.ACTIVE);


        long overdueLoans =
                loanRepository.countByStatus(LoanStatus.OVERDUE);


        return new DashboardStatsResponse(
                totalBooks,
                availableBooks,
                loanedBooks,
                reservedBooks,
                totalUsers,
                activeLoans,
                overdueLoans
        );
    }
}