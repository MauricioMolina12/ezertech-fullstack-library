package com.project.library_backend.service;

import com.project.library_backend.entity.AppUser;
import com.project.library_backend.entity.Book;
import com.project.library_backend.entity.Reservation;
import com.project.library_backend.enums.ReservationStatus;
import com.project.library_backend.exception.ReservationAlreadyExistsException;
import com.project.library_backend.exception.ReservationNotFoundException;
import com.project.library_backend.repository.ReservationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final AppUserService appUserService;
    private final BookService bookService;
    private final EmailService emailService;


    public ReservationService(
            ReservationRepository reservationRepository,
            AppUserService appUserService,
            BookService bookService,
            EmailService emailService
    ) {
        this.reservationRepository = reservationRepository;
        this.appUserService = appUserService;
        this.bookService = bookService;
        this.emailService = emailService;
    }


    @Transactional
    public Reservation create(
            Long userId,
            Long bookId
    ) {

        AppUser user = appUserService.findById(userId);
        Book book = bookService.findById(bookId);


        boolean exists = reservationRepository
                .existsByUserIdAndBookIdAndStatusIn(
                        userId,
                        bookId,
                        List.of(
                                ReservationStatus.PENDING,
                                ReservationStatus.NOTIFIED
                        )
                );


        if (exists) {
            throw new ReservationAlreadyExistsException(
                    "User already has an active reservation for this book"
            );
        }


        Reservation reservation = new Reservation();

        reservation.setUser(user);
        reservation.setBook(book);
        reservation.setReservedAt(LocalDateTime.now());
        reservation.setStatus(
                ReservationStatus.PENDING
        );


        return reservationRepository.save(reservation);
    }


    public Reservation findById(Long id) {

        return reservationRepository.findById(id)
                .orElseThrow(() ->
                        new ReservationNotFoundException(
                                "Reservation with id "
                                        + id
                                        + " not found"
                        )
                );
    }


    public List<Reservation> findAll() {

        return reservationRepository.findAll();
    }

    public Optional<Reservation> findNextReservation(Long bookId) {

        return reservationRepository
                .findFirstByBookIdAndStatusOrderByReservedAtAsc(
                        bookId,
                        ReservationStatus.PENDING
                );
    }


    public List<Reservation> findByUser(Long userId) {

        appUserService.findById(userId);

        return reservationRepository.findByUserId(userId);
    }


    public List<Reservation> findByBook(Long bookId) {

        bookService.findById(bookId);

        return reservationRepository.findByBookId(bookId);
    }


    public List<Reservation> findByStatus(
            ReservationStatus status
    ) {

        return reservationRepository.findByStatus(status);
    }


    @Transactional
    public Reservation cancel(Long id) {

        Reservation reservation = findById(id);


        if (reservation.getStatus() == ReservationStatus.FULFILLED) {

            throw new IllegalStateException(
                    "Cannot cancel a fulfilled reservation"
            );
        }


        reservation.setStatus(
                ReservationStatus.CANCELLED
        );


        return reservationRepository.save(reservation);
    }


    @Transactional
    public Reservation notifyAvailable(
            Reservation reservation
    ) {

        reservation.setStatus(
                ReservationStatus.NOTIFIED
        );


        emailService.send(
                reservation.getUser().getEmail(),
                "Libro disponible",
                "Hola "
                        + reservation.getUser().getName()
                        + ", el libro '"
                        + reservation.getBook().getTitle()
                        + "' ya está disponible."
        );


        return reservationRepository.save(reservation);
    }


    @Transactional
    public Reservation fulfill(Long id) {

        Reservation reservation = findById(id);


        if (
                reservation.getStatus()
                        != ReservationStatus.NOTIFIED
        ) {

            throw new IllegalStateException(
                    "Reservation is not ready to be fulfilled"
            );
        }


        reservation.setStatus(
                ReservationStatus.FULFILLED
        );


        return reservationRepository.save(reservation);
    }


    public List<Reservation> findPendingByBook(Long bookId) {

        return reservationRepository.findByBookId(bookId)
                .stream()
                .filter(reservation ->
                        reservation.getStatus()
                                == ReservationStatus.PENDING
                )
                .toList();
    }
}