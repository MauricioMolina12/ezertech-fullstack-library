package com.project.library_backend.service;

import com.project.library_backend.entity.AppUser;
import com.project.library_backend.entity.Book;
import com.project.library_backend.entity.Loan;
import com.project.library_backend.enums.BookStatus;
import com.project.library_backend.enums.LoanStatus;
import com.project.library_backend.enums.ReservationStatus;
import com.project.library_backend.exception.ActiveLoanExistsException;
import com.project.library_backend.exception.BookNotAvailableException;
import com.project.library_backend.exception.LoanAlreadyReturnedException;
import com.project.library_backend.exception.LoanNotFoundException;
import com.project.library_backend.repository.BookRepository;
import com.project.library_backend.repository.LoanRepository;
import com.project.library_backend.repository.ReservationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class LoanService {

    private final LoanRepository loanRepository;
    private final AppUserService appUserService;
    private final BookService bookService;
    private final EmailService emailService;
    private final BookRepository bookRepository;
    private final ReservationService reservationService;
    private final ReservationRepository reservationRepository;

    public LoanService(
            LoanRepository loanRepository,
            AppUserService appUserService,
            BookService bookService,
            EmailService emailService,
            BookRepository bookRepository,
            ReservationService reservationService,
            ReservationRepository reservationRepository

    ) {
        this.loanRepository = loanRepository;
        this.appUserService = appUserService;
        this.bookService = bookService;
        this.emailService = emailService;
        this.bookRepository = bookRepository;
        this.reservationService = reservationService;
        this.reservationRepository = reservationRepository;
    }

    @Transactional
    public Loan create(
            Long userId,
            Long bookId,
            LocalDateTime dueDate
    ) {

        AppUser user = appUserService.findById(userId);
        Book book = bookService.findById(bookId);

        if (book.getStatus() != BookStatus.AVAILABLE) {
            throw new BookNotAvailableException(
                    "Book with id " + bookId + " is not available"
            );
        }

        if (loanRepository.existsByBookIdAndStatus(
                bookId,
                LoanStatus.ACTIVE
        )) {
            throw new ActiveLoanExistsException(
                    "Book with id " + bookId + " already has an active loan"
            );
        }

        if (dueDate == null || !dueDate.isAfter(LocalDateTime.now())) {
            throw new IllegalArgumentException(
                    "Due date must be in the future"
            );
        }

        Loan loan = new Loan();

        loan.setUser(user);
        loan.setBook(book);
        loan.setLoanDate(LocalDateTime.now());
        loan.setDueDate(dueDate);
        loan.setStatus(LoanStatus.ACTIVE);

        book.setStatus(BookStatus.LOANED);

        Loan savedLoan = loanRepository.save(loan);

        emailService.send(
                user.getEmail(),
                "Préstamo creado",
                "Hola " + user.getName() +
                        ", tu préstamo del libro '" +
                        book.getTitle() +
                        "' ha sido creado correctamente.\n\n" +
                        "Fecha de devolución: " + dueDate
        );

        return savedLoan;
    }

    public List<Loan> findAll() {
        return loanRepository.findAll();
    }

    public Loan findById(Long id) {
        return loanRepository.findById(id)
                .orElseThrow(() ->
                        new LoanNotFoundException(
                                "Loan with id " + id + " not found"
                        )
                );
    }

    public List<Loan> findByUser(Long userId) {

        appUserService.findById(userId);

        return loanRepository.findByUserId(userId);
    }

    public List<Loan> findByBook(Long bookId) {

        bookService.findById(bookId);

        return loanRepository.findByBookId(bookId);
    }

    public List<Loan> findByStatus(LoanStatus status) {
        return loanRepository.findByStatus(status);
    }

    @Transactional
    public Loan returnBook(Long id) {

        Loan loan = findById(id);

        if (loan.getStatus() == LoanStatus.RETURNED) {
            throw new LoanAlreadyReturnedException(
                    "Loan with id " + id + " has already been returned"
            );
        }


        loan.setReturnDate(LocalDateTime.now());
        loan.setStatus(LoanStatus.RETURNED);


        Book book = loan.getBook();

        book.setStatus(BookStatus.AVAILABLE);

        bookRepository.save(book);


        Loan savedLoan = loanRepository.save(loan);


        emailService.send(
                loan.getUser().getEmail(),
                "Libro devuelto correctamente",
                "Hola " + loan.getUser().getName()
                        + ",\n\n"
                        + "El libro '" + book.getTitle()
                        + "' ha sido devuelto correctamente.\n\n"
                        + "Fecha de devolución: "
                        + savedLoan.getReturnDate()
                        + "\n\nBiblioteca"
        );



        reservationRepository
                .findFirstByBookIdAndStatusOrderByReservedAtAsc(
                        book.getId(),
                        ReservationStatus.PENDING
                )
                .ifPresent(reservation -> {


                    Loan newLoan = new Loan();


                    newLoan.setUser(
                            reservation.getUser()
                    );


                    newLoan.setBook(
                            book
                    );


                    newLoan.setLoanDate(
                            LocalDateTime.now()
                    );


                    newLoan.setDueDate(
                            LocalDateTime.now()
                                    .plusDays(7)
                    );


                    newLoan.setStatus(
                            LoanStatus.ACTIVE
                    );


                    book.setStatus(
                            BookStatus.LOANED
                    );

                    bookRepository.save(book);


                    reservation.setStatus(
                            ReservationStatus.FULFILLED
                    );


                    loanRepository.save(newLoan);


                    emailService.send(
                            reservation.getUser().getEmail(),
                            "Reserva asignada",
                            "Hola "
                                    + reservation.getUser().getName()
                                    + ",\n\n"
                                    + "El libro '"
                                    + book.getTitle()
                                    + "' que reservaste ya está disponible "
                                    + "y fue prestado automáticamente.\n\n"
                                    + "Fecha límite de devolución: "
                                    + newLoan.getDueDate()
                                    + "\n\nBiblioteca"
                    );

                });


        return savedLoan;
    }
}