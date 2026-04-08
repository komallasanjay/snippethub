package com.snippethub.controller;

import com.snippethub.dto.request.CreateCommentRequest;
import com.snippethub.dto.response.CommentResponse;
import com.snippethub.dto.response.PagedResponse;
import com.snippethub.security.UserPrincipal;
import com.snippethub.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/snippets/{snippetId}/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @GetMapping
    public ResponseEntity<PagedResponse<CommentResponse>> getComments(
            @PathVariable String snippetId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(commentService.getCommentsBySnippet(snippetId, PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "createdAt"))));
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<CommentResponse> addComment(
            @PathVariable String snippetId,
            @Valid @RequestBody CreateCommentRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return new ResponseEntity<>(commentService.addComment(snippetId, request, currentUser), HttpStatus.CREATED);
    }

    @PutMapping("/{commentId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<CommentResponse> updateComment(
            @PathVariable String snippetId,
            @PathVariable Long commentId,
            @Valid @RequestBody CreateCommentRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(commentService.updateComment(commentId, request.getContent(), currentUser));
    }

    @DeleteMapping("/{commentId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteComment(
            @PathVariable String snippetId, 
            @PathVariable Long commentId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        commentService.deleteComment(commentId, currentUser);
        return ResponseEntity.ok().build();
    }
}
