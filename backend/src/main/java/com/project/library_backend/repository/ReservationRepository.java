package com.project.library_backend.repository;

import com.project.library_backend.entity.Reservation;
import com.project.library_backend.enums.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    List<Reservation> findByUserId(Long userId);

    List<Reservation> findByBookId(Long bookId);

    List<Reservation> findByStatus(ReservationStatus status);

    boolean existsByUserIdAndBookIdAndStatusIn(
            Long userId,
            Long bookId,
            List<ReservationStatus> statuses
    );

    Optional<Reservation> findFirstByBookIdAndStatusOrderByReservedAtAsc(
            Long bookId,
            ReservationStatus status
    );
}