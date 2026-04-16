package com.snippethub.controller;

import com.snippethub.dto.request.CreateSnippetRequest;
import com.snippethub.dto.request.UpdateSnippetRequest;
import com.snippethub.dto.response.PagedResponse;
import com.snippethub.dto.response.SnippetResponse;
import com.snippethub.dto.response.SnippetSummaryResponse;
import com.snippethub.security.UserPrincipal;
import com.snippethub.service.SnippetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/snippets")
@RequiredArgsConstructor
public class SnippetController {

    private final SnippetService snippetService;

    @GetMapping
    public ResponseEntity<PagedResponse<SnippetSummaryResponse>> getAllSnippets(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sort,
            @RequestParam(defaultValue = "desc") String direction,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String language,
            @RequestParam(required = false) String tags,
            @RequestParam(required = false) String username
    ) {
        return ResponseEntity.ok(snippetService.getAllPublicSnippets(page, size, sort, direction, q, language, tags, username));
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<SnippetResponse> createSnippet(
            @Valid @RequestBody CreateSnippetRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return new ResponseEntity<>(snippetService.createSnippet(request, currentUser), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SnippetResponse> getSnippetById(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(snippetService.getSnippetById(id, currentUser));
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<SnippetResponse> updateSnippet(
            @PathVariable String id,
            @Valid @RequestBody UpdateSnippetRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(snippetService.updateSnippet(id, request, currentUser));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteSnippet(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        snippetService.deleteSnippet(id, currentUser);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/my")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PagedResponse<SnippetSummaryResponse>> getMySnippets(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sort,
            @RequestParam(defaultValue = "desc") String direction,
            @RequestParam(required = false) String q) {
        return ResponseEntity.ok(snippetService.getMySnippets(currentUser, page, size, sort, direction, q));
    }

    @PostMapping("/{id}/copy")
    public ResponseEntity<Void> copySnippet(@PathVariable String id) {
        snippetService.incrementCopyCount(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/star")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> toggleStar(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        snippetService.toggleStar(id, currentUser);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/starred")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PagedResponse<SnippetSummaryResponse>> getStarredSnippets(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(snippetService.getStarredSnippets(currentUser, PageRequest.of(page, size)));
    }

    @GetMapping("/languages")
    public ResponseEntity<java.util.List<String>> getLanguages() {
        return ResponseEntity.ok(snippetService.getLanguages());
    }
}
