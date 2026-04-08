package com.snippethub.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class ShareLinkResponse {
    private String token;
    private Long snippetId;
    private LocalDateTime expiresAt;
    private Integer maxViews;
    private Integer viewCount;
    private LocalDateTime createdAt;
}
