package com.project.library_backend.service;

import com.project.library_backend.entity.AppUser;
import com.project.library_backend.exception.DuplicateEmailException;
import com.project.library_backend.exception.UserNotFoundException;
import com.project.library_backend.repository.AppUserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AppUserService {

    private final AppUserRepository appUserRepository;

    public AppUserService(AppUserRepository appUserRepository) {
        this.appUserRepository = appUserRepository;
    }

    public AppUser create(AppUser user) {

        if (appUserRepository.existsByEmail(user.getEmail())) {
            throw new DuplicateEmailException(
                    "A user with email " + user.getEmail() + " already exists"
            );
        }

        return appUserRepository.save(user);
    }

    public AppUser findById(Long id) {

        return appUserRepository.findById(id)
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "User with id " + id + " not found"
                        )
                );
    }

    public AppUser findByEmail(String email) {

        return appUserRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "User with email " + email + " not found"
                        )
                );
    }

    public List<AppUser> findAll() {
        return appUserRepository.findAll();
    }

    public AppUser update(Long id, AppUser user) {

        AppUser existingUser = findById(id);

        if (!existingUser.getEmail().equals(user.getEmail())
                && appUserRepository.existsByEmail(user.getEmail())) {

            throw new DuplicateEmailException(
                    "A user with email " + user.getEmail() + " already exists"
            );
        }

        existingUser.setName(user.getName());
        existingUser.setEmail(user.getEmail());
        existingUser.setPassword(user.getPassword());
        existingUser.setRole(user.getRole());

        return appUserRepository.save(existingUser);
    }

    public void delete(Long id) {

        AppUser user = findById(id);

        appUserRepository.delete(user);
    }
}