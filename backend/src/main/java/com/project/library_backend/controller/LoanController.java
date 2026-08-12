package com.project.library_backend.controller;

import com.project.library_backend.dto.loan.CreateLoanRequest;
import com.project.library_backend.dto.loan.LoanResponse;
import com.project.library_backend.entity.Loan;
import com.project.library_backend.enums.LoanStatus;
import com.project.library_backend.mapper.LoanMapper;
import com.project.library_backend.service.LoanService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/loans")
public class LoanController {

    private final LoanService loanService;
    private final LoanMapper loanMapper;

    public LoanController(
            LoanService loanService,
            LoanMapper loanMapper
    ) {
        this.loanService = loanService;
        this.loanMapper = loanMapper;
    }

    @PostMapping
    public ResponseEntity<LoanResponse> create(
            @RequestBody CreateLoanRequest request
    ) {

        Loan loan = loanService.create(
                request.getUserId(),
                request.getBookId(),
                request.getDueDate()
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(loanMapper.toResponse(loan));
    }

    @GetMapping
    public ResponseEntity<List<LoanResponse>> findAll() {

        List<LoanResponse> response = loanService.findAll()
                .stream()
                .map(loanMapper::toResponse)
                .toList();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LoanResponse> findById(
            @PathVariable Long id
    ) {

        Loan loan = loanService.findById(id);

        return ResponseEntity.ok(
                loanMapper.toResponse(loan)
        );
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<LoanResponse>> findByUser(
            @PathVariable Long userId
    ) {

        List<LoanResponse> response = loanService.findByUser(userId)
                .stream()
                .map(loanMapper::toResponse)
                .toList();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/book/{bookId}")
    public ResponseEntity<List<LoanResponse>> findByBook(
            @PathVariable Long bookId
    ) {

        List<LoanResponse> response = loanService.findByBook(bookId)
                .stream()
                .map(loanMapper::toResponse)
                .toList();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<LoanResponse>> findByStatus(
            @PathVariable LoanStatus status
    ) {

        List<LoanResponse> response = loanService.findByStatus(status)
                .stream()
                .map(loanMapper::toResponse)
                .toList();

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/return")
    public ResponseEntity<LoanResponse> returnBook(
            @PathVariable Long id
    ) {

        System.out.println("ENTRO A RETURN BOOK ID: " + id);

        Loan loan = loanService.returnBook(id);

        return ResponseEntity.ok(
                loanMapper.toResponse(loan)
        );
    }
}