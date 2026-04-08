package com.snippethub.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private String bio;
    private String avatarUrl;
    private String role;
}
