package com.project.library_backend.dto.book;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class OpenLibrarySearchResponse {

    private List<BookDoc> docs;

    public List<BookDoc> getDocs() {
        return docs;
    }

    public void setDocs(List<BookDoc> docs) {
        this.docs = docs;
    }

    public static class BookDoc {

        private String title;

        @JsonProperty("author_name")
        private List<String> authorName;

        @JsonProperty("first_publish_year")
        private Integer firstPublishYear;

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public List<String> getAuthorName() {
            return authorName;
        }

        public void setAuthorName(List<String> authorName) {
            this.authorName = authorName;
        }

        public Integer getFirstPublishYear() {
            return firstPublishYear;
        }

        public void setFirstPublishYear(Integer firstPublishYear) {
            this.firstPublishYear = firstPublishYear;
        }
    }
}