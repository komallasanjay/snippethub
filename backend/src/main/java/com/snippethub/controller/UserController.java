package com.snippethub.controller;

import com.snippethub.dto.request.ChangePasswordRequest;
import com.snippethub.dto.request.UpdateProfileRequest;
import com.snippethub.dto.response.UserResponse;
import com.snippethub.security.UserPrincipal;
import com.snippethub.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/{username}")
    public ResponseEntity<UserResponse> getUserProfile(@PathVariable String username) {
        return ResponseEntity.ok(userService.getUserProfile(username));
    }

    @PutMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserResponse> updateProfile(
            @Valid @RequestBody UpdateProfileRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(userService.updateProfile(request, currentUser));
    }

    @PutMapping("/me/password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        userService.changePassword(request, currentUser);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> deleteAccount(@AuthenticationPrincipal UserPrincipal currentUser) {
        userService.deleteAccount(currentUser);
        return ResponseEntity.ok().build();
    }
}
