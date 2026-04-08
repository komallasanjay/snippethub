package com.snippethub.controller;

import com.snippethub.dto.request.ShareLinkRequest;
import com.snippethub.dto.response.ShareLinkResponse;
import com.snippethub.dto.response.SnippetResponse;
import com.snippethub.security.UserPrincipal;
import com.snippethub.service.ShareService;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/v1/share")
@RequiredArgsConstructor
public class ShareController {

    private final ShareService shareService;
    private final Map<String, Bucket> cache = new ConcurrentHashMap<>();

    private Bucket resolveBucket(String ip) {
        return cache.computeIfAbsent(ip, this::newBucket);
    }

    private Bucket newBucket(String s) {
        Bandwidth limit = Bandwidth.classic(60, Refill.greedy(60, Duration.ofMinutes(1)));
        return Bucket.builder().addLimit(limit).build();
    }

    private String getClientIP(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }

    @PostMapping("/snippets/{id}/links")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ShareLinkResponse> generateShareLink(
            @PathVariable String id,
            @RequestBody ShareLinkRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return new ResponseEntity<>(shareService.generateShareLink(id, request, currentUser), HttpStatus.CREATED);
    }

    @GetMapping("/links/{token}")
    public ResponseEntity<SnippetResponse> resolveShareLink(@PathVariable String token, HttpServletRequest request) {
        Bucket bucket = resolveBucket(getClientIP(request));
        if (bucket.tryConsume(1)) {
            return ResponseEntity.ok(shareService.resolveShareLink(token));
        }
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).build();
    }

    @DeleteMapping("/links/{token}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> revokeShareLink(
            @PathVariable String token,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        shareService.revokeShareLink(token, currentUser);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/snippets/{id}/links")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ShareLinkResponse>> getShareLinks(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(shareService.getShareLinksForSnippet(id, currentUser));
    }
}
