package com.snippethub.service;

import com.snippethub.dto.request.CreateCommentRequest;
import com.snippethub.dto.response.CommentResponse;
import com.snippethub.dto.response.PagedResponse;
import com.snippethub.entity.Comment;
import com.snippethub.entity.Snippet;
import com.snippethub.entity.User;
import com.snippethub.exception.ResourceNotFoundException;
import com.snippethub.exception.UnauthorizedException;
import com.snippethub.repository.CommentRepository;
import com.snippethub.repository.SnippetRepository;
import com.snippethub.repository.UserRepository;
import com.snippethub.security.UserPrincipal;
import com.snippethub.service.mapper.SnippetMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final SnippetRepository snippetRepository;
    private final UserRepository userRepository;
    private final SnippetMapper snippetMapper;

    @Transactional
    public CommentResponse addComment(String snippetId, CreateCommentRequest request, UserPrincipal currentUser) {
        Snippet snippet = snippetRepository.findByPublicId(snippetId)
                .orElseThrow(() -> new ResourceNotFoundException("Snippet not found"));

        User author = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Comment parent = null;
        if (request.getParentId() != null) {
            parent = commentRepository.findById(request.getParentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent comment not found"));
        }

        Comment comment = Comment.builder()
                .content(request.getContent())
                .snippet(snippet)
                .author(author)
                .parent(parent)
                .build();

        comment = commentRepository.save(comment);
        return mapToResponse(comment, false);
    }

    @Transactional(readOnly = true)
    public PagedResponse<CommentResponse> getCommentsBySnippet(String snippetId, Pageable pageable) {
        Snippet snippet = snippetRepository.findByPublicId(snippetId)
                .orElseThrow(() -> new ResourceNotFoundException("Snippet not found"));
        Page<Comment> comments = commentRepository.findBySnippetIdAndParentIsNull(snippet.getId(), pageable);

        List<CommentResponse> content = comments.getContent().stream()
                .map(c -> mapToResponse(c, true))
                .collect(Collectors.toList());

        return new PagedResponse<>(
                content,
                comments.getNumber(),
                comments.getSize(),
                comments.getTotalElements(),
                comments.getTotalPages(),
                comments.isLast()
        );
    }

    @Transactional
    public CommentResponse updateComment(Long commentId, String content, UserPrincipal currentUser) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));

        if (!comment.getAuthor().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You can only edit your own comments");
        }

        comment.setContent(content);
        comment = commentRepository.save(comment);
        return mapToResponse(comment, false);
    }

    @Transactional
    public void deleteComment(Long commentId, UserPrincipal currentUser) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));

        boolean isAuthor = comment.getAuthor().getId().equals(currentUser.getId());
        boolean isSnippetOwner = comment.getSnippet().getOwner().getId().equals(currentUser.getId());

        if (!isAuthor && !isSnippetOwner) {
            throw new UnauthorizedException("Not authorized to delete this comment");
        }

        commentRepository.delete(comment);
    }

    private CommentResponse mapToResponse(Comment comment, boolean mapReplies) {
        List<CommentResponse> repliesList = Collections.emptyList();
        if (mapReplies && comment.getReplies() != null) {
            repliesList = comment.getReplies().stream()
                    .map(reply -> mapToResponse(reply, true))
                    .collect(Collectors.toList());
        }

        return CommentResponse.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .author(snippetMapper.toUserResponse(comment.getAuthor()))
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .replies(repliesList) 
                .build();
    }
}
