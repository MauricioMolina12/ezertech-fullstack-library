package com.project.library_backend.controller;

import com.project.library_backend.dto.book.ExternalBookData;
import com.project.library_backend.entity.Book;
import com.project.library_backend.enums.BookStatus;
import com.project.library_backend.service.BookService;
import com.project.library_backend.service.OpenLibraryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
public class BookController {

    private final BookService bookService;
    private final OpenLibraryService openLibraryService;

    public BookController(
            BookService bookService,
            OpenLibraryService openLibraryService
    ) {
        this.bookService = bookService;
        this.openLibraryService = openLibraryService;
    }



    @GetMapping
    public ResponseEntity<List<Book>> findAll() {
        return ResponseEntity.ok(
                bookService.findAll()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Book> findById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                bookService.findById(id)
        );
    }

    @GetMapping("/isbn/{isbn}")
    public ResponseEntity<Book> findByIsbn(
            @PathVariable String isbn
    ) {
        return ResponseEntity.ok(
                bookService.findByIsbn(isbn)
        );
    }

    @GetMapping("/search")
    public ResponseEntity<List<Book>> searchByTitle(
            @RequestParam String title
    ) {
        return ResponseEntity.ok(
                bookService.searchByTitle(title)
        );
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Book>> findByStatus(
            @PathVariable BookStatus status
    ) {
        return ResponseEntity.ok(
                bookService.findByStatus(status)
        );
    }



    @GetMapping("/lookup/{isbn}")
    public ResponseEntity<ExternalBookData> lookupByIsbn(
            @PathVariable String isbn
    ) {
        return openLibraryService.lookupByIsbn(isbn)
                .map(ResponseEntity::ok)
                .orElseGet(() ->
                        ResponseEntity.notFound().build()
                );
    }



    @PostMapping
    public ResponseEntity<Book> create(
            @RequestBody Book book
    ) {
        Book createdBook = bookService.create(book);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(createdBook);
    }



    @PutMapping("/{id}")
    public ResponseEntity<Book> update(
            @PathVariable Long id,
            @RequestBody Book book
    ) {
        return ResponseEntity.ok(
                bookService.update(id, book)
        );
    }



    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id
    ) {
        bookService.delete(id);

        return ResponseEntity.noContent().build();
    }
}