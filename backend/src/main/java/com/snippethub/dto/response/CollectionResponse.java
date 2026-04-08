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
public class CollectionResponse {
    private Long id;
    private String name;
    private String description;
    private boolean isPublic;
    private UserResponse owner;
    private Set<SnippetSummaryResponse> snippets;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
