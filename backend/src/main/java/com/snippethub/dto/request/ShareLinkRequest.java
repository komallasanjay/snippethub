package com.snippethub.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ShareLinkRequest {
    private LocalDateTime expiresAt;
}
