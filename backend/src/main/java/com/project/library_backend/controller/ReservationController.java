package com.project.library_backend.controller;


import com.project.library_backend.dto.reservation.CreateReservationRequest;
import com.project.library_backend.dto.reservation.ReservationResponse;
import com.project.library_backend.entity.Reservation;
import com.project.library_backend.enums.ReservationStatus;
import com.project.library_backend.service.ReservationService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("api/reservations")
public class ReservationController {


    private final ReservationService reservationService;


    public ReservationController(
            ReservationService reservationService
    ) {
        this.reservationService = reservationService;
    }



    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ReservationResponse create(
            @Valid @RequestBody CreateReservationRequest request
    ) {

        Reservation reservation =
                reservationService.create(
                        request.getUserId(),
                        request.getBookId()
                );


        return map(reservation);
    }



    @GetMapping
    public List<ReservationResponse> findAll() {

        return reservationService.findAll()
                .stream()
                .map(this::map)
                .toList();
    }



    @GetMapping("/{id}")
    public ReservationResponse findById(
            @PathVariable Long id
    ) {

        return map(
                reservationService.findById(id)
        );
    }



    @GetMapping("/user/{userId}")
    public List<ReservationResponse> findByUser(
            @PathVariable Long userId
    ) {

        return reservationService.findByUser(userId)
                .stream()
                .map(this::map)
                .toList();
    }



    @GetMapping("/book/{bookId}")
    public List<ReservationResponse> findByBook(
            @PathVariable Long bookId
    ) {

        return reservationService.findByBook(bookId)
                .stream()
                .map(this::map)
                .toList();
    }



    @GetMapping("/status/{status}")
    public List<ReservationResponse> findByStatus(
            @PathVariable ReservationStatus status
    ) {

        return reservationService.findByStatus(status)
                .stream()
                .map(this::map)
                .toList();
    }



    @PatchMapping("/{id}/cancel")
    public ReservationResponse cancel(
            @PathVariable Long id
    ) {

        return map(
                reservationService.cancel(id)
        );
    }



    private ReservationResponse map(
            Reservation reservation
    ) {

        ReservationResponse response =
                new ReservationResponse();


        response.setId(
                reservation.getId()
        );

        response.setUserId(
                reservation.getUser().getId()
        );

        response.setBookId(
                reservation.getBook().getId()
        );

        response.setReservedAt(
                reservation.getReservedAt()
        );

        response.setStatus(
                reservation.getStatus()
        );

        response.setCreatedAt(
                reservation.getCreatedAt()
        );

        response.setUpdatedAt(
                reservation.getUpdatedAt()
        );


        return response;
    }
}