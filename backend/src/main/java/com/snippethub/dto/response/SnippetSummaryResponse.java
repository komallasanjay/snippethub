package com.snippethub.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class SnippetSummaryResponse {
    private String id;
    private String title;
    private String description;
    private String language;
    private String visibility;
    private Long viewCount;
    private Long copyCount;
    private Long starCount;
    private Set<String> tags;
    private UserResponse owner;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
