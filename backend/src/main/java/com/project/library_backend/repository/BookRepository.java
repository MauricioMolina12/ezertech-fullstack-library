package com.project.library_backend.repository;

import com.project.library_backend.entity.Book;
import com.project.library_backend.enums.BookStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BookRepository extends JpaRepository<Book, Long> {

    Optional<Book> findByIsbn(String isbn);

    boolean existsByIsbn(String isbn);

    List<Book> findByStatus(BookStatus status);

    List<Book> findByTitleContainingIgnoreCase(String title);

    long countByStatus(BookStatus status);
}