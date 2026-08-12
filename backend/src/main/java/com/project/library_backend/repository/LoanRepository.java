package com.project.library_backend.repository;

import com.project.library_backend.entity.Loan;
import com.project.library_backend.enums.LoanStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface LoanRepository extends JpaRepository<Loan, Long> {

    List<Loan> findByUserId(Long userId);

    List<Loan> findByBookId(Long bookId);

    List<Loan> findByStatus(LoanStatus status);

    boolean existsByBookIdAndStatus(Long bookId, LoanStatus status);

    @EntityGraph(attributePaths = {"user", "book"})
    List<Loan> findByStatusAndDueDateBefore(
            LoanStatus status,
            LocalDateTime date
    );

    @EntityGraph(attributePaths = {"user", "book"})
    List<Loan> findByStatusAndDueDateBetween(
            LoanStatus status,
            LocalDateTime start,
            LocalDateTime end
    );
}