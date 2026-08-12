package com.project.library_backend.dto.book;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.JsonNode;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class OpenLibraryWorkResponse {

    private String title;

    private JsonNode description;

    private List<String> subjects;


    public String getTitle() {
        return title;
    }


    public void setTitle(String title) {
        this.title = title;
    }


    public JsonNode getDescription() {
        return description;
    }


    public void setDescription(JsonNode description) {
        this.description = description;
    }


    public List<String> getSubjects() {
        return subjects;
    }


    public void setSubjects(List<String> subjects) {
        this.subjects = subjects;
    }
}