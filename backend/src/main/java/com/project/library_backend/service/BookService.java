package com.project.library_backend.service;

import com.project.library_backend.entity.Book;
import com.project.library_backend.enums.BookStatus;
import com.project.library_backend.exception.BookNotFoundException;
import com.project.library_backend.exception.DuplicateIsbnException;
import com.project.library_backend.repository.BookRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookService {

    private final BookRepository bookRepository;

    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    public Book create(Book book) {

        if (bookRepository.existsByIsbn(book.getIsbn())) {
            throw new DuplicateIsbnException(
                    "A book with ISBN " + book.getIsbn() + " already exists"
            );
        }

        book.setStatus(BookStatus.AVAILABLE);

        return bookRepository.save(book);
    }

    public Book findById(Long id) {
        return bookRepository.findById(id)
                .orElseThrow(() ->
                        new BookNotFoundException(
                                "Book with id " + id + " not found"
                        )
                );
    }

    public List<Book> findAll() {
        return bookRepository.findAll();
    }

    public List<Book> findByStatus(BookStatus status) {
        return bookRepository.findByStatus(status);
    }

    public List<Book> searchByTitle(String title) {
        return bookRepository.findByTitleContainingIgnoreCase(title);
    }

    public Book findByIsbn(String isbn) {
        return bookRepository.findByIsbn(isbn)
                .orElseThrow(() ->
                        new BookNotFoundException(
                                "Book with ISBN " + isbn + " not found"
                        )
                );
    }

    public Book update(Long id, Book book) {
        Book existingBook = findById(id);

        if (!existingBook.getIsbn().equals(book.getIsbn())
                && bookRepository.existsByIsbn(book.getIsbn())) {

            throw new DuplicateIsbnException(
                    "A book with ISBN " + book.getIsbn() + " already exists"
            );
        }

        existingBook.setTitle(book.getTitle());
        existingBook.setAuthor(book.getAuthor());
        existingBook.setIsbn(book.getIsbn());
        existingBook.setGenre(book.getGenre());

        if (book.getStatus() != null) {
            existingBook.setStatus(book.getStatus());
        }

        return bookRepository.save(existingBook);
    }

    public void delete(Long id) {
        Book book = findById(id);
        bookRepository.delete(book);
    }
}