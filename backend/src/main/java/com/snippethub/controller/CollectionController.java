package com.snippethub.controller;

import com.snippethub.dto.request.CreateCollectionRequest;
import com.snippethub.dto.response.CollectionResponse;
import com.snippethub.dto.response.PagedResponse;
import com.snippethub.security.UserPrincipal;
import com.snippethub.service.CollectionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/collections")
@RequiredArgsConstructor
public class CollectionController {

    private final CollectionService collectionService;

    @GetMapping("/my")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PagedResponse<CollectionResponse>> getMyCollections(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(collectionService.getMyCollections(currentUser, PageRequest.of(page, size)));
    }

    @GetMapping("/public")
    public ResponseEntity<PagedResponse<CollectionResponse>> getPublicCollections(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(collectionService.getPublicCollections(PageRequest.of(page, size)));
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<CollectionResponse> createCollection(
            @Valid @RequestBody CreateCollectionRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return new ResponseEntity<>(collectionService.createCollection(request, currentUser), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CollectionResponse> getCollectionById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(collectionService.getCollectionById(id, currentUser));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> deleteCollection(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        collectionService.deleteCollection(id, currentUser);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/snippets/{snippetId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> addSnippetToCollection(
            @PathVariable Long id,
            @PathVariable String snippetId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        collectionService.addSnippetToCollection(id, snippetId, currentUser);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/snippets/{snippetId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> removeSnippetFromCollection(
            @PathVariable Long id,
            @PathVariable String snippetId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        collectionService.removeSnippetFromCollection(id, snippetId, currentUser);
        return ResponseEntity.ok().build();
    }
}
