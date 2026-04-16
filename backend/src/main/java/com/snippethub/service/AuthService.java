package com.snippethub.service;

import com.snippethub.dto.request.LoginRequest;
import com.snippethub.dto.request.RegisterRequest;
import com.snippethub.dto.response.AuthResponse;
import com.snippethub.dto.response.UserResponse;
import com.snippethub.entity.User;
import com.snippethub.exception.DuplicateResourceException;
import com.snippethub.repository.UserRepository;
import com.snippethub.security.JwtTokenProvider;
import com.snippethub.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsernameOrEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = tokenProvider.generateToken(authentication);
        String refreshToken = tokenProvider.generateRefreshToken(authentication);
        
        User user = userRepository.findByUsername(loginRequest.getUsernameOrEmail())
                .orElseGet(() -> userRepository.findByEmail(loginRequest.getUsernameOrEmail()).orElseThrow());

        UserResponse userResponse = UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .bio(user.getBio())
                .avatarUrl(user.getAvatarUrl())
                .build();

        return AuthResponse.builder()
                .accessToken(jwt)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .user(userResponse)
                .build();
    }

    public AuthResponse registerUser(RegisterRequest signUpRequest) {
        if(userRepository.existsByUsername(signUpRequest.getUsername())) {
            throw new DuplicateResourceException("Username is already taken!");
        }

        if(userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new DuplicateResourceException("Email Address already in use!");
        }

        User user = User.builder()
                .username(signUpRequest.getUsername())
                .email(signUpRequest.getEmail())
                .passwordHash(passwordEncoder.encode(signUpRequest.getPassword()))
                .build();

        userRepository.save(user);

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsernameOrEmail(user.getUsername());
        loginRequest.setPassword(signUpRequest.getPassword());
        
        return authenticateUser(loginRequest);
    }
    
    public AuthResponse refreshToken(String refreshToken) {
        if (tokenProvider.validateToken(refreshToken)) {
             Long userId = tokenProvider.getUserIdFromJWT(refreshToken);
             User user = userRepository.findById(userId).orElseThrow();
             
             UserPrincipal userPrincipal = UserPrincipal.create(user);
             UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userPrincipal, null, userPrincipal.getAuthorities());
             
             String newAccessToken = tokenProvider.generateToken(authentication);
             
             UserResponse userResponse = UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .bio(user.getBio())
                .avatarUrl(user.getAvatarUrl())
                .build();
                
             return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .user(userResponse)
                .build();
        }
        throw new com.snippethub.exception.UnauthorizedException("Invalid refresh token");
    }
}
