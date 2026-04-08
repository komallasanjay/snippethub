package com.snippethub.service;

import com.snippethub.dto.request.UpdateProfileRequest;
import com.snippethub.dto.request.ChangePasswordRequest;
import com.snippethub.dto.response.UserResponse;
import com.snippethub.entity.User;
import com.snippethub.exception.ResourceNotFoundException;
import com.snippethub.exception.UnauthorizedException;
import com.snippethub.repository.UserRepository;
import com.snippethub.security.UserPrincipal;
import com.snippethub.service.mapper.SnippetMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final SnippetMapper snippetMapper;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public UserResponse getUserProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return snippetMapper.toUserResponse(user);
    }

    @Transactional
    public UserResponse updateProfile(UpdateProfileRequest request, UserPrincipal currentUser) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        if (request.getBio() != null) user.setBio(request.getBio());
        if (request.getAvatarUrl() != null) user.setAvatarUrl(request.getAvatarUrl());

        user = userRepository.save(user);
        return snippetMapper.toUserResponse(user);
    }

    @Transactional
    public void changePassword(ChangePasswordRequest request, UserPrincipal currentUser) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPasswordHash())) {
            throw new UnauthorizedException("Incorrect old password");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Transactional
    public void deleteAccount(UserPrincipal currentUser) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        userRepository.delete(user);
    }
}
