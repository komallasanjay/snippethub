package com.snippethub.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    private String tokenType;
    private UserResponse user;
}
