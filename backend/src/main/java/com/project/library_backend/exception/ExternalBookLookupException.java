package com.project.library_backend.exception;

public class ExternalBookLookupException extends RuntimeException {

    public ExternalBookLookupException(String message) {
        super(message);
    }

    public ExternalBookLookupException(String message, Throwable cause) {
        super(message, cause);
    }
}