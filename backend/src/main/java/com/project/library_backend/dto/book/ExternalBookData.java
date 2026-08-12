package com.project.library_backend.dto.book;

public record ExternalBookData(
        String isbn,
        String title,
        String author,
        Integer year,
        String genre,
        String description,
        String coverUrl
) {
}