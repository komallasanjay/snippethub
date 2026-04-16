package com.snippethub.service;

import com.snippethub.dto.request.ShareLinkRequest;
import com.snippethub.dto.response.ShareLinkResponse;
import com.snippethub.dto.response.SnippetResponse;
import com.snippethub.entity.ShareLink;
import com.snippethub.entity.Snippet;
import com.snippethub.entity.User;
import com.snippethub.exception.ResourceNotFoundException;
import com.snippethub.exception.UnauthorizedException;
import com.snippethub.repository.ShareLinkRepository;
import com.snippethub.repository.SnippetRepository;
import com.snippethub.repository.UserRepository;
import com.snippethub.security.UserPrincipal;
import com.snippethub.service.mapper.SnippetMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ShareService {

    private final ShareLinkRepository shareLinkRepository;
    private final SnippetRepository snippetRepository;
    private final UserRepository userRepository;
    private final SnippetMapper snippetMapper;

    @Transactional
    public ShareLinkResponse generateShareLink(String snippetId, ShareLinkRequest request, UserPrincipal currentUser) {
        Snippet snippet = snippetRepository.findByPublicId(snippetId)
                .orElseThrow(() -> new ResourceNotFoundException("Snippet not found"));

        if (!snippet.getOwner().getId().equals(currentUser.getId())) {
             throw new UnauthorizedException("You are not the owner of this snippet");
        }

        User owner = userRepository.findById(currentUser.getId()).orElseThrow();

        ShareLink shareLink = ShareLink.builder()
                .snippet(snippet)
                .expiresAt(request.getExpiresAt())
                .createdBy(owner)
                .build();

        shareLink = shareLinkRepository.save(shareLink);
        return mapToResponse(shareLink);
    }

    @Transactional
    public SnippetResponse resolveShareLink(String token) {
        ShareLink shareLink = shareLinkRepository.findByToken(token)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid or expired share link"));

        if (shareLink.getExpiresAt() != null && shareLink.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new ResourceNotFoundException("Share link has expired");
        }


        Snippet snippet = shareLink.getSnippet();
        snippet.setViewCount(snippet.getViewCount() + 1);
        snippetRepository.save(snippet);

        return snippetMapper.toSnippetResponse(snippet);
    }

    @Transactional
    public void revokeShareLink(String token, UserPrincipal currentUser) {
        ShareLink shareLink = shareLinkRepository.findByToken(token)
                .orElseThrow(() -> new ResourceNotFoundException("Share link not found"));

        if (!shareLink.getSnippet().getOwner().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You are not authorized to revoke this link");
        }

        shareLinkRepository.delete(shareLink);
    }

    @Transactional(readOnly = true)
    public List<ShareLinkResponse> getShareLinksForSnippet(String snippetId, UserPrincipal currentUser) {
        Snippet snippet = snippetRepository.findByPublicId(snippetId)
                .orElseThrow(() -> new ResourceNotFoundException("Snippet not found"));

        if (!snippet.getOwner().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You are not the owner of this snippet");
        }

        return shareLinkRepository.findBySnippetId(snippet.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private ShareLinkResponse mapToResponse(ShareLink shareLink) {
        return ShareLinkResponse.builder()
                .token(shareLink.getToken())
                .snippetId(shareLink.getSnippet().getId())
                .expiresAt(shareLink.getExpiresAt())
                .createdAt(shareLink.getCreatedAt())
                .build();
    }
}
