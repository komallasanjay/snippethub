package com.snippethub.controller;

import com.snippethub.dto.request.LoginRequest;
import com.snippethub.dto.request.RegisterRequest;
import com.snippethub.dto.request.RefreshTokenRequest;
import com.snippethub.dto.response.AuthResponse;
import com.snippethub.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        return ResponseEntity.ok(authService.authenticateUser(loginRequest));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> registerUser(@Valid @RequestBody RegisterRequest signUpRequest) {
        AuthResponse response = authService.registerUser(signUpRequest);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        return ResponseEntity.ok(authService.refreshToken(request.getRefreshToken()));
    }
    
    @PostMapping("/logout")
    public ResponseEntity<String> logoutUser() {
        return ResponseEntity.ok("User logged out successfully");
    }
}
