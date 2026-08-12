package com.project.library_backend.service;

import com.project.library_backend.dto.auth.AuthResponse;
import com.project.library_backend.dto.auth.LoginRequest;
import com.project.library_backend.dto.auth.RegisterRequest;
import com.project.library_backend.entity.AppUser;
import com.project.library_backend.enums.Role;
import com.project.library_backend.exception.DuplicateEmailException;
import com.project.library_backend.repository.AppUserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthService(
            AppUserRepository appUserRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtService jwtService
    ) {
        this.appUserRepository = appUserRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    public AppUser register(RegisterRequest request) {

        if (appUserRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException(
                    "A user with email " + request.getEmail() + " already exists"
            );
        }

        AppUser user = new AppUser();

        user.setName(request.getName());
        user.setEmail(request.getEmail());

        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        user.setRole(
                request.getRole() != null
                        ? request.getRole()
                        : Role.LIBRARIAN
        );

        return appUserRepository.save(user);
    }

    public AuthResponse login(LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        AppUser user = appUserRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new IllegalStateException("Authenticated user not found")
                );

        String token = jwtService.generateToken(user);

        return new AuthResponse(
                token,
                user.getId(),
                user.getName(),
                user.getEmail()
        );
    }
}