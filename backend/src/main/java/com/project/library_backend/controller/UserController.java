package com.project.library_backend.controller;

import com.project.library_backend.dto.user.UserResponse;
import com.project.library_backend.dto.user.UserStatsResponse;
import com.project.library_backend.entity.AppUser;
import com.project.library_backend.service.AppUserService;
import com.project.library_backend.service.UserStatsService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final AppUserService userService;
    private final UserStatsService userStatsService;

    public UserController(
            AppUserService userService,
            UserStatsService userStatsService
    ) {
        this.userService = userService;
        this.userStatsService = userStatsService;
    }


    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUser(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                userService.findByIdResponse(id)
        );
    }


    @GetMapping
    public ResponseEntity<List<UserResponse>> findAll() {

        return ResponseEntity.ok(
                userService.findAllResponse()
        );
    }


    @PostMapping
    public ResponseEntity<AppUser> create(
            @RequestBody AppUser user
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        userService.create(user)
                );
    }


    @PutMapping("/{id}")
    public ResponseEntity<AppUser> update(
            @PathVariable Long id,
            @RequestBody AppUser user
    ) {

        return ResponseEntity.ok(
                userService.update(id, user)
        );
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id
    ) {

        userService.delete(id);

        return ResponseEntity.noContent().build();
    }


    @GetMapping("/{id}/stats")
    public ResponseEntity<UserStatsResponse> getStats(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                userStatsService.getStats(id)
        );
    }
}