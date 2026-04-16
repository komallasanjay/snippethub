package com.snippethub.service;

import com.snippethub.dto.request.CreateSnippetRequest;
import com.snippethub.dto.request.UpdateSnippetRequest;
import com.snippethub.dto.response.PagedResponse;
import com.snippethub.dto.response.SnippetResponse;
import com.snippethub.dto.response.SnippetSummaryResponse;
import com.snippethub.entity.Snippet;
import com.snippethub.entity.SnippetStar;
import com.snippethub.entity.SnippetStarId;
import com.snippethub.entity.Tag;
import com.snippethub.entity.User;
import com.snippethub.exception.ResourceNotFoundException;
import com.snippethub.exception.UnauthorizedException;
import com.snippethub.repository.SnippetRepository;
import com.snippethub.repository.SnippetStarRepository;
import com.snippethub.repository.UserRepository;
import com.snippethub.security.UserPrincipal;
import com.snippethub.service.mapper.SnippetMapper;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SnippetService {

    private final SnippetRepository snippetRepository;
    private final UserRepository userRepository;
    private final TagService tagService;
    private final SnippetMapper snippetMapper;
    private final SnippetStarRepository snippetStarRepository;

    @Transactional(readOnly = true)
    public PagedResponse<SnippetSummaryResponse> getAllPublicSnippets(int page, int size, String sort, String direction, String query, String language, String tags, String username) {
        Sort.Direction sortDir = direction.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDir, sort));

        Specification<Snippet> spec = (root, cq, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("visibility"), "PUBLIC"));

            if (query != null && !query.isEmpty()) {
                String likeQuery = "%" + query.toLowerCase() + "%";
                Predicate titlePredicate = cb.like(cb.lower(root.get("title")), likeQuery);
                Predicate descPredicate = cb.like(cb.lower(root.get("description")), likeQuery);
                predicates.add(cb.or(titlePredicate, descPredicate));
            }

            if (language != null && !language.isEmpty()) {
                predicates.add(cb.equal(root.get("language"), language));
            }

            if (tags != null && !tags.isEmpty()) {
                String[] tagArray = tags.split(",");
                for (String t : tagArray) {
                    predicates.add(cb.equal(root.join("tags").get("name"), t.trim().toLowerCase()));
                }
            }

            if (username != null && !username.isEmpty()) {
                predicates.add(cb.equal(root.get("owner").get("username"), username));
            }
            
            cq.distinct(true);
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Snippet> snippetsPage = snippetRepository.findAll(spec, pageable);

        List<SnippetSummaryResponse> content = snippetsPage.getContent().stream()
                .map(snippetMapper::toSnippetSummaryResponse)
                .collect(Collectors.toList());

        return new PagedResponse<>(
                content,
                snippetsPage.getNumber(),
                snippetsPage.getSize(),
                snippetsPage.getTotalElements(),
                snippetsPage.getTotalPages(),
                snippetsPage.isLast()
        );
    }

    @Transactional
    public SnippetResponse createSnippet(CreateSnippetRequest request, UserPrincipal currentUser) {
        User owner = userRepository.findById(currentUser.getId()).orElseThrow(
                () -> new ResourceNotFoundException("User not found")
        );

        Set<Tag> tags = tagService.findOrCreateTags(request.getTags());

        Snippet snippet = Snippet.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .code(request.getCode())
                .language(request.getLanguage())
                .visibility(request.getVisibility() != null ? request.getVisibility() : "PRIVATE")
                .owner(owner)
                .tags(tags)
                .viewCount(0L)
                .copyCount(0L)
                .starCount(0L)
                .build();

        snippet = snippetRepository.save(snippet);
        return snippetMapper.toSnippetResponse(snippet);
    }

    @Transactional
    public SnippetResponse getSnippetById(String snippetId, UserPrincipal currentUser) {
        Snippet snippet = snippetRepository.findByPublicId(snippetId).orElseThrow(
                () -> new ResourceNotFoundException("Snippet not found")
        );

        if (!snippet.getVisibility().equals("PUBLIC")) {
            if (currentUser == null || !snippet.getOwner().getId().equals(currentUser.getId())) {
                 if (snippet.getVisibility().equals("PRIVATE")) {
                     throw new UnauthorizedException("You do not have permission to view this snippet");
                 }
            }
        }

        if (currentUser == null || !snippet.getOwner().getId().equals(currentUser.getId())) {
            snippet.setViewCount(snippet.getViewCount() + 1);
            snippetRepository.save(snippet);
        }

        return snippetMapper.toSnippetResponse(snippet);
    }

    @Transactional
    public SnippetResponse updateSnippet(String snippetId, UpdateSnippetRequest request, UserPrincipal currentUser) {
        Snippet snippet = snippetRepository.findByPublicId(snippetId).orElseThrow(
                () -> new ResourceNotFoundException("Snippet not found")
        );

        if (!snippet.getOwner().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You are not the owner of this snippet");
        }

        if (request.getTitle() != null) snippet.setTitle(request.getTitle());
        if (request.getDescription() != null) snippet.setDescription(request.getDescription());
        if (request.getCode() != null) snippet.setCode(request.getCode());
        if (request.getLanguage() != null) snippet.setLanguage(request.getLanguage());
        if (request.getVisibility() != null) snippet.setVisibility(request.getVisibility());

        if (request.getTags() != null) {
            Set<Tag> tags = tagService.findOrCreateTags(request.getTags());
            snippet.setTags(tags);
        }

        snippet = snippetRepository.save(snippet);
        return snippetMapper.toSnippetResponse(snippet);
    }

    @Transactional
    public void deleteSnippet(String snippetId, UserPrincipal currentUser) {
        Snippet snippet = snippetRepository.findByPublicId(snippetId).orElseThrow(
                () -> new ResourceNotFoundException("Snippet not found")
        );

        if (!snippet.getOwner().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You are not the owner of this snippet");
        }

        snippetRepository.delete(snippet);
    }

    @Transactional(readOnly = true)
    public PagedResponse<SnippetSummaryResponse> getMySnippets(UserPrincipal currentUser, int page, int size, String sort, String direction, String query) {
        Sort.Direction sortDir = direction.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDir, sort));

        Specification<Snippet> spec = (root, cq, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("owner").get("id"), currentUser.getId()));

            if (query != null && !query.isEmpty()) {
                String likeQuery = "%" + query.toLowerCase() + "%";
                Predicate titlePredicate = cb.like(cb.lower(root.get("title")), likeQuery);
                Predicate descPredicate = cb.like(cb.lower(root.get("description")), likeQuery);
                predicates.add(cb.or(titlePredicate, descPredicate));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Snippet> snippets = snippetRepository.findAll(spec, pageable);
        List<SnippetSummaryResponse> content = snippets.getContent().stream()
                .map(snippetMapper::toSnippetSummaryResponse)
                .collect(Collectors.toList());

        return new PagedResponse<>(
                content,
                snippets.getNumber(),
                snippets.getSize(),
                snippets.getTotalElements(),
                snippets.getTotalPages(),
                snippets.isLast()
        );
    }

    @Transactional
    public void incrementCopyCount(String snippetId) {
        Snippet snippet = snippetRepository.findByPublicId(snippetId).orElseThrow(
            () -> new ResourceNotFoundException("Snippet not found")
        );
        snippet.setCopyCount(snippet.getCopyCount() + 1);
        snippetRepository.save(snippet);
    }

    @Transactional
    public void toggleStar(String snippetId, UserPrincipal currentUser) {
        Snippet snippet = snippetRepository.findByPublicId(snippetId).orElseThrow(
                () -> new ResourceNotFoundException("Snippet not found")
        );
        User user = userRepository.findById(currentUser.getId()).orElseThrow(
                () -> new ResourceNotFoundException("User not found")
        );
        SnippetStarId starId = new SnippetStarId(user.getId(), snippet.getId());
        
        snippetStarRepository.findById(starId).ifPresentOrElse(
            star -> {
                snippetStarRepository.delete(star);
                snippet.setStarCount(Math.max(0, snippet.getStarCount() - 1));
            },
            () -> {
                SnippetStar newStar = SnippetStar.builder()
                        .id(starId)
                        .user(user)
                        .snippet(snippet)
                        .build();
                snippetStarRepository.save(newStar);
                snippet.setStarCount(snippet.getStarCount() + 1);
            }
        );
        snippetRepository.save(snippet);
    }

    @Transactional(readOnly = true)
    public PagedResponse<SnippetSummaryResponse> getStarredSnippets(UserPrincipal currentUser, Pageable pageable) {
        Page<SnippetStar> stars = snippetStarRepository.findByUserId(currentUser.getId(), pageable);
        List<SnippetSummaryResponse> content = stars.getContent().stream()
                .map(star -> snippetMapper.toSnippetSummaryResponse(star.getSnippet()))
                .collect(Collectors.toList());

        return new PagedResponse<>(
                content,
                stars.getNumber(),
                stars.getSize(),
                stars.getTotalElements(),
                stars.getTotalPages(),
                stars.isLast()
        );
    }

    @Transactional(readOnly = true)
    public List<String> getLanguages() {
        return snippetRepository.findDistinctLanguages();
    }
}
