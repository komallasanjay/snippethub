package com.snippethub.service;

import com.snippethub.dto.request.CreateCollectionRequest;
import com.snippethub.dto.response.CollectionResponse;
import com.snippethub.dto.response.PagedResponse;
import com.snippethub.entity.Collection;
import com.snippethub.entity.Snippet;
import com.snippethub.entity.User;
import com.snippethub.exception.ResourceNotFoundException;
import com.snippethub.exception.UnauthorizedException;
import com.snippethub.repository.CollectionRepository;
import com.snippethub.repository.SnippetRepository;
import com.snippethub.repository.UserRepository;
import com.snippethub.security.UserPrincipal;
import com.snippethub.service.mapper.SnippetMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CollectionService {

    private final CollectionRepository collectionRepository;
    private final SnippetRepository snippetRepository;
    private final UserRepository userRepository;
    private final SnippetMapper snippetMapper;

    @Transactional
    public CollectionResponse createCollection(CreateCollectionRequest request, UserPrincipal currentUser) {
        User owner = userRepository.findById(currentUser.getId()).orElseThrow(
                () -> new ResourceNotFoundException("User not found")
        );

        Collection collection = Collection.builder()
                .name(request.getName())
                .description(request.getDescription())
                .isPublic(request.isPublic())
                .owner(owner)
                .build();

        collection = collectionRepository.save(collection);
        return mapToResponse(collection);
    }

    @Transactional(readOnly = true)
    public CollectionResponse getCollectionById(Long id, UserPrincipal currentUser) {
        Collection collection = collectionRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Collection not found")
        );

        if (!collection.isPublic()) {
            if (currentUser == null || !collection.getOwner().getId().equals(currentUser.getId())) {
                throw new UnauthorizedException("You do not have permission to view this collection");
            }
        }
        return mapToResponse(collection);
    }

    @Transactional
    public void deleteCollection(Long id, UserPrincipal currentUser) {
        Collection collection = collectionRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Collection not found")
        );
        if (!collection.getOwner().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You are not the owner of this collection");
        }
        collectionRepository.delete(collection);
    }

    @Transactional
    public void addSnippetToCollection(Long collectionId, String snippetId, UserPrincipal currentUser) {
        Collection collection = collectionRepository.findById(collectionId).orElseThrow(
                () -> new ResourceNotFoundException("Collection not found")
        );
        if (!collection.getOwner().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You are not the owner of this collection");
        }

        Snippet snippet = snippetRepository.findByPublicId(snippetId).orElseThrow(
                () -> new ResourceNotFoundException("Snippet not found")
        );
        
        collection.getSnippets().add(snippet);
        collectionRepository.save(collection);
    }

    @Transactional
    public void removeSnippetFromCollection(Long collectionId, String snippetId, UserPrincipal currentUser) {
        Collection collection = collectionRepository.findById(collectionId).orElseThrow(
                () -> new ResourceNotFoundException("Collection not found")
        );
        if (!collection.getOwner().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You are not the owner of this collection");
        }

        Snippet snippet = snippetRepository.findByPublicId(snippetId).orElseThrow(
                () -> new ResourceNotFoundException("Snippet not found")
        );

        collection.getSnippets().remove(snippet);
        collectionRepository.save(collection);
    }

    @Transactional(readOnly = true)
    public PagedResponse<CollectionResponse> getMyCollections(UserPrincipal currentUser, Pageable pageable) {
        Page<Collection> collections = collectionRepository.findByOwnerId(currentUser.getId(), pageable);
        List<CollectionResponse> content = collections.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return new PagedResponse<>(
                content,
                collections.getNumber(),
                collections.getSize(),
                collections.getTotalElements(),
                collections.getTotalPages(),
                collections.isLast()
        );
    }

    private CollectionResponse mapToResponse(Collection collection) {
        return CollectionResponse.builder()
                .id(collection.getId())
                .name(collection.getName())
                .description(collection.getDescription())
                .isPublic(collection.isPublic())
                .owner(snippetMapper.toUserResponse(collection.getOwner()))
                .snippets(collection.getSnippets() != null ? collection.getSnippets().stream()
                        .map(snippetMapper::toSnippetSummaryResponse)
                        .collect(Collectors.toSet()) : null)
                .createdAt(collection.getCreatedAt())
                .updatedAt(collection.getUpdatedAt())
                .build();
    }
}
