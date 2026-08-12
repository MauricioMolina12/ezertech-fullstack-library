package com.project.library_backend.exception;

public class ActiveLoanExistsException extends RuntimeException {
    public ActiveLoanExistsException(String message) {
        super(message);
    }
}
