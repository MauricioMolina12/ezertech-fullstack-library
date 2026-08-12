package com.project.library_backend.dto.book;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class OpenLibraryResponse {

    private String title;

    @JsonProperty("publish_date")
    private String publishDate;

    private List<Author> authors;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getPublishDate() {
        return publishDate;
    }

    public void setPublishDate(String publishDate) {
        this.publishDate = publishDate;
    }

    public List<Author> getAuthors() {
        return authors;
    }

    public void setAuthors(List<Author> authors) {
        this.authors = authors;
    }

    public static class Author {

        private String name;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }
    }
}