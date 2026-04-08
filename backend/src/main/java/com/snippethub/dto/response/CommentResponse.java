package com.snippethub.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class CommentResponse {
    private Long id;
    private String content;
    private UserResponse author;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<CommentResponse> replies;
}
