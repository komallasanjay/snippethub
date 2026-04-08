package com.snippethub.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateProfileRequest {
    private String bio;
    private String avatarUrl;
}
